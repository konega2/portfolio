type Props = {
  kicker: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ kicker, title, subtitle }: Props) {
  return (
    <div className="group">
      <p className="reveal text-xs font-semibold uppercase tracking-wider text-neutral-500" data-reveal>
        {kicker}
      </p>
      <h2
        className="reveal mt-2 text-balance text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl relative inline-block font-display"
        data-reveal
        style={{ transitionDelay: '0.1s' }}
      >
        {title}
        <span className="absolute -bottom-2 left-0 h-1 w-0 bg-accent group-hover:w-full transition-all duration-700 ease-out" />
      </h2>
      {subtitle ? (
        <p className="reveal mt-3 max-w-2xl text-base text-neutral-700" data-reveal style={{ transitionDelay: '0.2s' }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
