// Hand-built SVG ornaments so the page stays crisp at any size and needs no extra image assets.

const petal = (r1, r2, w) => {
  const h = r2 - r1
  return `M0,${-r1} C${w},${-r1 - h * 0.25} ${w * 0.55},${-r2 + h * 0.2} 0,${-r2} C${-w * 0.55},${-r2 + h * 0.2} ${-w},${-r1 - h * 0.25} 0,${-r1}Z`
}

const ring = (count, render) =>
  Array.from({ length: count }, (_, i) => render((360 / count) * i, i))

export function Mandala({ variant = 'line', className = '' }) {
  const filled = variant === 'filled'
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth={filled ? 0 : 0.6}>
        {ring(64, (a) => (
          <circle key={a} cx="0" cy="-96" r="1.2" transform={`rotate(${a})`} fill="currentColor" />
        ))}
        {ring(16, (a, i) => (
          <path
            key={a}
            d={petal(58, 92, 16)}
            transform={`rotate(${a + 11.25})`}
            fill={filled ? (i % 2 ? 'var(--purple)' : 'var(--maroon)') : 'none'}
          />
        ))}
        {ring(16, (a) => (
          <path
            key={a}
            d={petal(54, 84, 13)}
            transform={`rotate(${a})`}
            fill={filled ? 'var(--magenta)' : 'none'}
          />
        ))}
        {ring(16, (a) => (
          <path
            key={a}
            d={petal(60, 76, 6)}
            transform={`rotate(${a})`}
            fill={filled ? 'var(--marigold)' : 'none'}
          />
        ))}
        <circle r="55" fill={filled ? 'var(--cream)' : 'none'} />
        <circle r="50" strokeDasharray="1.5 2.5" />
        {ring(12, (a) => (
          <path key={a} d={petal(22, 46, 10)} transform={`rotate(${a})`} />
        ))}
        {ring(12, (a) => (
          <path key={a} d={petal(26, 40, 5)} transform={`rotate(${a + 15})`} />
        ))}
        <circle r="20" />
        {ring(8, (a) => (
          <path key={a} d={petal(4, 18, 6)} transform={`rotate(${a})`} />
        ))}
        <circle r="3" fill="currentColor" />
      </g>
    </svg>
  )
}

const FLAG_COLORS = ['#e0195a', '#f9c112', '#1e9e5a', '#f28c28', '#3f1a4a', '#18a5a4']

// Fixed-size swags repeated across the header, so flags never stretch or crop on any screen width.
export function Bunting({ swags = 10 }) {
  const w = 300
  const flagsPerSwag = 8
  const sag = 12
  return (
    <div className="bunting" aria-hidden="true">
      {Array.from({ length: swags }, (_, s) => (
        <svg key={s} viewBox={`0 0 ${w} 44`} width={w} height="44">
          <path d={`M0,3 Q${w / 2},${3 + sag * 2} ${w},3`} fill="none" stroke="#7a3b12" strokeWidth="1.5" />
          {Array.from({ length: flagsPerSwag }, (_, f) => {
            const t = (f + 0.5) / flagsPerSwag
            const x = t * w
            const y = 3 + 4 * sag * t * (1 - t)
            const i = s * flagsPerSwag + f
            return (
              <g key={f} className="flag" style={{ '--d': `${(i % 7) * 0.25}s`, transformOrigin: `${x}px ${y}px` }}>
                <path d={`M${x - 11},${y} L${x + 11},${y} L${x},${y + 24}Z`} fill={FLAG_COLORS[i % FLAG_COLORS.length]} />
                <circle cx={x} cy={y + 7} r="2.2" fill="#fff" opacity="0.85" />
              </g>
            )
          })}
        </svg>
      ))}
    </div>
  )
}

