const RadarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-500">No data available</div>

  const maxValue = 100
  const radius = 100
  const centerX = 150
  const centerY = 150

  const points = data.map((item, index) => {
    const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2
    const x = centerX + ((radius * item.value) / maxValue) * Math.cos(angle)
    const y = centerY + ((radius * item.value) / maxValue) * Math.sin(angle)
    return { x, y, ...item }
  })

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  return (
    <div className="flex justify-center my-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-lg">
        {[1, 2, 3, 4, 5].map((i) => (
          <circle
            key={`grid-${i}`}
            cx={centerX}
            cy={centerY}
            r={(radius / 5) * i}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {points.map((p, i) => (
          <line
            key={`axis-${i}`}
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos((i / data.length) * 2 * Math.PI - Math.PI / 2)}
            y2={centerY + radius * Math.sin((i / data.length) * 2 * Math.PI - Math.PI / 2)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        <path d={pathData + " Z"} fill="rgba(99, 102, 241, 0.2)" stroke="#4f46e5" strokeWidth="2" />

        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="6" fill="#4f46e5" stroke="white" strokeWidth="2" />
        ))}

        {points.map((p, i) => {
          const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2
          const labelDistance = 140
          const labelX = centerX + labelDistance * Math.cos(angle)
          const labelY = centerY + labelDistance * Math.sin(angle)

          return (
            <text
              key={`label-${i}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dy="0.3em"
              fontSize="12"
              fontWeight="600"
              fill="#1f2937"
            >
              {p.trait}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default RadarChart
