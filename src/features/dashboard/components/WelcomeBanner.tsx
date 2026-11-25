type WelcomeBannerProps = {
  administratorName: string
}

function WelcomeBanner({ administratorName }: WelcomeBannerProps) {
  return (
    <section className="welcome-banner" aria-label="Welcome">
      <div className="welcome-banner__landscape" aria-hidden="true">
        <svg viewBox="0 0 760 170" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="banner-sky" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#b6dcff" />
              <stop offset="1" stopColor="#e9f4d0" />
            </linearGradient>
            <linearGradient id="banner-field" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#55bc43" />
              <stop offset="1" stopColor="#137c35" />
            </linearGradient>
          </defs>
          <rect width="760" height="170" fill="url(#banner-sky)" />
          <circle cx="533" cy="33" r="31" fill="#fff7c0" opacity=".8" />
          <path d="M0 104Q75 72 145 100T290 91T436 103T590 83T760 99V170H0Z" fill="#77c75d" />
          <path d="M0 122Q95 91 206 121T405 109T580 117T760 98V170H0Z" fill="url(#banner-field)" />
          <path d="M0 147Q104 118 214 146T435 130T625 145T760 124V170H0Z" fill="#16773c" opacity=".8" />
          <g fill="#286d37" opacity=".9">
            <path d="M33 124v-30h5v30zm-8-28 10-18 10 18zm30 31V96h5v31zm-9-29 12-22 12 22zm80 19V94h4v23zm-7-25 9-17 9 17z" />
            <path d="M423 123V94h5v29zm-9-27 12-23 12 23zm236 17V92h5v21zm-8-24 10-19 10 19z" />
          </g>
          <g>
            <path d="M274 117V70l30-24 30 24v47z" fill="#fff0d6" />
            <path d="M266 73l38-34 38 34h-12l-26-23-26 23z" fill="#c75349" />
            <path d="M289 83h12v17h-12zm22 0h12v17h-12z" fill="#8bc6dc" />
            <path d="M474 111V60l32-25 32 25v51z" fill="#f3e8cf" />
            <path d="M466 62l40-34 40 34h-13l-27-23-27 23z" fill="#d66e53" />
            <path d="M488 73h12v16h-12zm23 0h12v16h-12z" fill="#96d5ec" />
          </g>
        </svg>
      </div>

      <div className="welcome-copy">
        <span className="welcome-copy__eyebrow">YOUR COMMUNITY, YOUR IMPACT</span>
        <h1>Welcome Back,<br />{administratorName}!</h1>
        <p>DoorToDoor Microfinance Management System</p>
        <strong className="welcome-ribbon">Small Loan... Big Change...</strong>
      </div>

      <div className="welcome-person" aria-hidden="true">
        <svg viewBox="0 0 210 190">
          <path d="M41 190c5-43 21-74 55-82 38 7 59 34 68 82z" fill="#0861b7" />
          <path d="M82 112l25 29 24-29 18 78H62z" fill="#f8f2e7" />
          <path d="M79 69c0-30 17-49 39-49 25 0 40 22 38 52l-8 39c-7 19-21 29-34 29-16 0-30-13-36-32z" fill="#bc7148" />
          <path d="M78 77c-14-31-5-61 23-68 25-7 56 7 62 37 4 17-1 35-10 48l-8-30c-19-1-32-12-43-25-3 15-12 26-24 34z" fill="#18202c" />
          <path d="M83 69c3-10 10-13 18-11m30 0c8-2 14 2 17 10" fill="none" stroke="#432a20" strokeWidth="3" strokeLinecap="round" />
          <circle cx="98" cy="66" r="2.5" fill="#26262b" />
          <circle cx="142" cy="65" r="2.5" fill="#26262b" />
          <path d="M116 85q9 7 17 0" fill="none" stroke="#873f36" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M106 111l11 12 13-13 11 8-20 23-24-21z" fill="#f2bc63" />
          <path d="M57 147q26-21 49-18l27 61H54z" fill="#087bd1" />
          <path d="M134 130q23 2 38 24l-11 36h-34z" fill="#0756a6" />
          <path d="M133 132l56 6-7 43-59-5z" fill="#102c57" stroke="#efbf43" strokeWidth="2" />
          <path d="M151 146l9-7 10 8v9h-19z" fill="#f4c433" />
          <circle cx="160" cy="142" r="3" fill="#efb735" />
          <text x="157" y="166" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">DoorToDoor</text>
          <path d="M92 73q4 5 8 0m35 0q4 5 8 0" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="112" cy="68" r="2.5" fill="#d82736" />
          <circle cx="112" cy="78" r="2" fill="#e1ae31" />
        </svg>
      </div>

      <ul className="welcome-points">
        <li><span aria-hidden="true">✓</span> Financial Inclusion</li>
        <li><span aria-hidden="true">✓</span> Better Tomorrow</li>
        <li><span aria-hidden="true">✓</span> Stronger Community</li>
      </ul>
      <div className="welcome-swoosh" aria-hidden="true" />
    </section>
  )
}

export default WelcomeBanner
