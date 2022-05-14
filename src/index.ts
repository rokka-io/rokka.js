import transport from './transport'
import modules, { RokkaApi } from './apis'
import RokkaResponse, {
  RokkaResponse as RokkaResponseInterface,
} from './response'
import { stringify } from 'query-string'
import FormData from 'form-data'
import user, {
  ApiTokenGetCallback,
  ApiTokenPayload,
  ApiTokenSetCallback,
} from './apis/user'
import { _getTokenPayload, _isTokenExpiring, _tokenValidFor } from './utils'

export interface Config {
  apiKey?: string
  apiHost?: string // default: https://api.rokka.io
  apiVersion?: number | string // default: 1
  apiTokenGetCallback?: ApiTokenGetCallback
  apiTokenSetCallback?: ApiTokenSetCallback
  renderHost?: string // default: https://{organization}.rokka.io
  debug?: boolean // default: false
  transport?: {
    requestTimeout?: number // milliseconds to wait for rokka server response (default: 30000)
    retries?: number // number of retries when API response is 429 (default: 10)
    minTimeout?: number // minimum milliseconds between retries (default: 1000)
    maxTimeout?: number // maximum milliseconds between retries (default: 10000)
    randomize?: boolean // randomize time between retries (default: true)
    agent?: any
  }
}

interface RequestOptions {
  headers?: object
  noAuthHeaders?: boolean
  fallBackToText?: boolean
  form?: boolean
  multipart?: boolean
  forceUseApiKey?: boolean
  noTokenRefresh?: boolean
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
    debug: false,
  },
}

const getResponseBody = async (response: Response, fallbackToText = false) => {
  if (response.headers && response.json) {
    if (response.headers.get('content-type') === 'application/json') {
      return response.json()
    }

    if (response.status === 204 || response.status === 201 || fallbackToText) {
      return response.text()
    }
    return response.body
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
  agent?: any
}

export interface State {
  apiKey: string | undefined
  apiHost: string
  apiTokenGetCallback?: ApiTokenGetCallback
  apiVersion: number | string
  renderHost: string
  transportOptions: any
  apiTokenSetCallback?: ApiTokenSetCallback
  apiTokenPayload: ApiTokenPayload | null

  request(
    method: string,
    path: string,
    payload?: any | null | undefined,
    queryParams?: {
      [key: string]: string | number | boolean | undefined | null
    } | null,
    options?: RequestOptions | undefined | null,
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
 *     agent?: <any>               // an agent to be used with node-fetch, eg. if you need a proxy (default: undefined)
 *   }
 * });
 * ```
 *
 * All properties are optional since certain calls don't require credentials.
 *
 * If you need to use a proxy, you can do the following
 *
 * ```js
 * import { HttpsProxyAgent } from 'https-proxy-agent'
 *
 * const rokka = require('rokka')({
 *  apiKey: 'apikey'
 *  transport: {agent: new HttpsProxyAgent(proxy)}
 * });
 * ```
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
    apiTokenGetCallback: config.apiTokenGetCallback || null,
    apiTokenSetCallback: config.apiTokenSetCallback || null,
    apiTokenPayload: null,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    transportOptions: Object.assign(defaults.transport, config.transport),

    // functions
    async request(
      method: string,
      path: string,
      payload: any | null = null,
      queryParams: {
        [key: string]: string | number | boolean
      } | null = null,
      options: RequestOptions = {
        noAuthHeaders: false,
        fallBackToText: false,
        forceUseApiKey: false,
        noTokenRefresh: false,
      },
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

      const headers: {
        'Api-Version'?: string | number
        'Api-Key'?: string
        Authorization?: string
      } = options.headers || {}

      headers['Api-Version'] = state.apiVersion

      if (options.noAuthHeaders !== true) {
        if (!options.forceUseApiKey && state.apiTokenGetCallback) {
          let apiToken = state.apiTokenGetCallback()
          // get a new token, when it's somehow almost expired, but should still be valid
          if (
            !options.noTokenRefresh &&
            _isTokenExpiring(state.apiTokenPayload?.exp, apiToken, 3600) &&
            _tokenValidFor(state.apiTokenPayload?.exp, apiToken) > 0
          ) {
            apiToken = (await user(state).user.getNewToken()).body.token
          }
          // set apiTokenExpiry, if not set, to avoid to having to decode it all the time
          if (!state.apiTokenPayload) {
            state.apiTokenPayload = _getTokenPayload(apiToken)
          }
          headers['Authorization'] = `Bearer ${apiToken}`
        } else {
          if (!state.apiKey) {
            return Promise.reject(
              new Error('Missing required property `apiKey`'),
            )
          }
          headers['Api-Key'] = state.apiKey
        }
      }

      const retryDelay = (attempt: number) => {
        // from https://github.com/tim-kos/node-retry/blob/master/lib/retry.js
        const random = state.transportOptions.randomize ? Math.random() + 1 : 1

        const timeout = Math.round(
          random *
            state.transportOptions.minTimeout *
            Math.pow(state.transportOptions.factor, attempt),
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
        body: undefined,
        agent: state.transportOptions.agent,
      }
      if (options.form === true) {
        const formData = payload || {}
        const requestData = new FormData()
        Object.keys(formData).forEach(function (meta) {
          requestData.append(meta, formData[meta])
        })
        request.body = requestData
      } else if (options.multipart !== true) {
        request.json = true
        request.body = payload
      } else {
        const formData = payload.formData || {}
        const requestData = new FormData()

        requestData.append(payload.name, payload.contents, payload.filename)

        Object.keys(formData).forEach(function (meta) {
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
          rokkaResponse.body = await getResponseBody(
            response,
            options.fallBackToText,
          )
          if (response.status >= 400) {
            rokkaResponse.error = rokkaResponse.body
            rokkaResponse.message =
              response.status + ' - ' + JSON.stringify(rokkaResponse.body)
            // if response is a 403 and we have apiTokenSetCallback, clear the token
            if (response.status === 403 && state.apiTokenSetCallback) {
              state.apiTokenSetCallback('')
              state.apiTokenPayload = null
            }
            throw rokkaResponse
          }
          return rokkaResponse
        },
      )
    },
  }

  return Object.assign({}, modules(state))
}
