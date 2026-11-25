import { useState } from 'react'
import { Users } from 'lucide-react'
import { loanDistribution } from '../data/demoDashboardData'

const loanColors: Record<(typeof loanDistribution)[number]['tone'], string> = {
  blue: '#0782ff',
  green: '#05b95b',
  orange: '#ffac19',
}

type LoanType = (typeof loanDistribution)[number]

function LoanDistribution() {
  const [selectedLoan, setSelectedLoan] = useState<LoanType>(loanDistribution[0])
  const chartBackground = loanDistribution.reduce<{ stops: string[]; total: number }>(
    (result, loan) => ({
      stops: [...result.stops, `${loanColors[loan.tone]} ${result.total}% ${result.total + loan.value}%`],
      total: result.total + loan.value,
    }),
    { stops: [], total: 0 },
  ).stops.join(', ')

  return (
    <article className="overview-card loan-card">
      <div className="overview-card__heading">
        <h2><Users size={19} /> Loan Distribution</h2>
      </div>
      <div className="loan-card__body">
        <div
          className="loan-donut"
          style={{ background: `conic-gradient(${chartBackground})` }}
          aria-label={`Loan distribution. ${selectedLoan.value}% ${selectedLoan.label} selected.`}
        >
          <div><strong>{selectedLoan.value}%</strong><span>{selectedLoan.label}</span></div>
        </div>
        <div className="loan-legend" aria-label="Select loan type">
          {loanDistribution.map((loan) => (
            <button
              className={`loan-legend__item${selectedLoan.label === loan.label ? ' loan-legend__item--selected' : ''}`}
              type="button"
              key={loan.label}
              onClick={() => setSelectedLoan(loan)}
              aria-pressed={selectedLoan.label === loan.label}
            >
              <i className={`legend-dot legend-dot--${loan.tone}`} />
              <span>{loan.label}<strong>{loan.value}%</strong></span>
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default LoanDistribution
