import { useState } from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { financialSeries } from '../data/demoDashboardData'

const chartLeft = 44
const chartRight = 528
const chartTop = 18
const chartBottom = 142

function getChartCoordinates(values: number[]) {
  const step = (chartRight - chartLeft) / Math.max(values.length - 1, 1)
  return values.map((value, index) => ({
    x: chartLeft + index * step,
    y: chartBottom - (value / 100) * (chartBottom - chartTop),
  }))
}

function getPolyline(values: number[]) {
  return getChartCoordinates(values).map(({ x, y }) => `${x},${y}`).join(' ')
}

function getAreaPath(values: number[]) {
  const points = getChartCoordinates(values)
  const line = points.map(({ x, y }) => `L ${x} ${y}`).join(' ')
  return `M ${points[0].x} ${chartBottom} ${line} L ${points[points.length - 1].x} ${chartBottom} Z`
}

function FinancialOverview() {
  const [period, setPeriod] = useState(12)
  const months = financialSeries.months.slice(-period)
  const series = [
    { label: 'Disbursement', values: financialSeries.disbursement.slice(-period), color: '#0785ff' },
    { label: 'Collection', values: financialSeries.collection.slice(-period), color: '#09b967' },
    { label: 'Pending', values: financialSeries.pending.slice(-period), color: '#ff790c' },
  ]

  return (
    <article className="overview-card financial-card" id="financial-overview">
      <div className="overview-card__heading">
        <h2><TrendingUp size={19} /> Financial Overview</h2>
        <label className="period-select-wrap">
          <span className="sr-only">Chart time period</span>
          <select className="period-select" value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
            <option value={12}>Last 12 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={3}>Last 3 Months</option>
          </select>
          <ChevronDown size={13} aria-hidden="true" />
        </label>
      </div>
      <div className="chart-legend">
        {series.map(({ label, color }) => (
          <span key={label}><i className="legend-dot" style={{ backgroundColor: color }} /> {label}</span>
        ))}
      </div>
      <div className="financial-chart">
        <svg viewBox="0 0 540 164" role="img" aria-label={`Line chart for the last ${period} months showing disbursement, collection, and pending amounts`}>
          <defs>
            <linearGradient id="collection-area" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#18b86c" stopOpacity=".23" />
              <stop offset="1" stopColor="#18b86c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pending-area" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#ff8d16" stopOpacity=".16" />
              <stop offset="1" stopColor="#ff8d16" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[18, 49, 80, 111, 142].map((y, index) => (
            <g key={y}>
              <line x1={chartLeft} x2={chartRight} y1={y} y2={y} stroke="#e7edf7" strokeWidth="1" />
              <text x="35" y={y + 3} textAnchor="end" fill="#34415c" fontSize="9">{100 - index * 25}L</text>
            </g>
          ))}
          {getChartCoordinates(months.map((_, index) => index)).map(({ x }, index) => (
            <line key={index} x1={x} x2={x} y1={chartTop} y2={chartBottom} stroke="#f0f3f8" strokeWidth="1" />
          ))}
          <path d={getAreaPath(series[1].values)} fill="url(#collection-area)" />
          <path d={getAreaPath(series[2].values)} fill="url(#pending-area)" />
          {series.map(({ label, values, color }) => (
            <g key={label}>
              <polyline points={getPolyline(values)} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {getChartCoordinates(values).map(({ x, y }, index) => (
                <circle key={index} cx={x} cy={y} r="3.1" fill="#fff" stroke={color} strokeWidth="2" />
              ))}
            </g>
          ))}
          {months.map((month, index) => {
            const x = chartLeft + index * ((chartRight - chartLeft) / Math.max(months.length - 1, 1))
            return <text key={month} x={x} y="158" textAnchor="middle" fill="#47536b" fontSize="9">{month}</text>
          })}
        </svg>
      </div>
    </article>
  )
}

export default FinancialOverview
