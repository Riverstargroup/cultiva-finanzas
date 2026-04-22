export function DailyLock() {
  return (
    <div className="organic-card p-8 text-center space-y-3">
      <span className="text-5xl block">🐝</span>
      <h3
        className="font-heading font-bold text-xl"
        style={{ color: 'var(--forest-deep)' }}
      >
        ¡Ya polinizaste hoy!
      </h3>
      <p className="text-sm" style={{ color: 'var(--leaf-muted)' }}>
        Las abejas también descansan. Vuelve mañana para otra sesión.
      </p>
    </div>
  )
}
