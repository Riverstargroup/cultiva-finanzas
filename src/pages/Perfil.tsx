import { motion } from "framer-motion";
import { LogOut, BookOpen, Trophy, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import BotanicalPage from "@/components/layout/BotanicalPage";
import StatCard from "@/components/StatCard";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Perfil() {
  const { profile, loading } = useProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const { data: stats } = useDashboardStats();

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleEdit = () => {
    setName(profile?.full_name || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Nombre actualizado" });
      setEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-[var(--leaf-bright)]/30 transition-colors";

  return (
    <BotanicalPage title="Perfil" subtitle={user?.email || "Tu invernadero personal"}>
      {/* Avatar + Info */}
      <div className="organic-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className="organic-border h-16 w-16 flex items-center justify-center font-heading font-bold text-xl"
            style={{ background: "color-mix(in srgb, var(--leaf-fresh) 20%, transparent)", color: "var(--leaf-bright)" }}
          >
            {loading ? "..." : initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--leaf-muted)" }}>
                  Nombre
                </Label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputClass} max-w-xs`}
                  style={{ background: "var(--soil-warm)", borderColor: "var(--clay-soft)" }}
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="vibrant-btn min-h-[44px] px-5 text-sm">Guardar</button>
                  <button
                    onClick={() => setEditing(false)}
                    className="min-h-[44px] px-5 text-sm rounded-full border font-semibold transition-colors"
                    style={{ background: "transparent", borderColor: "var(--clay-soft)", color: "var(--text-warm)" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-heading font-bold text-lg" style={{ color: "var(--forest-deep)" }}>
                  {loading ? "Cargando..." : profile?.full_name || "Sin nombre"}
                </h2>
                <p className="text-sm" style={{ color: "var(--leaf-muted)" }}>{user?.email}</p>
                <button
                  onClick={handleEdit}
                  className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors min-h-[44px]"
                  style={{ background: "white", borderColor: "var(--clay-soft)", color: "var(--text-warm)" }}
                >
                  Editar nombre
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item}>
          <StatCard title="Escenarios" value={String(stats?.completedScenarios ?? 0)} icon={BookOpen} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Cursos" value={stats?.completedScenarios !== undefined && stats.completedScenarios > 0 ? "1" : "0"} icon={Award} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Logros" value={`${stats?.badgesUnlocked ?? 0}/${stats?.totalBadges ?? 8}`} icon={Trophy} />
        </motion.div>
      </motion.div>

      {/* Sign Out */}
      <button className="vibrant-btn w-full justify-center min-h-[44px] font-bold" onClick={handleSignOut}>
        <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
      </button>
    </BotanicalPage>
  );
}
