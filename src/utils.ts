import { StackOperation } from './apis/stacks'
import jwtDecode from 'jwt-decode'
import { ApiTokenGetCallback, ApiTokenPayload } from './apis/user'

export function stringifyOperations(
  operations: StackOperation | StackOperation[],
): string {
  const stackoperations: StackOperation[] = Array.isArray(operations)
    ? operations
    : [operations]

  return stackoperations
    .map(operation => {
      const name = operation.name
      const options = Object.keys(operation.options || {})
        .map(
          k =>
            `${k}-${
              operation.options && operation.options[k]
                ? operation.options[k]
                : '__undefined__'
            }`,
        )
        .join('-')

      if (!options) {
        return name
      }

      return `${name}-${options}`
    })
    .join('--')
}

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
    console.log('Could not decode token')
    return null
  }
}
