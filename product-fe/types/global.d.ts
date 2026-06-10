interface FacebookAuthResponse {
  accessToken: string
  expiresIn: number
  signedRequest: string
  userID: string
}

interface FacebookLoginStatus {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: FacebookAuthResponse
}

interface FacebookLoginResponse {
  status: string
  authResponse?: FacebookAuthResponse
}

interface FB {
  init(params: { appId: string; version: string; cookie?: boolean; xfbml?: boolean }): void
  login(cb: (response: FacebookLoginResponse) => void, options?: { scope: string }): void
  getLoginStatus(cb: (response: FacebookLoginStatus) => void): void
}

declare var FB: FB
