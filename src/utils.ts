import { jwtDecode } from 'jwt-decode'
import { ApiTokenGetCallback, ApiTokenPayload } from './apis/user'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isStream(stream: { pipe: Function } | null): boolean {
  return (
    stream !== null &&
    typeof stream === 'object' &&
    typeof stream.pipe === 'function'
  )
}

export function _isTokenExpiring(
  exp?: number | null,
  apiTokenGetCallback?: string | ApiTokenGetCallback,
  withinNextSeconds = 3600,
): boolean {
  const validFor = _tokenValidFor(exp, apiTokenGetCallback)
  return withinNextSeconds > validFor
}

export function _tokenValidFor(
  exp?: number | null,
  apiTokenGetCallback?: string | ApiTokenGetCallback,
): number {
  if (!exp) {
    const payload = _getTokenPayload(apiTokenGetCallback)
    exp = payload?.exp
  }
  if (!exp) {
    return -1
  }
  const now = new Date().getTime() / 1000
  return exp - now
}

export function _getTokenPayload(
  apiTokenGetCallback?: string | ApiTokenGetCallback,
) {
  if (!apiTokenGetCallback) {
    return null
  }
  let token: string | null
  if (typeof apiTokenGetCallback === 'string') {
    token = apiTokenGetCallback
  } else {
    token = apiTokenGetCallback()
  }
  if (!token) {
    return null
  }
  try {
    return jwtDecode<ApiTokenPayload>(token)
  } catch {
    return null
  }
}
