import type { PropsWithChildren, ReactNode } from 'react'

type SectionProps = PropsWithChildren<{
  title?: string
  eyebrow?: string
  intro?: ReactNode
  className?: string
}>

export function Section({ title, eyebrow, intro, className, children }: SectionProps) {
  return (
    <section className={className ? `section ${className}` : 'section'}>
      {(eyebrow || title || intro) && (
        <div className="section-heading">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {intro ? <p className="section-intro">{intro}</p> : null}
        </div>
      )}
      {children}
    </section>
  )
}
