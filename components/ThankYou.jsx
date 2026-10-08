import { useEffect, useRef } from 'react'
import { DandiyaSticks, FreeEntryStamp, Mandala } from './Decor.jsx'
import logoImg from '../images/logo.webp'

const CONFETTI_COLORS = ['#e0195a', '#f9c112', '#1e9e5a', '#f28c28', '#3f1a4a', '#18a5a4', '#ffffff']

// Lightweight canvas confetti: one burst, ~4s, no library.
function Confetti() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    addEventListener('resize', resize)

    const count = innerWidth < 640 ? 110 : 180
    const pieces = Array.from({ length: count }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80,
      y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * (innerWidth < 640 ? 9 : 16),
      vy: -Math.random() * 14 - 4,
      size: Math.random() * 7 + 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      round: Math.random() < 0.3,
    }))

    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = now - start
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ctx.globalAlpha = t > 3000 ? Math.max(0, 1 - (t - 3000) / 1200) : 1
      for (const p of pieces) {
        p.vy += 0.32
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.round) {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        ctx.restore()
      }
      if (t < 4200) frame = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, innerWidth, innerHeight)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="confetti" aria-hidden="true" />
}

const maskPhone = (phone) => `+91 ${phone.slice(0, 2)}•••• ${phone.slice(-4)}`

export default function ThankYou({ registration, event, onBack }) {
  const headingRef = useRef(null)
  const { name, phone, duplicate } = registration
  const firstName = name.split(' ')[0]

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const shareText = `I'm going to ${event.name} ${event.year}! 🎉 ${event.dateLabel}, ${event.timeLabel} at ${event.venue} (${event.gate}). Entry is FREE — register here:`
  const shareUrl = window.location.origin

  const invite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${event.name} ${event.year}`, text: shareText, url: shareUrl })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener')
  }

  const calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`${event.name} ${event.year}`)}` +
    `&dates=${event.calendarDates}` +
    `&recur=${encodeURIComponent(event.calendarRecur)}` +
    `&location=${encodeURIComponent(`${event.venue}, ${event.gate}, New Delhi`)}` +
    `&details=${encodeURIComponent('Dandiya night with live music, dance and celebration. Entry is free.')}`

  return (
    <section className="thanks">
      <Confetti />
      <Mandala className="bg-mandala thanks-mandala" />

      <div className="container thanks-inner">
        <div className="thanks-badge" aria-hidden="true">
          <DandiyaSticks className="thanks-sticks thanks-sticks--left" />
          <div className="thanks-logo">
            <Mandala variant="filled" className="thanks-logo-mandala" />
            <img src={logoImg} alt="" width="800" height="800" />
          </div>
          <DandiyaSticks className="thanks-sticks thanks-sticks--right" />
        </div>

        <p className="eyebrow thanks-eyebrow">
          {duplicate ? '✓ Already on the list' : '🎉 Registration confirmed'}
        </p>
        <h1 className="thanks-title" ref={headingRef} tabIndex={-1}>
          {duplicate ? `You're all set, ${firstName}!` : `Thank you, ${firstName}!`}
        </h1>
        <p className="thanks-lead">
          {duplicate ? (
            <>This number is already registered for {event.name} {event.year} — no need to sign up again.</>
          ) : (
            <>
              You're registered for {event.name} {event.year}. We can't wait to welcome you for an
              unforgettable evening of music, dance &amp; celebration! 💃🕺✨
            </>
          )}
        </p>

        <article className="ticket" aria-label="Your pass">
          <div className="ticket-main">
            <p className="ticket-event">
              {event.name} <span>{event.year}</span>
            </p>
            <p className="ticket-label">Guest</p>
            <p className="ticket-name">{name}</p>
            <p className="ticket-phone">{maskPhone(phone)}</p>
            <dl className="ticket-facts">
              <div>
                <dt>Date</dt>
                <dd>{event.dateShort}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{event.timeLabel}</dd>
              </div>
              <div>
                <dt>Entry</dt>
                <dd>{event.gate}</dd>
              </div>
            </dl>
            <p className="ticket-venue">📍 {event.venue}, New Delhi</p>
          </div>
          <div className="ticket-stub">
            <FreeEntryStamp className="ticket-stamp" />
            <p>🎟️ Entry is FREE!</p>
          </div>
        </article>

        <p className="thanks-tip">📸 Screenshot your pass and share the excitement!</p>

        <div className="thanks-actions">
          <button type="button" className="btn btn-primary" onClick={invite}>
            Invite your friends
          </button>
          <a className="btn btn-ghost" href={calendarUrl} target="_blank" rel="noreferrer">
            Add to calendar
          </a>
          <a className="btn btn-ghost" href={event.mapUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>

        <p className="thanks-sendoff">See you at the biggest Dandiya celebration in the city! ❤️</p>

        <button type="button" className="thanks-back" onClick={onBack}>
          ← Register someone else
        </button>
      </div>
    </section>
  )
}
