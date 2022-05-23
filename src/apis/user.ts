/**
 * ### User
 *
 * @module user
 */

import { RokkaResponse } from '../response'
import { RequestQueryParams, State } from '../index'
import { _getTokenPayload, _isTokenExpiring, _tokenValidFor } from '../utils'

export interface UserApiKey {
  id: string
  accessed?: string
  created?: string
  comment?: string
  api_key?: string
}

export interface UserApiKeyResponse extends RokkaResponse {
  body: UserApiKey
}

export type ApiToken = string | null

export interface UserKeyTokenBody extends RokkaResponse {
  token: ApiToken
  payload: ApiTokenPayload
}

export interface ApiTokenPayload {
  [key: string]: string[] | string | number | undefined | null | boolean
  exp: number
  ip?: string
  expt?: number
  nr?: boolean
  ips?: string[]
}

export type ApiTokenGetCallback = (() => ApiToken) | null | undefined
export type ApiTokenSetCallback =
  | ((token: ApiToken, payload?: ApiTokenPayload | null) => void)
  | null

export interface UserKeyTokenResponse extends RokkaResponse {
  body: UserKeyTokenBody
}

export interface UserApiKeyListResponse extends RokkaResponse {
  body: UserApiKey[]
}

export interface UserResponse extends RokkaResponse {
  body: { id: string; email?: string; api_keys: UserApiKey[] }
}

export interface RequestQueryParamsNewToken extends RequestQueryParams {
  renewable?: boolean
  no_ip_protection?: boolean
  ips?: string
  expires_in?: number
}

export interface User {
  getId(): Promise<string>
  get(): Promise<UserResponse>
  addApiKey(comment: string | null): Promise<UserApiKeyResponse>
  deleteApiKey(id: string): Promise<RokkaResponse>
  listApiKeys(): Promise<UserApiKeyListResponse>
  getCurrentApiKey(): Promise<UserApiKeyResponse>
  getNewToken(
    apiKey?: string,
    queryParams?: RequestQueryParamsNewToken | null,
  ): Promise<UserKeyTokenResponse>
  getToken(): ApiToken | null
  setToken(token: ApiToken | null): void
  isTokenExpiring(atLeastNotForSeconds?: number): boolean
  getTokenIsValidFor(): number
}

export default (state: State): { user: User } => {
  const user: User = {
    /**
     * Get user_id for current user
     *
     * ```js
     * rokka.users.getId()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    getId: (): Promise<string> => {
      return state.request('GET', 'user').then(result => result.body.user_id)
    },

    /**
     * Get user object for current user
     *
     * ```js
     * rokka.user.get()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     * ```
     *
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    get: (): Promise<UserResponse> => {
      return state.request('GET', 'user')
    },

    /**
     * List Api Keys of the current user

     *
     * ```js
     * rokka.user.listApiKeys()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     *  ```
     *
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    listApiKeys: (): Promise<UserApiKeyListResponse> => {
      return state.request('GET', 'user/apikeys')
    },

    /**
     * Add Api Key to the current user
     *
     * @param  {string}  comment optional comment
     *
     * ```js
     * rokka.user.addApiKey('some comment')
     *  .then(function(result) {})
     *  .catch(function(err) {});
     * ```
     *
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    addApiKey: (comment: string | null = null): Promise<UserApiKeyResponse> => {
      return state.request('POST', 'user/apikeys', { comment })
    },

    /**
     * Delete Api Key from the current user

     *
     * @param  {string}  id the id of the Api Key
     *
     * ```js
     * rokka.user.deleteApiKey(id)
     *  .then(function(result) {})
     *  .catch(function(err) {});
     * ```
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    deleteApiKey: (id: string): Promise<RokkaResponse> => {
      return state.request('DELETE', `user/apikeys/${id}`)
    },

    /**
     * Get currently used Api Key
     *
     * ```js
     * rokka.user.getCurrentApiKey()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     * ```
     *
     * @since 3.3.0
     * @authenticated
     *
     * @return {Promise}
     */
    getCurrentApiKey: (): Promise<UserApiKeyResponse> => {
      return state.request('GET', 'user/apikeys/current')
    },

    /**
     * Gets a new JWT token from the API.
     *
     * You either provide an API Key or there's a valid JWT token registered to get a new JWT token.
     *
     * ```js
     * rokka.user.getNowToken(apiKey, {expires_in: 48 * 3600, renewable: true})
     *  .then(function(result) {})
     *  .catch(function(err) {});
     * ```
     *
     * @since 3.7.0
     * @authenticated
     *
     *
     * @param {string}                      apiKey (optional) If you don't have a valid JWT token, we need an API key to retrieve a new one
     * @param {RequestQueryParamsNewToken}  queryParams (optional) The query parameters used for generating a new JWT token.
     *
     * @return {Promise}
     */
    getNewToken(
      apiKey?: string,
      queryParams: RequestQueryParamsNewToken | null = {},
    ): Promise<UserKeyTokenResponse> {
      if (apiKey) {
        state.apiKey = apiKey
      }
      if (!!queryParams) {
        queryParams = {}
      }
      return state
        .request(
          'GET',
          'user/apikeys/token',
          undefined,
          { ...state.apiTokenOptions, ...queryParams },
          {
            forceUseApiKey: !!apiKey && this.getTokenIsValidFor() < 10,
            noTokenRefresh: true,
          },
        )
        .then(response => {
          this.setToken(response.body.token)
          return response
        })
    },

    /**
     * Gets the currently registered JWT Token from the `apiTokenGetCallback` config function or null
     *
     * @since 3.7.0
     *
     * @return {string|null}
     */
    getToken: (): ApiToken => {
      return state.apiTokenGetCallback ? state.apiTokenGetCallback() : null
    },

    /**
     * Sets a new JWT token with the `apiTokenSetCallback` function
     *
     * @since 3.7.0
     *
     * @param {string} token
     */
    setToken: (token: ApiToken) => {
      if (state.apiTokenSetCallback) {
        state.apiTokenPayload = _getTokenPayload(token)
        state.apiTokenSetCallback(token, state.apiTokenPayload)
      }
    },

    /**
     * Check if the registered JWT token is expiring within these amount of seconds (default: 3600)
     *
     * @since 3.7.0
     *
     * @param {number} withinNextSeconds Does it expire in these seconds (default: 3600)
     *
     * @return {boolean}
     */
    isTokenExpiring(withinNextSeconds = 3600): boolean {
      return _isTokenExpiring(
        state.apiTokenPayload?.exp,
        state.apiTokenGetCallback,
        withinNextSeconds,
      )
    },

    /**
     * How long a token is still valid for (just checking for expiration time
     *
     * @since 3.7.0
     *
     * @return {number} The amount of seconds it's still valid for, -1 if it doesn't exist
     */
    getTokenIsValidFor(): number {
      return _tokenValidFor(
        state.apiTokenPayload?.exp,
        state.apiTokenGetCallback,
      )
    },
  }

  return {
    user,
  }
}
