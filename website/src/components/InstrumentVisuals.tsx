function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function renderInstrumentVisual(slug: string) {
  switch (slug) {
    case "big-five":
      return (
        <svg
          viewBox="0 0 100 100"
          className="instrument-model-svg"
          aria-hidden="true"
        >
          <rect x="10" y="14" width="8" height="72" rx="2" fill="#ef4444" />
          <rect x="28" y="14" width="8" height="72" rx="2" fill="#f97316" />
          <rect x="46" y="14" width="8" height="72" rx="2" fill="#eab308" />
          <rect x="64" y="14" width="8" height="72" rx="2" fill="#22c55e" />
          <rect x="82" y="14" width="8" height="72" rx="2" fill="#3b82f6" />
        </svg>
      );

    case "bis-bas":
      return (
        <svg
          viewBox="0 0 100 100"
          className="instrument-model-svg"
          aria-hidden="true"
        >
          <rect x="14" y="16" width="72" height="12" rx="2" fill="#3b82f6" />
          <rect x="16" y="36" width="12" height="52" rx="2" fill="#ef4444" />
          <rect x="44" y="36" width="12" height="52" rx="2" fill="#ef4444" />
          <rect x="72" y="36" width="12" height="52" rx="2" fill="#ef4444" />
        </svg>
      );

    case "barchard-ei": {
      const segmentColors = [
        "#ef4444",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#3b82f6",
        "#6366f1",
        "#a855f7",
      ];

      return (
        <svg
          viewBox="0 0 100 100"
          className="instrument-model-svg"
          aria-hidden="true"
        >
          {segmentColors.map((color, index) => {
            const startAngle = index * (360 / 7) + 3;
            const endAngle = (index + 1) * (360 / 7) - 3;

            return (
              <path
                key={color}
                d={describeArc(50, 50, 36, startAngle, endAngle)}
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
      );
    }

    case "via-is": {
      const colorRuns = [
        { color: "#ef4444", count: 5 },
        { color: "#f97316", count: 4 },
        { color: "#eab308", count: 3 },
        { color: "#22c55e", count: 3 },
        { color: "#3b82f6", count: 4 },
        { color: "#a855f7", count: 5 },
      ];

      const sequence = colorRuns.flatMap(({ color, count }) =>
        Array.from({ length: count }, () => color),
      );

      return (
        <svg
          viewBox="0 0 100 100"
          className="instrument-model-svg"
          aria-hidden="true"
        >
          {sequence.map((color, index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            const cx = 29 + column * 14;
            const cy = 15 + row * 14;
            const mod = index % 8;
            const angle = [0, 2, 5, 7].includes(mod) ? 45 : 135;

            return (
              <rect
                key={`${color}-${index}`}
                x={cx - 2.4}
                y={cy - 5.25}
                width="4.8"
                height="10.5"
                transform={`rotate(${angle} ${cx} ${cy})`}
                rx="0"
                fill={color}
              />
            );
          })}
        </svg>
      );
    }

    case "trait-ei": {
      const rows = [
        { color: "#ef4444", count: 4, y: 14 },
        { color: "#eab308", count: 3, y: 30 },
        { color: "#22c55e", count: 3, y: 46 },
        { color: "#3b82f6", count: 3, y: 62 },
        { color: "#94a3b8", count: 2, y: 86 },
      ];

      return (
        <svg
          viewBox="0 0 100 100"
          className="instrument-model-svg"
          aria-hidden="true"
        >
          {rows.flatMap(({ color, count, y }) => {
            const spacing = 16;
            const startX = 50 - ((count - 1) * spacing) / 2;

            return Array.from({ length: count }, (_, index) => (
              <circle
                key={`${color}-${y}-${index}`}
                cx={startX + index * spacing}
                cy={y}
                r="5.5"
                fill={color}
              />
            ));
          })}
        </svg>
      );
    }

    default:
      return (
        <div className="instrument-model-placeholder" aria-hidden="true" />
      );
  }
}
