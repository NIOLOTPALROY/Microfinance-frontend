
interface BrandLogoProps {
  className?: string
}

function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <a
      href="/"
      aria-label="DoorToDoor Microfinance Home"
      className={`brand group inline-flex items-center gap-3 no-underline ${className}`}
    >
      {/* Brand Icon */}
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
        <svg
          viewBox="0 0 48 48"
          className="h-9 w-9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 22L24 8L41 22V39H27V27H21V39H7V22Z"
            stroke="white"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M15 19H33"
            stroke="#67E8F9"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="24" cy="15" r="2" fill="#67E8F9" />
        </svg>

        <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
      </span>

      {/* Brand Typography */}
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[25px] font-extrabold tracking-tight text-slate-900 dark:text-white">
          Door
          <span className="text-blue-600 dark:text-cyan-400">to</span>
          Door
        </span>

        <span className="mt-1.5 text-[9px] font-bold tracking-[0.28em] text-slate-500 dark:text-slate-400">
  MICROFOUNDATION
</span>
      </span>
    </a>
  )
}

export default BrandLogo
