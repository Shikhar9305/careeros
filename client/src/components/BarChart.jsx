const BarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-500">No data available</div>

  const maxScore = Math.max(...data.map((d) => d.score), 100)
  const barWidth = 60
  const chartHeight = 300
  const chartWidth = data.length * (barWidth + 40) + 40

  return (
    <div className="flex justify-center my-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg overflow-x-auto">
      <svg width="100%" height="400" viewBox={`0 0 ${chartWidth} 400`} style={{ minWidth: "500px" }}>
        <line x1="40" y1="30" x2="40" y2="350" stroke="#374151" strokeWidth="2" />
        <line x1="40" y1="350" x2={chartWidth - 20} y2="350" stroke="#374151" strokeWidth="2" />

        {[0, 25, 50, 75, 100].map((label) => {
          const y = 350 - (label / 100) * chartHeight
          return (
            <g key={`y-label-${label}`}>
              <line x1="35" y1={y} x2="40" y2={y} stroke="#374151" strokeWidth="1" />
              <text x="25" y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                {label}
              </text>
            </g>
          )
        })}

        {data.map((item, index) => {
          const x = 60 + index * (barWidth + 40)
          const barHeight = (item.score / 100) * chartHeight
          const y = 350 - barHeight

          return (
            <g key={`bar-${index}`}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#4f46e5" rx="4" />
              <text x={x + barWidth / 2} y={y - 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1f2937">
                {item.score}%
              </text>
              <text x={x + barWidth / 2} y="375" textAnchor="middle" fontSize="12" fill="#6b7280">
                {item.category}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default BarChart
