import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { WeeklyRetos } from '@/features/retos/components/WeeklyRetos'
import { useGarden, useInitGarden } from '@/features/garden/hooks/useGarden'
import { useGardenEconomy, useGardenTick } from '@/features/garden/hooks/useGardenEconomy'
import { useInventory, usePlaceItem } from '@/features/garden/hooks/useInventory'
import { useStreak } from '@/hooks/useStreak'
import GardenErrorBoundary from '@/features/garden/GardenErrorBoundary'
import { BackyardSkyHeader } from '@/features/garden/components/BackyardSkyHeader'
import { GardenEconomyBanner } from '@/features/garden/components/GardenEconomyBanner'
import { BackyardView } from '@/features/garden/components/BackyardView'
import { GardenToolbar } from '@/features/garden/components/GardenToolbar'
import { PlantShopDrawer } from '@/features/garden/components/PlantShopDrawer'
import { InventoryDrawer } from '@/features/garden/components/InventoryDrawer'
import { JardinSkeleton } from '@/features/garden/components/JardinSkeleton'
import { JardinWelcome } from '@/features/garden/components/JardinWelcome'
import { GardenAdventureMap } from '@/features/garden/components/GardenAdventureMap'
import { NopalitoGuide } from '@/features/garden/components/NopalitoGuide'
import { useUserLevel } from '@/hooks/useUserLevel'
import { LevelUpNotification } from '@/components/LevelUpNotification'
import { OnboardingOverlay } from '@/features/onboarding'
import type { InventoryItem } from '@/features/garden/types'

export default function Jardin() {
  const navigate = useNavigate()
  const userLevel = useUserLevel()
  const garden = useGarden()
  const economy = useGardenEconomy()
  const { data: inventory = [] } = useInventory()
  const { data: streakDays = 0 } = useStreak()
  const initGarden = useInitGarden()
  const tick = useGardenTick()
  const placeItem = usePlaceItem()

  const [shopOpen, setShopOpen] = useState(false)
  const [invOpen, setInvOpen] = useState(false)
  const [placing, setPlacing] = useState<InventoryItem | null>(null)

  const isNewUser = !garden.isLoading && garden.plots.length === 0
  const unplacedCount = inventory.filter((i) => !i.isPlaced).length

  // Tick economy once per garden visit (idempotent server-side)
  useEffect(() => {
    if (!garden.isLoading && garden.plots.length > 0) {
      tick.mutate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garden.isLoading, garden.plots.length])

  const handlePlaced = (inventoryId: string, posX: number, posY: number) => {
    placeItem.mutate({ inventoryId, posX, posY })
    setPlacing(null)
  }

  if (garden.isLoading) return <JardinSkeleton />

  if (isNewUser) {
    return (
      <PageTransition>
        <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <JardinWelcome
              isPending={initGarden.isPending}
              isError={initGarden.isError}
              onStart={() => initGarden.mutate()}
            />
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <LevelUpNotification level={userLevel.level} isLoading={userLevel.isLoading} />
      <OnboardingOverlay />
      <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4">

          <BackyardSkyHeader coins={garden.coins} streakDays={streakDays} level={userLevel.isLoading ? undefined : userLevel.level} />

          <GardenErrorBoundary>
            <GardenEconomyBanner
              economy={economy.data}
              rentOverdue={economy.rentOverdue}
              iceActive={economy.iceActive}
              fireActive={economy.fireActive}
              goldActive={economy.goldActive}
            />
          </GardenErrorBoundary>

          <GardenErrorBoundary>
            <BackyardView
              plots={garden.plots}
              inventory={inventory}
              placing={placing}
              onPlaced={handlePlaced}
              onCancelPlace={() => setPlacing(null)}
              economy={economy.data}
              coins={garden.coins}
            />
          </GardenErrorBoundary>

          <GardenToolbar
            onOpenShop={() => setShopOpen(true)}
            onOpenInventory={() => setInvOpen(true)}
            inventoryCount={unplacedCount}
          />

          <GardenAdventureMap
            totalMastery={garden.totalMastery}
            onOpenCourses={() => navigate('/cursos')}
            onOpenGames={() => navigate('/juegos')}
            onOpenFlashcards={() => navigate('/flashcards')}
            onOpenShop={() => setShopOpen(true)}
          />

          <NopalitoGuide
            totalMastery={garden.totalMastery}
            onOpenCourses={() => navigate('/cursos')}
            onOpenGames={() => navigate('/juegos')}
            onOpenFlashcards={() => navigate('/flashcards')}
          />

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <WeeklyRetos />
          </div>
        </div>
      </div>

      <PlantShopDrawer
        open={shopOpen}
        onOpenChange={setShopOpen}
        coins={garden.coins}
      />

      <InventoryDrawer
        open={invOpen}
        onOpenChange={setInvOpen}
        inventory={inventory}
        onPlace={(item) => setPlacing(item)}
      />
    </PageTransition>
  )
}