// Loose silhouette of Delhi landmarks: Qutub Minar, a Mughal dome, India Gate, Lotus Temple.
export function Skyline({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor">
        {/* Qutub Minar */}
        <path d="M120 160 L126 30 L130 22 L134 30 L140 160Z" />
        <rect x="118" y="70" width="24" height="4" />
        <rect x="116" y="105" width="28" height="4" />
        <rect x="114" y="135" width="32" height="4" />

        {/* Tomb with dome and chhatris */}
        <rect x="230" y="110" width="170" height="50" />
        <path d="M262 110 Q315 30 368 110Z" />
        <rect x="312" y="44" width="6" height="16" />
        <path d="M236 110 Q248 86 260 110Z M370 110 Q382 86 394 110Z" />
        <rect x="246" y="78" width="4" height="10" />
        <rect x="380" y="78" width="4" height="10" />

        {/* India Gate */}
        <path d="M540 160 L540 52 L660 52 L660 160 L622 160 L622 110 Q600 76 578 110 L578 160Z" />
        <rect x="532" y="44" width="136" height="10" />
        <rect x="560" y="30" width="80" height="14" />
        <path d="M580 30 Q600 14 620 30Z" />

        {/* Lotus Temple */}
        <path d="M780 160 Q800 92 830 80 Q860 92 880 160Z" />
        <path d="M760 160 Q770 110 810 100 Q800 130 805 160Z" />
        <path d="M900 160 Q890 110 850 100 Q860 130 855 160Z" />
        <path d="M740 160 Q745 128 780 120 Q770 140 775 160Z" />
        <path d="M920 160 Q915 128 880 120 Q890 140 885 160Z" />

        {/* Minarets and low buildings */}
        <rect x="1010" y="70" width="10" height="90" />
        <path d="M1008 70 Q1015 54 1022 70Z" />
        <rect x="1110" y="70" width="10" height="90" />
        <path d="M1108 70 Q1115 54 1122 70Z" />
        <rect x="1030" y="112" width="70" height="48" />
        <path d="M1040 112 Q1065 70 1090 112Z" />

        <rect x="0" y="146" width="1200" height="14" />
        <rect x="160" y="128" width="60" height="32" />
        <rect x="430" y="132" width="90" height="28" />
        <rect x="690" y="124" width="50" height="36" />
        <rect x="940" y="132" width="60" height="28" />
      </g>
    </svg>
  )
}

// Whole stamp is tilted as one piece; ring text sits on arcs above and below the banner so the
// banner never covers it, and textLength keeps every line inside the 200×200 viewBox.
export function FreeEntryStamp({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 200" role="img" aria-label="Free entry">
      <defs>
        <path id="stamp-top" d="M40.2,72 A66,66 0 0,1 159.8,72" />
        <path id="stamp-bottom" d="M31.5,128 A74,74 0 0,0 168.5,128" />
      </defs>
      <g transform="rotate(-15 100 100)">
        <g fill="none" stroke="var(--stamp)" strokeWidth="5">
          <circle cx="100" cy="100" r="92" strokeDasharray="2 6" strokeLinecap="round" />
          <circle cx="100" cy="100" r="84" strokeWidth="3" />
          <circle cx="100" cy="100" r="56" strokeWidth="3" />
        </g>
        <g fill="var(--stamp)" fontFamily="Cinzel, serif" fontWeight="800" fontSize="12" textAnchor="middle">
          <text>
            <textPath href="#stamp-top" startOffset="50%" textLength="124" lengthAdjust="spacing">
              DANDIYA REBORN
            </textPath>
          </text>
          <text>
            <textPath href="#stamp-bottom" startOffset="50%" textLength="156" lengthAdjust="spacing" fontSize="11">
              ★ 2026 · ALL WELCOME ★
            </textPath>
          </text>
        </g>
        <rect x="26" y="80" width="148" height="40" fill="var(--cream)" stroke="var(--stamp)" strokeWidth="4" />
        <text
          x="100"
          y="109"
          textAnchor="middle"
          textLength="126"
          lengthAdjust="spacingAndGlyphs"
          fill="var(--stamp)"
          fontFamily="Rozha One, serif"
          fontSize="25"
        >
          FREE ENTRY
        </text>
      </g>
    </svg>
  )
}

export function DandiyaSticks({ className = '' }) {
  const stick = (rot) => (
    <g transform={`rotate(${rot} 50 50)`}>
      <rect x="46" y="8" width="8" height="84" rx="4" fill="url(#stick-stripes)" />
      <rect x="45" y="8" width="10" height="7" rx="2" fill="#d4a017" />
      <rect x="45" y="85" width="10" height="7" rx="2" fill="#d4a017" />
      <path d="M50 8 L44 -6 M50 8 L50 -8 M50 8 L56 -6" stroke="var(--magenta)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
  return (
    <svg className={className} viewBox="0 -10 100 110" aria-hidden="true">
      <defs>
        <pattern id="stick-stripes" width="8" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="8" height="10" fill="var(--marigold)" />
          <rect width="8" height="4" fill="var(--maroon)" />
          <rect y="4" width="8" height="2" fill="var(--purple)" />
        </pattern>
      </defs>
      {stick(-28)}
      {stick(28)}
    </svg>
  )
}
