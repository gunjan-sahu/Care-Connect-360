const words = ['Personalized care', 'Expert physicians', 'Secure video', 'Smart prescriptions', 'Clear billing']

export function Marquee() {
  const row = [...words, ...words]
  return (
    <section aria-label="Highlights" className="overflow-hidden py-16 sm:py-24">
      <div className="flex w-max animate-marquee items-center gap-8 hover:[animation-play-state:paused]">
        {row.map((w, i) => (
          <span
            key={i}
            aria-hidden={i >= words.length}
            className="flex items-center gap-8 text-4xl font-medium tracking-tight whitespace-nowrap text-brand/80 uppercase sm:text-6xl"
          >
            {w}
            <span className="font-light text-foreground/30" aria-hidden="true">
              {'/'}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}