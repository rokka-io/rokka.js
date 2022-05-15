/**
 * ### User
 *
 * @module user
 */

import { RokkaResponse } from '../response'
import { RequestQueryParams, State } from '../index'
import { _getTokenPayload, _isTokenExpiring } from '../utils'

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

export interface UserKeyToken extends RokkaResponse {
  token: ApiToken
}

export interface ApiTokenPayload {
  [key: string]: string[] | string | number | undefined | null | boolean
  exp: number
  ip?: string
  nr?: boolean
  ips?: string[]
}

export type ApiTokenGetCallback = (() => ApiToken) | null | undefined
export type ApiTokenSetCallback = ((token: ApiToken) => void) | null

export interface UserKeyTokenResponse extends RokkaResponse {
  body: UserKeyToken
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
  tokenValidFor(): number
}

export default (state: State): { user: User } => {
  const user: User = {
    /**
     * Get user_id for current user
     *
     * @since 3.3.0
     * @authenticated
     *
     * ```js
     * rokka.users.getId()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @return {Promise}
     */
    getId: (): Promise<string> => {
      return state.request('GET', 'user').then(result => result.body.user_id)
    },

    /**
     * Get user object for current user
     *
     * @since 3.3.0
     * @authenticated
     *
     * ```js
     * rokka.user.get()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     */
    get: (): Promise<UserResponse> => {
      return state.request('GET', 'user')
    },

    /**
     * List Api Keys of the current user
     *
     * @since 3.3.0
     * @authenticated
     *
     * ```js
     * rokka.user.listApiKeys()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     */
    listApiKeys(): Promise<UserApiKeyListResponse> {
      return state.request('GET', 'user/apikeys')
    },

    /**
     * Add Api Key to the current user
     *
     * @since 3.3.0
     * @authenticated
     *
     * @param  {string}  comment optional comment
     *
     * ```js
     * rokka.user.addApiKey('some comment')
     *  .then(function(result) {})
     *  .catch(function(err) {});
     */
    addApiKey(comment: string | null = null): Promise<UserApiKeyResponse> {
      return state.request('POST', 'user/apikeys', { comment })
    },

    /**
     * Delete Api Key from the current user
     *
     * @since 3.3.0
     * @authenticated
     *
     * @param  {string}  id the id of the Api Key
     *
     * ```js
     * rokka.user.deleteApiKey(id)
     *  .then(function(result) {})
     *  .catch(function(err) {});
     */
    deleteApiKey(id: string): Promise<RokkaResponse> {
      return state.request('DELETE', `user/apikeys/${id}`)
    },

    /**
     * Get currently used Api Key
     *
     * @since 3.3.0
     * @authenticated
     *
     * ```js
     * rokka.user.getCurrentApiKey()
     *  .then(function(result) {})
     *  .catch(function(err) {});
     *  ```
     */
    getCurrentApiKey(): Promise<UserApiKeyResponse> {
      return state.request('GET', 'user/apikeys/current')
    },

    async getNewToken(
      apiKey?: string,
      queryParams: RequestQueryParamsNewToken | null = {},
    ): Promise<UserKeyTokenResponse> {
      if (apiKey) {
        state.apiKey = apiKey
      }
      if (!!queryParams) {
        queryParams = {}
      }
      const response: UserKeyTokenResponse = await state.request(
        'GET',
        'user/apikeys/token',
        undefined,
        { ...state.apiTokenOptions, ...queryParams },
        {
          forceUseApiKey: !!apiKey && this.tokenValidFor() < 10,
          noTokenRefresh: true,
        },
      )

      this.setToken(response.body.token)
      return response
    },

    getToken(): ApiToken {
      return state.apiTokenGetCallback ? state.apiTokenGetCallback() : null
    },

    setToken(token: ApiToken) {
      if (state.apiTokenSetCallback) {
        state.apiTokenSetCallback(token)
        state.apiTokenPayload = _getTokenPayload(token)
      }
    },

    isTokenExpiring(withinNextSeconds = 3600): boolean {
      return _isTokenExpiring(
        state.apiTokenPayload?.exp,
        state.apiTokenGetCallback,
        withinNextSeconds,
      )
    },
    tokenValidFor(): number {
      if (state.apiTokenPayload) {
        return state.apiTokenPayload.exp
      }
      state.apiTokenPayload = _getTokenPayload(state.apiTokenGetCallback)
      return state.apiTokenPayload?.exp ?? -1
    },
  }

  return {
    user,
  }
}
