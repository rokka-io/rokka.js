import transport from './transport'
import modules, { RokkaApi } from './apis'
import RokkaResponse, {
  RokkaResponse as RokkaResponseInterface
} from './response'
import { stringify } from 'query-string'
import FormData from 'form-data'

export interface Config {
  apiKey?: string
  apiHost?: string // default: https://api.rokka.io
  apiVersion?: number | string // default: 1
  renderHost?: string // default: https://{organization}.rokka.io
  debug?: boolean // default: false
  transport?: {
    requestTimeout?: number // milliseconds to wait for rokka server response (default: 30000)
    retries?: number // number of retries when API response is 429 (default: 10)
    minTimeout?: number // minimum milliseconds between retries (default: 1000)
    maxTimeout?: number // maximum milliseconds between retries (default: 10000)
    randomize?: boolean // randomize time between retries (default: true)
  }
}

interface RequestOptions {
  headers?: object
  noAuthHeaders?: boolean
  form?: boolean
  multipart?: boolean
}

const defaults = {
  apiHost: 'https://api.rokka.io',
  renderHost: 'https://{organization}.rokka.io',
  apiVersion: 1,
  transport: {
    requestTimeout: 30000,
    retries: 10,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true,
    factor: 2,
    debug: false
  }
}

const getResponseBody = async (response: any) => {
  if (response.headers && response.json) {
    if (response.headers.get('content-type') === 'application/json') {
      return response.json()
    }
    return response.text()
  }
  return response.body
}

interface Request {
  method: string
  headers: { 'Api-Version'?: string | number; 'Api-Key'?: string }
  timeout: number | undefined
  retries: number | undefined | any
  retryDelay: (attempt: number) => number
  form: {}
  json: boolean
  body: any
}

export interface State {
  apiKey: string | undefined
  apiHost: string
  apiVersion: number | string
  renderHost: string
  transportOptions: any
  request(
    method: string,
    path: string,
    payload?: any | null | undefined,
    queryParams?: {
      [key: string]: string | number | boolean | undefined | null
    } | null,
    options?: RequestOptions | undefined | null
  ): Promise<RokkaResponseInterface>
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
export default (config: Config = {}): RokkaApi => {
  const state: State = {
    // config
    apiKey: config.apiKey,
    apiHost: config.apiHost || defaults.apiHost,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    transportOptions: Object.assign(defaults.transport, config.transport),

    // functions
    request(
      method: string,
      path: string,
      payload: any | null = null,
      queryParams: { [key: string]: string | number | boolean } | null = null,
      options: RequestOptions = { noAuthHeaders: false }
    ): Promise<RokkaResponseInterface> {
      let uri = [state.apiHost, path].join('/')
      if (
        queryParams &&
        !(
          Object.entries(queryParams).length === 0 &&
          queryParams.constructor === Object
        )
      ) {
        uri += '?' + stringify(queryParams)
      }
      const headers: { 'Api-Version'?: string | number; 'Api-Key'?: string } =
        options.headers || {}

      headers['Api-Version'] = state.apiVersion

      if (options.noAuthHeaders !== true) {
        if (!state.apiKey) {
          return Promise.reject(new Error('Missing required property `apiKey`'))
        }

        headers['Api-Key'] = state.apiKey
      }

      const retryDelay = (attempt: number) => {
        // from https://github.com/tim-kos/node-retry/blob/master/lib/retry.js
        const random = state.transportOptions.randomize ? Math.random() + 1 : 1

        const timeout = Math.round(
          random *
            state.transportOptions.minTimeout *
            Math.pow(state.transportOptions.factor, attempt)
        )
        return Math.min(timeout, state.transportOptions.maxTimeout)
      }

      const request: Request = {
        method: method,
        headers: headers,
        timeout: state.transportOptions.requestTimeout,
        retries: state.transportOptions.retries,
        retryDelay,
        form: {},
        json: false,
        body: undefined
      }
      if (options.form === true) {
        request.form = payload || {}
      } else if (options.multipart !== true) {
        request.json = true
        request.body = payload
      } else {
        const formData = payload.formData || {}
        const requestData = new FormData()

        requestData.append(payload.name, payload.contents, payload.filename)

        Object.keys(formData).forEach(function(meta) {
          requestData.append(meta, JSON.stringify(formData[meta]))
        })

        request.body = requestData
      }

      if (request.json && request.body && typeof request.body === 'object') {
        request.body = JSON.stringify(request.body)
      }

      const t = transport(uri, request)
      return t.then(
        async (response: Response): Promise<RokkaResponseInterface> => {
          const rokkaResponse = RokkaResponse(response)
          rokkaResponse.body = await getResponseBody(response)
          if (response.status >= 400) {
            rokkaResponse.error = rokkaResponse.body
            rokkaResponse.message =
              response.status + ' - ' + JSON.stringify(rokkaResponse.body)
            throw rokkaResponse
          }
          return rokkaResponse
        }
      )
    }
  }

  return Object.assign({}, modules(state))
}
