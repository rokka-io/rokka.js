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

// encodeURIComponent plus !'()*, like RFC 3986 / query-string's strict mode
function strictEncode(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    c => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
  )
}

/**
 * Drop-in for query-string's default `stringify()`: keys sorted, undefined
 * skipped, null as bare key, arrays as repeated keys.
 */
export function stringifyQuery(params: { [key: string]: any }): string {
  const pair = (key: string, value: any): string | null => {
    if (value === undefined) {
      return null
    }
    if (value === null) {
      return strictEncode(key)
    }
    return strictEncode(key) + '=' + strictEncode(String(value))
  }

  return Object.keys(params)
    .sort()
    .flatMap(key => {
      const value = params[key]
      return Array.isArray(value)
        ? value.map(v => pair(key, v))
        : [pair(key, value)]
    })
    .filter((part): part is string => part !== null)
    .join('&')
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
