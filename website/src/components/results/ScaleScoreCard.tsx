type ScaleScoreCardProps = {
  label: string
  value: string
  description: string
}

export function ScaleScoreCard({ label, value, description }: ScaleScoreCardProps) {
  return (
    <article className="score-card">
      <div className="score-card-topline">
        <h3>{label}</h3>
        <strong>{value}</strong>
      </div>
      <p>{description}</p>
    </article>
  )
}
