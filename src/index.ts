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
  RequestQueryParamsNewToken,
  User,
} from './apis/user'
import { _getTokenPayload, _isTokenExpiring, _tokenValidFor } from './utils'
import { Billing } from './apis/billing'
import { Expressions } from './apis/expressions'
import { Memberships } from './apis/memberships'
import { Operations } from './apis/operations'
import { Organizations } from './apis/organizations'
import { Render } from './apis/render'
import { APISourceimages } from './apis/sourceimages'
import { StackOptions } from './apis/stackoptions'
import { Stacks } from './apis/stacks'
import { Stats } from './apis/stats'
import { Users } from './apis/users'
import { Utils } from './apis/utils'
import { Request as RequestApi } from './apis/request'

export interface Config {
  apiKey?: string
  apiHost?: string // default: https://api.rokka.io
  apiVersion?: number | string // default: 1
  apiTokenGetCallback?: ApiTokenGetCallback
  apiTokenSetCallback?: ApiTokenSetCallback
  apiTokenRefreshTime?: number
  apiTokenOptions?: RequestQueryParamsNewToken | null
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
  host?: string
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  form: {}
  json: boolean
  body: any
  agent?: any
}

export interface RequestQueryParams {
  [key: string]: string | number | boolean | undefined | null
}

export interface State {
  apiKey: string | undefined
  apiHost: string
  apiVersion: number | string
  renderHost: string
  transportOptions: any
  apiTokenGetCallback?: ApiTokenGetCallback
  apiTokenSetCallback?: ApiTokenSetCallback
  apiTokenPayload: ApiTokenPayload | null
  apiTokenOptions?: RequestQueryParamsNewToken | null
  apiTokenRefreshTime: number

  request(
    method: string,
    path: string,
    payload?: any | null | undefined,
    queryParams?: RequestQueryParams | null,
    options?: RequestOptions | undefined | null,
  ): Promise<RokkaResponseInterface>
}

/**
 * Creates the internal state object for the Rokka client.
 *
 * @param config - Configuration properties
 * @returns The internal state object
 */
function createState(config: Config): State {
  const state: State = {
    // config
    apiKey: config.apiKey,
    apiHost: config.apiHost || defaults.apiHost,
    apiTokenGetCallback: config.apiTokenGetCallback || null,
    apiTokenSetCallback: config.apiTokenSetCallback || null,
    apiTokenPayload: null,
    apiTokenOptions: config.apiTokenOptions || {},
    apiTokenRefreshTime: config.apiTokenRefreshTime || 3600,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    transportOptions: Object.assign({}, defaults.transport, config.transport),

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
        host: undefined,
      },
    ): Promise<RokkaResponseInterface> {
      let uri = [options.host || state.apiHost, path].join('/')
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
          // fill apiTokenPayload, if not set, this happens when you load a page, for example
          if (!state.apiTokenPayload) {
            state.apiTokenPayload = _getTokenPayload(apiToken)
          }
          // get a new token, when it's somehow almost expired, but should still be valid
          const isTokenValid =
            apiToken &&
            state.apiTokenPayload?.rn === true &&
            _tokenValidFor(state.apiTokenPayload?.exp, apiToken) > 0

          // if it's not valid, it's also not expiring...
          const isTokenExpiring =
            isTokenValid &&
            _isTokenExpiring(
              state.apiTokenPayload?.exp,
              apiToken,
              state.apiTokenRefreshTime,
            )
          if (
            (!options.noTokenRefresh && isTokenValid && isTokenExpiring) ||
            (!isTokenValid && state.apiKey) //or do we have an apiKey
          ) {
            try {
              apiToken = (await user(state).user.getNewToken(state.apiKey)).body
                .token
            } catch (e: any) {
              // clear the api token so that we can enforce a new login usually
              //  a 403 means that we couldn't get a new token (trying to get a longer expiry time for example)
              if (e && e.statusCode === 403 && state.apiTokenSetCallback) {
                state.apiTokenSetCallback('', null)
              }
            }
          }
          if (!apiToken) {
            const code = 401
            throw {
              error: {
                code,
                message: 'No API token (or renewing it did not work correctly)',
              },
              status: code,
            }
          }

          // set apiTokenExpiry, if not set, to avoid to having to decode it all the time

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

      const requestOptions: Request = {
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
        requestOptions.body = requestData
      } else if (options.multipart !== true) {
        requestOptions.json = true
        requestOptions.body = payload
      } else {
        const formData = payload.formData || {}
        const requestData = new FormData()

        requestData.append(payload.name, payload.contents, payload.filename)

        Object.keys(formData).forEach(function (meta) {
          requestData.append(meta, JSON.stringify(formData[meta]))
        })

        requestOptions.body = requestData
      }

      if (
        requestOptions.json &&
        requestOptions.body &&
        typeof requestOptions.body === 'object'
      ) {
        requestOptions.body = JSON.stringify(requestOptions.body)
      }

      const t = transport(uri, requestOptions)
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
            // if response is a 401 and we have apiTokenSetCallback, clear the token
            if (
              response.status === 401 &&
              state.apiTokenSetCallback &&
              state.apiTokenGetCallback
            ) {
              // but not when the authorization header changed in the meantime
              if (
                headers['Authorization'] ===
                'Bearer ' + state.apiTokenGetCallback()
              ) {
                state.apiTokenSetCallback('', null)
                state.apiTokenPayload = null
              }
            }
            throw rokkaResponse
          }
          return rokkaResponse
        },
      )
    },
  }

  return state
}

/**
 * Rokka SDK client class.
 *
 * @example
 * ```js
 * import { Rokka } from 'rokka'
 * const rokka = new Rokka({ apiKey: 'apikey' })
 * ```
 */
export class Rokka implements RokkaApi {
  private readonly _state: State

  public readonly billing: Billing
  public readonly expressions: Expressions
  public readonly memberships: Memberships
  public readonly operations: Operations
  public readonly organizations: Organizations
  public readonly render: Render
  public readonly sourceimages: APISourceimages
  public readonly stackoptions: StackOptions
  public readonly stacks: Stacks
  public readonly stats: Stats
  public readonly users: Users
  public readonly user: User
  public readonly utils: Utils
  public readonly request: RequestApi

  constructor(config: Config = {}) {
    this._state = createState(config)

    const api = modules(this._state)
    this.billing = api.billing
    this.expressions = api.expressions
    this.memberships = api.memberships
    this.operations = api.operations
    this.organizations = api.organizations
    this.render = api.render
    this.sourceimages = api.sourceimages
    this.stackoptions = api.stackoptions
    this.stacks = api.stacks
    this.stats = api.stats
    this.users = api.users
    this.user = api.user
    this.utils = api.utils
    this.request = api.request
  }
}

/**
 * Initializing the rokka client using the factory function (backwards compatible).
 *
 * All properties are optional since certain calls don't require credentials.
 *
 * @example
 * ```js
 * const rokka = require('rokka')({ apiKey: 'apikey' })
 * ```
 *
 * @param config - Configuration properties
 * @returns The rokka client API
 */
export default (config: Config = {}): RokkaApi => {
  return new Rokka(config)
}
