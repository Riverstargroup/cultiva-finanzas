import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import type { Course, Scenario, UserCourseProgress } from '@/types/learning'

const COURSES_TABLE = 'courses' as never
const SCENARIOS_TABLE = 'scenarios' as never
const USER_COURSE_PROGRESS_TABLE = 'user_course_progress' as never

interface SenderoEntryRoute {
  firstLessonRoute: string
  courseRoute: string
  courseTitle: string | null
  scenarioTitle: string | null
}

const FALLBACK_ENTRY: SenderoEntryRoute = {
  firstLessonRoute: '/cursos',
  courseRoute: '/cursos',
  courseTitle: null,
  scenarioTitle: null,
}

export function useSenderoEntryRoute() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['sendero-entry-route', user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async (): Promise<SenderoEntryRoute> => {
      if (!user?.id) return FALLBACK_ENTRY

      const { data: courses, error: courseError } = await supabase
        .from(COURSES_TABLE)
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
        .limit(1)

      if (courseError || !courses?.length) return FALLBACK_ENTRY

      const course = courses[0] as unknown as Course
      const courseRoute = `/cursos/${course.id}`

      const [{ data: scenarios, error: scenarioError }, { data: progress }] = await Promise.all([
        supabase
          .from(SCENARIOS_TABLE)
          .select('*')
          .eq('course_id', course.id)
          .order('order_index'),
        supabase
          .from(USER_COURSE_PROGRESS_TABLE)
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .maybeSingle(),
      ])

      if (scenarioError || !scenarios?.length) {
        return {
          firstLessonRoute: courseRoute,
          courseRoute,
          courseTitle: course.title,
          scenarioTitle: null,
        }
      }

      const completed = ((progress as unknown as UserCourseProgress | null)?.completed_scenarios ?? []) as string[]
      const nextScenario = (scenarios as unknown as Scenario[]).find((scenario) => !completed.includes(scenario.id))
        ?? (scenarios as unknown as Scenario[])[0]

      return {
        firstLessonRoute: `/cursos/${course.id}/escenario/${nextScenario.id}`,
        courseRoute,
        courseTitle: course.title,
        scenarioTitle: nextScenario.title,
      }
    },
  })
}
