import { config } from '@/lib/config'

type SocialCallback = (token: string) => void

const redirectUri = `${config.appUrl}/auth/callback`
const popupW = 600
const popupH = 700

function openPopup(url: string, name: string): Window | null {
  const left = (screen.width - popupW) / 2
  const top = (screen.height - popupH) / 2
  return window.open(url, name, `width=${popupW},height=${popupH},left=${left},top=${top}`)
}

export function googleLogin(onToken: SocialCallback, onError?: (err: string) => void) {
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
    if (e.data?.state !== state) return
    window.removeEventListener('message', handler)
    if (e.data?.error) {
      onError?.(e.data.error)
    } else if (e.data?.token) {
      onToken(e.data.token)
    }
  })

  const popup = openPopup(url, 'google-login')
  if (!popup || popup.closed) throw new Error('Popup bị chặn. Vui lòng cho phép popup.')
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


