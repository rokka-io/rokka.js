import transport from './transport'
import modules from './apis'
import RokkaResponse from './response'
import queryString from 'query-string'
import FormData from 'form-data'

const defaults = {
  apiHost: 'https://api.rokka.io',
  renderHost: 'https://{organization}.rokka.io',
  apiVersion: 1,
  transport: {
    requestTimeout: 30000,
    retries: 10,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true
  }
}

/**
 * Initializing the rokka client.
 *
 * ```js
 * const rokka = require('rokka')({
 *   apiKey: 'apikey',       // required for certain operations
 *   apiHost: '<url>',       // default: https://api.rokka.io
 *   apiVersion: <number>,   // default: 1
 *   renderHost: '<url>',    // default: https://{organization}.rokka.io
 *   debug: true,            // default: false
 *   transport: {
 *     requestTimeout: <number>,  // milliseconds to wait for rokka server response (default: 30000)
 *     retries: <number>,         // number of retries when API response is 429 (default: 10)
 *     minTimeout: <number>,      // minimum milliseconds between retries (default: 1000)
 *     maxTimeout: <number>,      // maximum milliseconds between retries (default: 10000)
 *     randomize: <boolean>       // randomize time between retries (default: true)
 *   }
 * });
 * ```
 *
 * All properties are optional since certain calls don't require credentials.
 *
 * @param  {Object} [config={}] configuration properties
 * @return {Object}
 *
 * @module rokka
 */
export default (config = {}) => {
  if (config.debug !== null) {
    transport.debug = config.debug
  }

  const state = {
    // config
    apiKey: config.apiKey,
    apiHost: config.apiHost || defaults.apiHost,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    transportOptions: Object.assign(defaults.transport, config.transport),

    // functions
    request (method, path, payload = null, queryParams = null, options = {}) {
      let uri = [state.apiHost, path].join('/')
      if (
        queryParams &&
        !(
          Object.entries(queryParams).length === 0 &&
          queryParams.constructor === Object
        )
      ) {
        uri += '?' + queryString.stringify(queryParams)
      }
      const headers = options.headers || {}

      headers['Api-Version'] = state.apiVersion

      if (options.noAuthHeaders !== true) {
        if (!state.apiKey) {
          return Promise.reject(new Error('Missing required property `apiKey`'))
        }

        headers['Api-Key'] = state.apiKey
      }

      const request = {
        method: method,
        headers: headers,
        timeout: state.transportOptions.requestTimeout,
        resolveWithFullResponse: true
      }
      if (options.form === true) {
        request.form = payload || {}
      } else if (options.multipart !== true) {
        request.json = true
        request.body = payload
      } else if (typeof window !== 'undefined') {
        request.headers['Content-Type'] = 'multipart/form-data'
        const formData = payload.formData || new FormData()
        const data = [
          {
            'Content-Disposition': `form-data; name="filedata"; filename="${
              payload.filename
            }"`,
            body: payload.contents
          }
        ]

        Object.keys(formData).forEach(function (meta) {
          data.push({
            'Content-Disposition': 'form-data; name="' + meta + '"',
            body: JSON.stringify(formData[meta])
          })
        })

        request.multipart = {
          chunked: false,
          data: data
        }
      } else {
        // FIXME: this...
        // const data = payload.formData || {}
        const data = new FormData()

        data.append(payload.name, payload.contents, {
          filename: payload.filename
        })

        request.body = data
      }

      return transport(uri, request, state.transportOptions).then(
        async response => {
          const rokkaResponse = RokkaResponse(response)
          rokkaResponse.body = await rokkaResponse.getBody()
          return rokkaResponse
        }
      )
    }
  }

  return Object.assign({}, modules(state))
}
