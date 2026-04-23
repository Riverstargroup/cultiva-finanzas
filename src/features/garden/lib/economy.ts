export function isPowerActive(activeUntil: string | null): boolean {
  if (!activeUntil) return false
  return new Date(activeUntil) > new Date()
}

export function isRentOverdue(rentDueAt: string | null): boolean {
  if (!rentDueAt) return false
  return new Date(rentDueAt) <= new Date()
}

export function rentCountdownMs(rentDueAt: string | null): number {
  if (!rentDueAt) return 0
  return Math.max(0, new Date(rentDueAt).getTime() - Date.now())
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '¡Vencida!'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
