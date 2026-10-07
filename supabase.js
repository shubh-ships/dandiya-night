// Plain fetch to Supabase's REST API: one insert doesn't need supabase-js, and there's no lazily
// loaded chunk that could fail on a weak connection.
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/(rest\/v1)?\/?$/, '')
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const TIMEOUT_MS = 15000

const MESSAGES = {
  config: 'Registration is not configured yet.',
  offline: "You're offline. Check your internet connection and try again.",
  network: 'Network problem — please check your connection and try again.',
  timeout: 'This is taking too long. Please check your connection and try again.',
  invalid: 'Please check your name and mobile number and try again.',
  busy: 'Too many attempts right now. Please wait a minute and try again.',
  generic: 'Could not register right now. Please try again.',
}

function headers() {
  const h = { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }
  // Legacy anon keys are JWTs and also go in Authorization; new sb_publishable_ keys must not.
  if (key.startsWith('eyJ')) h.Authorization = `Bearer ${key}`
  return h
}

// Resolves to { duplicate: true } when the number is already registered; throws an Error with a
// user-facing message otherwise.
export async function registerGuest({ name, phone }) {
  if (!url || !key) throw new Error(MESSAGES.config)
  if (navigator.onLine === false) throw new Error(MESSAGES.offline)

  let res
  try {
    res = await fetch(`${url}/rest/v1/registrations`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name, phone }),
      signal: AbortSignal.timeout?.(TIMEOUT_MS),
    })
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') throw new Error(MESSAGES.timeout)
    throw new Error(navigator.onLine === false ? MESSAGES.offline : MESSAGES.network)
  }

  if (res.ok) return { duplicate: false }

  const { code } = await res.json().catch(() => ({}))
  if (code === '23505') return { duplicate: true }
  if (code === '23514' || code === '22001') throw new Error(MESSAGES.invalid)
  if (res.status === 429) throw new Error(MESSAGES.busy)
  throw new Error(MESSAGES.generic)
}
