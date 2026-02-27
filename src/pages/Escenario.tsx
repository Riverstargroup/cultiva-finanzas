import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAuth } from "@/contexts/AuthContext";
import { useScenario } from "@/hooks/useScenario";
import { useCourseDetail } from "@/hooks/useCourseDetail";
import { useProgress } from "@/hooks/useProgress";
import { supabase } from "@/integrations/supabase/client";
import { calculateScore, calculateSM2 } from "@/lib/spacedRepetition";
import { checkAndUnlockAchievements } from "@/lib/achievementChecker";
import { updateSkillsOnCompletion } from "@/lib/skillUpdater";
import { useStreak } from "@/hooks/useStreak";
import { useUserMission } from "@/hooks/useUserMission";
import { useQueryClient } from "@tanstack/react-query";
import DecisionStep from "@/components/scenario/DecisionStep";
import FeedbackStep from "@/components/scenario/FeedbackStep";
import RecallStep from "@/components/scenario/RecallStep";
import BotanicalPage from "@/components/layout/BotanicalPage";
import type { ScenarioOption } from "@/types/learning";

type Step = "decision" | "feedback" | "recall" | "done";

export default function Escenario() {
  const { courseId, scenarioId } = useParams<{ courseId: string; scenarioId: string }>();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: scenario, isLoading: scenarioLoading } = useScenario(scenarioId);
  const { data: courseDetail } = useCourseDetail(courseId);
  const { data: progress, invalidate: invalidateProgress } = useProgress(courseId);
  const { data: streak } = useStreak();
  const { data: missionData } = useUserMission(scenarioId);

  const [step, setStep] = useState<Step>("decision");
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const scenarios = courseDetail?.scenarios ?? [];
  const scenarioIndex = scenarios.findIndex((s) => s.id === scenarioId);
  const isLast = scenarioIndex === scenarios.length - 1;
  const nextScenario = !isLast && scenarioIndex >= 0 ? scenarios[scenarioIndex + 1] : null;

  const handleFinish = useCallback(async (choseBest: boolean, recallCorrect: number, recallTotal: number) => {
    if (!user || !courseId || !scenarioId || saving) return;
    setSaving(true);
    setStep("done");

    try {
      const score = calculateScore(choseBest, recallCorrect, recallTotal);
      setFinalScore(score);

      const { data: existingState } = await supabase
        .from("user_scenario_state" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("scenario_id", scenarioId)
        .maybeSingle();

      const currentState = existingState
        ? { repetitions: (existingState as any).repetitions, interval_days: (existingState as any).interval_days, ease_factor: (existingState as any).ease_factor }
        : { repetitions: 0, interval_days: 1, ease_factor: 2.5 };

      const sm2 = calculateSM2(score, currentState);

      await supabase
        .from("user_scenario_state" as any)
        .upsert({
          user_id: user.id,
          course_id: courseId,
          scenario_id: scenarioId,
          repetitions: sm2.repetitions,
          interval_days: sm2.interval_days,
          ease_factor: sm2.ease_factor,
          next_due_at: sm2.next_due_at,
          last_quality: sm2.last_quality,
          last_score: sm2.last_score,
          last_attempt_at: new Date().toISOString(),
        } as any, { onConflict: "user_id,scenario_id" });

      const { data: existingProgress } = await supabase
        .from("user_course_progress" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      const completedArr: string[] = (existingProgress as any)?.completed_scenarios ?? [];
      const isFirstCompletion = !completedArr.includes(scenarioId);
      const updatedCompleted = isFirstCompletion
        ? [...completedArr, scenarioId]
        : completedArr;

      const completedAt = updatedCompleted.length >= scenarios.length
        ? new Date().toISOString()
        : null;

      if (existingProgress) {
        await supabase
          .from("user_course_progress" as any)
          .update({
            completed_scenarios: updatedCompleted,
            completed_at: completedAt,
            mastery_score: updatedCompleted.length / scenarios.length,
          } as any)
          .eq("user_id", user.id)
          .eq("course_id", courseId);
      } else {
        await supabase
          .from("user_course_progress" as any)
          .insert({
            user_id: user.id,
            course_id: courseId,
            completed_scenarios: updatedCompleted,
            completed_at: completedAt,
            mastery_score: updatedCompleted.length / scenarios.length,
          } as any);
      }

      const today = new Date().toLocaleDateString('en-CA');
      const { data: existingDay } = await supabase
        .from("user_activity_days" as any)
        .select("minutes")
        .eq("user_id", user.id)
        .eq("day", today)
        .maybeSingle();

      if (existingDay) {
        await supabase
          .from("user_activity_days" as any)
          .update({ minutes: ((existingDay as any).minutes ?? 0) + 5 } as any)
          .eq("user_id", user.id)
          .eq("day", today);
      } else {
        await supabase
          .from("user_activity_days" as any)
          .insert({ user_id: user.id, day: today, minutes: 5 } as any);
      }

      await checkAndUnlockAchievements({
        userId: user.id,
        completedScenarios: updatedCompleted,
        totalScenarios: scenarios.length,
        currentScenarioTags: scenario?.tags,
        currentScenarioTitle: scenario?.title,
        streak: (streak ?? 0) + (existingDay ? 0 : 1),
      });

      // Update skills based on tags
      if (isFirstCompletion && scenario?.tags) {
        await updateSkillsOnCompletion(user.id, scenario.tags, score, true);
      }

      invalidateProgress();
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      queryClient.invalidateQueries({ queryKey: ["review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["user-skills"] });
      queryClient.invalidateQueries({ queryKey: ["user-mission"] });
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setSaving(false);
    }
  }, [user, courseId, scenarioId, saving, scenarios, scenario, streak, invalidateProgress, queryClient]);

  if (scenarioLoading) {
    return (
      <BotanicalPage title="Cargando..." subtitle="">
        <div className="organic-card p-8 text-center">
          <p style={{ color: "var(--leaf-muted)" }}>Cargando escenario...</p>
        </div>
      </BotanicalPage>
    );
  }

  if (!scenario || !courseDetail) {
    return (
      <BotanicalPage title="Error" subtitle="">
        <div className="text-center py-8">
          <p style={{ color: "var(--leaf-muted)" }}>Escenario no encontrado.</p>
          <button className="vibrant-btn mt-4 min-h-[44px]" onClick={() => navigate("/cursos")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </button>
        </div>
      </BotanicalPage>
    );
  }

  const handleDecision = (opt: ScenarioOption) => {
    setSelectedOption(opt);
    setStep("feedback");
  };

  const handleFeedbackContinue = () => {
    if (scenario.recall && scenario.recall.length > 0) {
      setStep("recall");
    } else {
      handleFinish(selectedOption!.is_best, 0, 0);
    }
  };

  const handleRecallComplete = (correctCount: number, total: number) => {
    handleFinish(selectedOption!.is_best, correctCount, total);
  };

  const handleNext = () => {
    if (nextScenario) {
      setStep("decision");
      setSelectedOption(null);
      setFinalScore(0);
      navigate(`/cursos/${courseId}/escenario/${nextScenario.id}`, { replace: true });
    } else {
      navigate(`/cursos/${courseId}`);
    }
  };

  return (
    <BotanicalPage
      title={scenario.title}
      subtitle={`Semilla ${scenarioIndex + 1} de ${scenarios.length}`}
    >
      <button
        onClick={() => navigate(`/cursos/${courseId}`)}
        className="flex items-center gap-2 text-sm font-semibold min-h-[44px] transition-colors"
        style={{ color: "var(--leaf-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" /> {courseDetail.title}
      </button>

      <div className="organic-card p-5 md:p-6">
        {step === "decision" && (
          <DecisionStep prompt={scenario.prompt} options={scenario.options} onSelect={handleDecision} />
        )}

        {step === "feedback" && selectedOption && (
          <FeedbackStep
            coaching={scenario.coaching}
            selectedOption={selectedOption}
            mission={scenario.mission}
            scenarioId={scenarioId}
            userId={user?.id}
            missionStatus={missionData?.status ?? null}
            onContinue={handleFeedbackContinue}
          />
        )}

        {step === "recall" && (
          <RecallStep questions={scenario.recall} onComplete={handleRecallComplete} />
        )}

        {step === "done" && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div
              className="organic-border h-16 w-16 mx-auto flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--leaf-fresh) 15%, transparent)" }}
            >
              <Trophy className="h-8 w-8" style={{ color: "var(--leaf-bright)" }} />
            </div>
            <h2 className="font-heading font-bold text-xl" style={{ color: "var(--forest-deep)" }}>
              ¡Semilla completada!
            </h2>
            <p className="text-sm" style={{ color: "var(--leaf-muted)" }}>
              Puntaje: {Math.round(finalScore * 100)}%
            </p>
            <button onClick={handleNext} className="vibrant-btn w-full justify-center min-h-[44px] font-bold">
              {isLast ? "Finalizar curso" : "Siguiente semilla"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>
    </BotanicalPage>
  );
}
