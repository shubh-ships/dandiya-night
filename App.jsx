import { useEffect, useState } from 'react'
import ThankYou from './components/ThankYou.jsx'
import logoImg from './images/logo.webp'
import delhiGovtImg from './images/delhi-govt.webp'
import delhiTourismImg from './images/delhi-tourism.webp'
import rekhaGuptaImg from './images/rekha-gupta.webp'
import kapilMishraImg from './images/kapil-mishra.webp'
import { registerGuest } from './supabase.js'
import { Bunting, DandiyaSticks, FreeEntryStamp, Mandala, Skyline, SocialIcon } from './components/Decor.jsx'

// ---- Event content: edit here ----
const EVENT = {
  name: 'Dandiya Reborn',
  year: '2026',
  start: '2026-10-11T18:00:00+05:30',
  end: '2026-10-12T22:00:00+05:30',
  dateLabel: '11th & 12th October',
  dateShort: '11–12 Oct 2026',
  // Night 1, 6–10 PM IST in UTC, repeated daily for 2 nights in Google Calendar
  calendarDates: '20261011T123000Z/20261011T163000Z',
  calendarRecur: 'RRULE:FREQ=DAILY;COUNT=2',
  timeLabel: '6 PM – 10 PM',
  venue: 'JLN Stadium',
  gate: 'Gate No. 14',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jawaharlal+Nehru+Stadium+Gate+14+New+Delhi',
}

const GUESTS = {
  left: { photo: rekhaGuptaImg, name: 'Smt. Rekha Gupta', title: "Hon'ble Chief Minister, Delhi" },
  right: { photo: kapilMishraImg, name: 'Shri Kapil Mishra', title: "Hon'ble Tourism Minister, Delhi" },
}

const ARTIST = {
  name: 'Malhotra Sisters',
  tag: 'The duo owns the night',
  photo: '/assets/malhotra-sisters.jpg',
}

const SOCIALS = [
  { icon: 'instagram', platform: 'Instagram', handle: '@delhitourism_official', href: 'https://www.instagram.com/delhitourism_official/' },
  { icon: 'facebook', platform: 'Facebook', handle: 'delhitourism', href: 'https://www.facebook.com/delhitourism' },
  { icon: 'x', platform: 'X (Twitter)', handle: '@tourism_delhi', href: 'https://x.com/tourism_delhi' },
  { icon: 'website', platform: 'Website', handle: 'delhitourism.gov.in', href: 'https://delhitourism.gov.in' },
]
// -----------------------------------

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, new Date(target).getTime() - now)
  return {
    done: diff === 0,
    ended: now > new Date(EVENT.end).getTime(),
    parts: [
      ['Days', Math.floor(diff / 86400000)],
      ['Hours', Math.floor(diff / 3600000) % 24],
      ['Mins', Math.floor(diff / 60000) % 60],
      ['Secs', Math.floor(diff / 1000) % 60],
    ],
  }
}

function Guest({ photo, name, title, align }) {
  return (
    <figure className={`top-guest top-guest--${align}`}>
      <img src={photo} alt={name} width="96" height="96" />
      <figcaption>
        <strong>{name}</strong>
        <span>{title}</span>
      </figcaption>
    </figure>
  )
}

function Header() {
  return (
    <header className="site-header">
      <Bunting />
      <div className="container org-strip">
        <span className="org">
          <img src={delhiGovtImg} alt="" width="66" height="86" />
          <span className="org-govt">Government of the National Capital Territory of Delhi</span>
        </span>
        <span className="org org--right">
          <span>Delhi Tourism</span>
          <img src={delhiTourismImg} alt="" width="80" height="74" />
        </span>
      </div>
      <div className="container top-bar">
        <Guest {...GUESTS.left} align="left" />
        <img className="top-logo" src={logoImg} alt={`${EVENT.name} ${EVENT.year}`} width="88" height="88" />
        <Guest {...GUESTS.right} align="right" />
      </div>
    </header>
  )
}

function RegisterCard({ onRegistered }) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [message, setMessage] = useState('')

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((errs) => (errs[name] ? { ...errs, [name]: undefined } : errs))
  }

  const submit = async (e) => {
    e.preventDefault()
    const name = form.name.trim().replace(/\s+/g, ' ')
    const phone = form.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
    const next = {}
    if (name.length < 2) next.name = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a valid 10-digit mobile number'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      const { duplicate } = await registerGuest({ name, phone })
      setForm({ name: '', phone: '' })
      setStatus('idle')
      onRegistered({ name, phone, duplicate })
    } catch (err) {
      setMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="register-card form" id="register" onSubmit={submit} noValidate>
      <FreeEntryStamp className="form-stamp" />
      <h2 className="form-title">Grab your free pass</h2>
      <p className="form-sub">Just your name and mobile number.</p>
      <label>
        Full name
        <input
          name="name"
          value={form.name}
          onChange={update}
          autoComplete="name"
          maxLength={80}
          aria-invalid={!!errors.name}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        Mobile number
        <input
          name="phone"
          value={form.phone}
          onChange={update}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="98XXXXXXXX"
          maxLength={14}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <small>{errors.phone}</small>}
      </label>
      {status === 'error' && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <button className="btn btn-primary btn-block" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Registering…' : 'Get My Free Pass'}
      </button>
    </form>
  )
}

