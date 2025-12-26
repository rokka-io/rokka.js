import fetch from 'cross-fetch'
// from https://github.com/jonbern/fetch-retry
// and https://github.com/jonbern/fetch-retry/pull/27

function isPositiveInteger(value: any) {
  return Number.isInteger(value) && value >= 0
}

class ArgumentError {
  [x: string]: string
  constructor(message: string) {
    this.name = 'ArgumentError'
    this.message = message
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type RetryDelayFn = Function | number
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type RetryOnFn = Function | number[]

interface Options {
  retryDelay?: RetryDelayFn
  retries?: number
  retryOn?: RetryOnFn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agent?: any
}

export default (url: string, options: Options): Promise<Response> => {
  let retries = 3
  let retryDelay: RetryDelayFn = 1000
  let retryOn: RetryOnFn = [429, 502, 503, 504]
  if (options && options.retries !== undefined) {
    if (isPositiveInteger(options.retries)) {
      retries = options.retries
    } else {
      throw new ArgumentError('retries must be a positive integer')
    }
  }

  if (options && options.retryDelay !== undefined) {
    if (
      isPositiveInteger(options.retryDelay) ||
      typeof options.retryDelay === 'function'
    ) {
      retryDelay = options.retryDelay
    } else {
      throw new ArgumentError(
        'retryDelay must be a positive integer or a function returning a positive integer',
      )
    }
  }

  if (options && options.retryOn) {
    if (
      Array.isArray(options.retryOn) ||
      typeof options.retryOn === 'function'
    ) {
      retryOn = options.retryOn
    } else {
      throw new ArgumentError('retryOn property expects an array or function')
    }
  }

  return new Promise(function (resolve, reject) {
    function retry(attempt: number, error: string | null, response: any) {
      const delay =
        typeof retryDelay === 'function'
          ? retryDelay(attempt, error, response)
          : retryDelay
      setTimeout(function () {
        //eslint-disable-next-line @typescript-eslint/no-use-before-define
        wrappedFetch(++attempt)
      }, delay)
    }
    const wrappedFetch = function (attempt: number) {
      fetch(url, options as any)
        .then(function (response) {
          if (
            Array.isArray(retryOn) &&
            retryOn.indexOf(response.status) === -1
          ) {
            resolve(response)
            return
          }
          if (typeof retryOn === 'function') {
            if (retryOn(attempt, null, response)) {
              retry(attempt, null, response)
              return
            }
            resolve(response)
            return
          }
          if (attempt < retries) {
            retry(attempt, null, response)
            return
          }
          resolve(response)
        })
        .catch(function (error) {
          if (typeof retryOn === 'function') {
            if (retryOn(attempt, error, null)) {
              retry(attempt, error, null)
              return
            }
            reject(error)
            return
          }
          if (attempt < retries) {
            retry(attempt, error, null)
            return
          }
          reject(error)
        })
    }
    wrappedFetch(0)
  })
}
