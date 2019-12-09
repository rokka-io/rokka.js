import fetch from 'cross-fetch'
// from https://github.com/jonbern/fetch-retry
// and https://github.com/jonbern/fetch-retry/pull/27
export default (
  url,
  options: {
    retryDelay?: Function | number
    retries?: number
    retryOn?: Function | number[]
  }
) => {
  let retries = 3
  let retryDelay: Function | number = 1000
  let retryOn: Function | number[] = [429, 502, 503, 504]
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
        'retryDelay must be a positive integer or a function returning a positive integer'
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
    const wrappedFetch = function (attempt) {
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

    function retry (attempt, error, response) {
      const delay =
        typeof retryDelay === 'function'
          ? retryDelay(attempt, error, response)
          : retryDelay
      setTimeout(function () {
        wrappedFetch(++attempt)
      }, delay)
    }

    wrappedFetch(0)
  })
}

function isPositiveInteger (value) {
  return Number.isInteger(value) && value >= 0
}

function ArgumentError (message) {
  this.name = 'ArgumentError'
  this.message = message
}