function Hero({ onRegistered }) {
  const { done, ended, parts } = useCountdown(EVENT.start)
  return (
    <section className="hero">
      <Mandala className="bg-mandala bg-mandala--left" />
      <Mandala className="bg-mandala bg-mandala--right" />

      <div className="container hero-grid">
        <div className="hero-art">
          <Mandala variant="filled" className="hero-mandala" />
          <img className="hero-logo" src={logoImg} alt="" width="800" height="800" />
        </div>

        <div className="hero-copy">
          <h1 className="hero-title">
            {EVENT.name} <span>{EVENT.year}</span>
          </h1>
          <p className="hero-kicker">Get ready to</p>
          <p className="hero-shout">
            Dance &amp; Celebrate
            <br />
            Feel the Festive Beats
          </p>
          <div className="date-pill">
            <strong>
              <span className="nowrap">{EVENT.dateLabel}</span>
              <span className="date-sep" aria-hidden="true">
                {' | '}
              </span>
              <span className="nowrap">{EVENT.timeLabel}</span>
            </strong>
            <span>
              📍 {EVENT.venue} · {EVENT.gate}
            </span>
          </div>
        </div>

        <div className="hero-form">
          <RegisterCard onRegistered={onRegistered} />
        </div>

        <div className="countdown" aria-live="off">
          {done ? (
            <p className="countdown-live">
              {ended ? "That's a wrap — thank you for dancing with us!" : 'The circle is live — see you on the floor!'}
            </p>
          ) : (
            parts.map(([label, value]) => (
              <div key={label} className="countdown-cell">
                <span className="countdown-num">{String(value).padStart(2, '0')}</span>
                <span className="countdown-label">{label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <Skyline className="skyline" />
    </section>
  )
}

function Lineup() {
  const [hasPhoto, setHasPhoto] = useState(true)
  return (
    <section className="section lineup">
      <Mandala className="lineup-mandala" />
      <div className={`container lineup-inner${hasPhoto ? ' has-photo' : ''}`}>
        {hasPhoto && (
          <div className="lineup-photo">
            <img src={ARTIST.photo} alt={ARTIST.name} loading="lazy" onError={() => setHasPhoto(false)} />
          </div>
        )}
        <div className="lineup-copy">
          <p className="lineup-tag">{ARTIST.tag}</p>
          <h2 className="lineup-name">{ARTIST.name}</h2>
          <p className="lineup-text">
            Live on stage with a full Dandiya Raas set of folk favourites and festive hits to keep every
            circle spinning.
          </p>
          <DandiyaSticks className="lineup-sticks" />
        </div>
      </div>
    </section>
  )
}

function Venue() {
  return (
    <section className="section venue">
      <div className="container narrow">
        <div className="venue-card">
          <p className="eyebrow">Getting there</p>
          <h2 className="section-title">{EVENT.venue}</h2>
          <dl className="venue-facts">
            <div>
              <dt>Date</dt>
              <dd>
                {EVENT.dateLabel} {EVENT.year}
              </dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{EVENT.timeLabel}</dd>
            </div>
            <div>
              <dt>Entry</dt>
              <dd>{EVENT.gate}</dd>
            </div>
          </dl>
          <a className="btn btn-primary" href={EVENT.mapUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <Skyline className="footer-skyline" />
      <div className="container footer-inner">
        <p className="footer-brand">
          Dandiya <em>Reborn</em> {EVENT.year}
        </p>
        <p>
          {EVENT.dateLabel} · {EVENT.timeLabel} · {EVENT.venue}, {EVENT.gate}
        </p>
        <p className="socials-title">Follow Delhi Tourism</p>
        <ul className="socials">
          {SOCIALS.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.platform}: ${s.handle}`}>
                <SocialIcon name={s.icon} />
                <span>{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="fine">Shubh Navratri 🙏 Jai Mata Di</p>
      </div>
    </footer>
  )
}

export default function App() {
  const [registration, setRegistration] = useState(null)

  // The thank-you view gets its own history entry so the phone's back button returns to the form.
  useEffect(() => {
    if (window.location.hash === '#thank-you') history.replaceState(null, '', window.location.pathname)
    const onPop = (e) => {
      if (!e.state?.thanks) setRegistration(null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const showThanks = (reg) => {
    setRegistration(reg)
    history.pushState({ thanks: true }, '', '#thank-you')
    window.scrollTo(0, 0)
  }

  const backToForm = () => {
    if (history.state?.thanks) history.back()
    else setRegistration(null)
  }

  return (
    <>
      <Header />
      <main>
        {registration ? (
          <ThankYou registration={registration} event={EVENT} onBack={backToForm} />
        ) : (
          <>
            <Hero onRegistered={showThanks} />
            {/* Malhotra Sisters section hidden for now — uncomment to bring it back */}
            {/* <Lineup /> */}
            <Venue />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
