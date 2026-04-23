export function JardinSkeleton() {
  return (
    <div className="dashboard-skin botanical-bg -mx-4 -mt-4 min-h-screen px-4 pt-6 pb-28 md:-mx-6 md:-mt-6 md:px-6 md:pt-8 lg:-mx-8 lg:-mt-8 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4 animate-pulse">
        <div className="h-8 w-40 rounded-lg" style={{ background: 'var(--clay-soft)' }} />
        <div className="h-4 w-56 rounded" style={{ background: 'var(--clay-soft)', opacity: 0.6 }} />
        <div
          className="rounded-2xl"
          style={{
            height: 'min(56vw, 420px)',
            background: 'linear-gradient(180deg, #d8e8f0 0%, #c5b89a 100%)',
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  )
}
