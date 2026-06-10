import { config } from '@/lib/config'

type SocialCallback = (token: string) => void

const redirectUri = `${config.appUrl}/auth/callback`
const popupW = 600
const popupH = 700

export function googleLogin(onToken: SocialCallback) {
  const clientId = config.oauth.googleClientId
  if (!clientId) { throw new Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID') }

  const scope = 'openid email profile'
  const state = crypto.randomUUID()
  const nonce = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope,
    state,
    nonce,
  })
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`

  window.addEventListener('message', function handler(e) {
    if (e.origin !== window.location.origin) return
    if (e.data?.provider !== 'google') return
    window.removeEventListener('message', handler)
    if (e.data?.token) onToken(e.data.token)
  })

  const left = (screen.width - popupW) / 2
  const top = (screen.height - popupH) / 2
  window.open(url, 'google-login', `width=${popupW},height=${popupH},left=${left},top=${top}`)
}

export function facebookLogin(onToken: SocialCallback) {
  const appId = config.oauth.facebookAppId
  if (!appId) { throw new Error('Missing NEXT_PUBLIC_FACEBOOK_APP_ID') }

  return new Promise<void>((resolve, reject) => {
    if (typeof FB !== 'undefined') {
      doFbLogin(onToken, resolve, reject)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js'
    script.onload = () => {
      FB.init({ appId, version: 'v18.0', cookie: true })
      doFbLogin(onToken, resolve, reject)
    }
    script.onerror = () => reject(new Error('Failed to load Facebook SDK'))
    document.body.appendChild(script)
  })
}

function doFbLogin(
  onToken: SocialCallback,
  resolve: () => void,
  reject: (err: Error) => void,
) {
  FB.login(
    (response) => {
      if (response.status === 'connected' && response.authResponse?.accessToken) {
        onToken(response.authResponse.accessToken)
        resolve()
      } else {
        reject(new Error('Facebook login cancelled or failed'))
      }
    },
    { scope: 'public_profile,email' },
  )
}

export function instagramLogin(onToken: SocialCallback) {
  const clientId = config.oauth.instagramClientId
  if (!clientId) { throw new Error('Missing NEXT_PUBLIC_INSTAGRAM_CLIENT_ID') }

  const scope = 'user_profile,user_media'
  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
    state,
  })
  const url = `https://api.instagram.com/oauth/authorize?${params}`

  window.addEventListener('message', function handler(e) {
    if (e.origin !== window.location.origin) return
    if (e.data?.provider !== 'instagram') return
    window.removeEventListener('message', handler)
    if (e.data?.token) onToken(e.data.token)
  })

  const left = (screen.width - popupW) / 2
  const top = (screen.height - popupH) / 2
  window.open(url, 'instagram-login', `width=${popupW},height=${popupH},left=${left},top=${top}`)
}

export async function twitterLogin(onToken: SocialCallback) {
  const clientId = config.oauth.twitterClientId
  if (!clientId) { throw new Error('Missing NEXT_PUBLIC_TWITTER_CLIENT_ID') }

  const codeVerifier = generateCodeVerifier()
  const state = crypto.randomUUID()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  sessionStorage.setItem('twitter_code_verifier', codeVerifier)
  sessionStorage.setItem('twitter_state', state)

  const scope = 'tweet.read users.read'
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  const url = `https://twitter.com/i/oauth2/authorize?${params}`

  window.addEventListener('message', function handler(e) {
    if (e.origin !== window.location.origin) return
    if (e.data?.provider !== 'twitter') return
    window.removeEventListener('message', handler)
    if (e.data?.token) onToken(e.data.token)
  })

  const left = (screen.width - popupW) / 2
  const top = (screen.height - popupH) / 2
  window.open(url, 'twitter-login', `width=${popupW},height=${popupH},left=${left},top=${top}`)
}

function generateCodeVerifier(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => charset[b % charset.length]).join('')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
