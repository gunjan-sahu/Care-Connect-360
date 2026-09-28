export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${40 - ((v - min) / range) * 32 - 4}`).join(' ')

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={`[animation:draw_1.6s_cubic-bezier(0.16,1,0.3,1)_both] ${className ?? ''}`} aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
