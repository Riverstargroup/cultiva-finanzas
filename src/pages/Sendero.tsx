import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, MessageCircle } from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import { useGarden, useInitGarden } from '@/features/garden/hooks/useGarden'
import { useGardenTick } from '@/features/garden/hooks/useGardenEconomy'
import { GardenAdventureMap } from '@/features/garden/components/GardenAdventureMap'
import { PlantShopDrawer } from '@/features/garden/components/PlantShopDrawer'
import { NopalitoGuide } from '@/features/garden/components/NopalitoGuide'
import { JardinSkeleton } from '@/features/garden/components/JardinSkeleton'
import { JardinWelcome } from '@/features/garden/components/JardinWelcome'
import { LevelUpNotification } from '@/components/LevelUpNotification'
import { OnboardingOverlay } from '@/features/onboarding'
import { useUserLevel } from '@/hooks/useUserLevel'
import { useSenderoEntryRoute } from '@/features/sendero/useSenderoEntryRoute'
import type { SenderoNode } from '@/features/sendero/senderoNodes'
import nopalitoIdle from '@/assets/pixel/optimized/plantamigo-nopalito-idle.webp'

export default function Sendero() {
  const navigate = useNavigate()
  const userLevel = useUserLevel()
  const garden = useGarden()
  const senderoEntry = useSenderoEntryRoute()
  const initGarden = useInitGarden()
  const tick = useGardenTick()

  const [shopOpen, setShopOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  const isNewUser = !garden.isLoading && garden.plots.length === 0

  useEffect(() => {
    if (!garden.isLoading && garden.plots.length > 0) {
      tick.mutate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garden.isLoading, garden.plots.length])

  if (garden.isLoading) return <JardinSkeleton />

  const openFirstLesson = () => navigate(senderoEntry.data?.firstLessonRoute ?? '/cursos')

  const openSenderoNode = (node: SenderoNode) => {
    if (node.action === 'lesson') {
      navigate(senderoEntry.routeForNode(node))
      return
    }
    if (node.action === 'course') {
      navigate(senderoEntry.routeForNode(node))
      return
    }
    if (node.action === 'review') {
      navigate('/flashcards')
      return
    }
    if (node.action === 'game') {
      navigate(node.gameId ? `/juegos?game=${node.gameId}&fromSendero=true` : '/juegos?fromSendero=true')
      return
    }
    setShopOpen(true)
  }

  if (isNewUser) {
    return (
      <PageTransition>
        <div className="botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-32">
          <JardinWelcome
            isPending={initGarden.isPending}
            isError={initGarden.isError}
            onStart={() => initGarden.mutate()}
          />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <LevelUpNotification level={userLevel.level} isLoading={userLevel.isLoading} />
      <OnboardingOverlay onComplete={openFirstLesson} />

      <div className="botanical-bg w-full min-h-full px-4 py-4">
        <GardenAdventureMap
          totalMastery={garden.totalMastery}
          onOpenNode={openSenderoNode}
        />
      </div>

      {/* Botón flotante Nopalito — guía contextual */}
      <button
        type="button"
        onClick={() => setGuideOpen(true)}
        className="fixed z-[120] flex h-[72px] w-[72px] items-center justify-center rounded-full border shadow-[0_14px_34px_rgba(43,79,53,0.24)] transition active:scale-95 md:right-8"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 5rem)',
          right: '1rem',
          borderColor: 'rgba(212,172,117,0.72)',
          background: 'linear-gradient(145deg, #FEFBF6, #EAF4D8)',
        }}
        aria-label="Abrir guia de Nopalito"
      >
        <img
          src={nopalitoIdle}
          alt=""
          className="sprite-clean h-[62px] w-[62px] object-contain"
          style={{ imageRendering: 'pixelated' }}
          aria-hidden="true"
        />
        <span
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full"
          style={{ background: 'var(--forest-deep)', color: '#fff' }}
        >
          <MessageCircle className="h-3.5 w-3.5" />
        </span>
      </button>

      {guideOpen && (
        <div className="fixed inset-0 z-[220] flex items-end bg-black/36 px-3 pb-3 backdrop-blur-sm md:items-center md:justify-center md:p-6">
          <div className="relative max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-[24px]">
            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 shadow-sm"
              style={{ borderColor: 'rgba(212,172,117,0.58)', color: 'var(--forest-deep)' }}
              aria-label="Cerrar guia de Nopalito"
            >
              <X className="h-5 w-5" />
            </button>
            <NopalitoGuide
              totalMastery={garden.totalMastery}
              onOpenCourses={openFirstLesson}
              onOpenGames={() => navigate('/juegos')}
              onOpenFlashcards={() => navigate('/flashcards')}
              onOpenCalculator={() => navigate('/calculadora')}
            />
          </div>
        </div>
      )}

      <PlantShopDrawer
        open={shopOpen}
        onOpenChange={setShopOpen}
        coins={garden.coins}
      />
    </PageTransition>
  )
}
