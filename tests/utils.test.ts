import {
  _getTokenPayload,
  _isTokenExpiring,
  _tokenValidFor,
} from '../src/utils'

// A valid JWT token structure: header.payload.signature
// This helper creates a token with a given payload
const createToken = (payload: object): string => {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
  ).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.fakesignature`
}

describe('_getTokenPayload', () => {
  it('returns null when no callback provided', () => {
    expect(_getTokenPayload()).toBeNull()
    expect(_getTokenPayload(undefined)).toBeNull()
  })

  it('returns null when callback returns null', () => {
    expect(_getTokenPayload(() => null)).toBeNull()
  })

  it('returns null when empty string provided', () => {
    expect(_getTokenPayload('')).toBeNull()
  })

  it('decodes payload from a token string', () => {
    const token = createToken({ exp: 9999999999, rn: true })
    const payload = _getTokenPayload(token)

    expect(payload).not.toBeNull()
    expect(payload!.exp).toBe(9999999999)
    expect(payload!.rn).toBe(true)
  })

  it('decodes payload from a callback function', () => {
    const token = createToken({ exp: 9999999999, ip: '127.0.0.1' })
    const payload = _getTokenPayload(() => token)

    expect(payload).not.toBeNull()
    expect(payload!.exp).toBe(9999999999)
    expect(payload!.ip).toBe('127.0.0.1')
  })

  it('returns null for an invalid token', () => {
    expect(_getTokenPayload('not-a-jwt')).toBeNull()
  })
})

describe('_tokenValidFor', () => {
  it('returns -1 when no exp and no callback', () => {
    expect(_tokenValidFor()).toBe(-1)
  })

  it('returns -1 when callback returns null', () => {
    expect(_tokenValidFor(undefined, () => null)).toBe(-1)
  })

  it('returns positive value for token expiring in the future', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 7200
    const result = _tokenValidFor(futureExp)

    expect(result).toBeGreaterThan(7100)
    expect(result).toBeLessThanOrEqual(7200)
  })

  it('returns negative value for expired token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 100
    const result = _tokenValidFor(pastExp)

    expect(result).toBeLessThan(0)
  })

  it('extracts exp from token when exp param is not provided', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    const token = createToken({ exp: futureExp })
    const result = _tokenValidFor(undefined, token)

    expect(result).toBeGreaterThan(3500)
    expect(result).toBeLessThanOrEqual(3600)
  })

  it('uses provided exp over token callback', () => {
    const tokenExp = Math.floor(Date.now() / 1000) + 1000
    const providedExp = Math.floor(Date.now() / 1000) + 5000
    const token = createToken({ exp: tokenExp })

    const result = _tokenValidFor(providedExp, token)

    expect(result).toBeGreaterThan(4900)
  })
})

describe('_isTokenExpiring', () => {
  it('returns true when no exp and no callback', () => {
    expect(_isTokenExpiring()).toBe(true)
  })

  it('returns true when token expires within default threshold (3600s)', () => {
    const exp = Math.floor(Date.now() / 1000) + 1800 // 30 min from now
    expect(_isTokenExpiring(exp)).toBe(true)
  })

  it('returns false when token expires well beyond threshold', () => {
    const exp = Math.floor(Date.now() / 1000) + 7200 // 2 hours from now
    expect(_isTokenExpiring(exp)).toBe(false)
  })

  it('respects custom withinNextSeconds parameter', () => {
    const exp = Math.floor(Date.now() / 1000) + 600 // 10 min from now

    expect(_isTokenExpiring(exp, undefined, 300)).toBe(false) // not expiring within 5 min
    expect(_isTokenExpiring(exp, undefined, 900)).toBe(true) // expiring within 15 min
  })

  it('returns true for already expired token', () => {
    const exp = Math.floor(Date.now() / 1000) - 100
    expect(_isTokenExpiring(exp)).toBe(true)
  })
})
