import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import type { Course, Scenario, UserCourseProgress } from '@/types/learning'
import type { SenderoNode } from './senderoNodes'

const COURSES_TABLE = 'courses' as never
const SCENARIOS_TABLE = 'scenarios' as never
const USER_COURSE_PROGRESS_TABLE = 'user_course_progress' as never

interface SenderoEntryRoute {
  firstLessonRoute: string
  courseRoute: string
  courseTitle: string | null
  scenarioTitle: string | null
  courses: Course[]
  scenarios: Scenario[]
}

const FALLBACK_ENTRY: SenderoEntryRoute = {
  firstLessonRoute: '/cursos',
  courseRoute: '/cursos',
  courseTitle: null,
  scenarioTitle: null,
  courses: [],
  scenarios: [],
}

export function useSenderoEntryRoute() {
  const { user } = useAuth()

  const query = useQuery({
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

      if (courseError || !courses?.length) return FALLBACK_ENTRY

      const publishedCourses = courses as unknown as Course[]
      const course = publishedCourses[0]
      const courseRoute = `/cursos/${course.id}`
      const courseIds = publishedCourses.map((publishedCourse) => publishedCourse.id)

      const [{ data: scenarios, error: scenarioError }, { data: progress }] = await Promise.all([
        supabase
          .from(SCENARIOS_TABLE)
          .select('*')
          .in('course_id', courseIds)
          .order('course_id')
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
          courses: publishedCourses,
          scenarios: [],
        }
      }

      const allScenarios = scenarios as unknown as Scenario[]
      const courseScenarios = allScenarios.filter((scenario) => scenario.course_id === course.id)
      const completed = ((progress as unknown as UserCourseProgress | null)?.completed_scenarios ?? []) as string[]
      const nextScenario = courseScenarios.find((scenario) => !completed.includes(scenario.id))
        ?? courseScenarios[0]

      return {
        firstLessonRoute: `/cursos/${course.id}/escenario/${nextScenario.id}`,
        courseRoute,
        courseTitle: course.title,
        scenarioTitle: nextScenario.title,
        courses: publishedCourses,
        scenarios: allScenarios,
      }
    },
  })

  const routeForNode = (node: SenderoNode) => {
    const data = query.data
    const targetCourse = node.courseSlug
      ? data?.courses.find((course) => course.slug === node.courseSlug)
      : data?.courses[0]

    if (!targetCourse) return query.data?.firstLessonRoute ?? FALLBACK_ENTRY.firstLessonRoute

    if (node.scenarioOrder) {
      const targetScenario = data?.scenarios.find(
        (scenario) => scenario.course_id === targetCourse.id && scenario.order_index === node.scenarioOrder,
      )

      if (targetScenario) return `/cursos/${targetCourse.id}/escenario/${targetScenario.id}`
    }

    return `/cursos/${targetCourse.id}`
  }

  return { ...query, routeForNode }
}
