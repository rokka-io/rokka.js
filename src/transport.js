import request from 'request-promise'
import promiseRetry from 'promise-retry'

// When the API sends a 429 back, retry it for 10 times
// We also retry on server errors 502, 503 and 504
// This code is mainly copied from
// https://github.com/CanTireInnovations/request-promise-retry/blob/master/index.js

const retryRequest = promiseRequest => (req, options) =>
  promiseRetry(
    retry =>
      promiseRequest(req).catch(err => {
        if (
          err.statusCode !== 429 &&
          err.statusCode !== 502 &&
          err.statusCode !== 503 &&
          err.statusCode !== 504
        ) {
          throw err
        }
        retry(err)
      }),
    options
  )

export default retryRequest(request)
