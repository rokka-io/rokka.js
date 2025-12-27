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
  body: { user_id: string; email?: string; api_keys: UserApiKey[] }
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
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.users.getId()
     * ```
     *
     * @since 3.3.0
     * @returns Promise resolving to the user ID
     */
    getId: (): Promise<string> => {
      return state.request('GET', 'user').then(result => result.body.user_id)
    },

    /**
     * Get user object for current user
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.user.get()
     * ```
     *
     * @since 3.3.0
     * @returns Promise resolving to the user object
     */
    get: (): Promise<UserResponse> => {
      return state.request('GET', 'user')
    },

    /**
     * List Api Keys of the current user
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.user.listApiKeys()
     * ```
     *
     * @since 3.3.0
     * @returns Promise resolving to the list of API keys
     */
    listApiKeys: (): Promise<UserApiKeyListResponse> => {
      return state.request('GET', 'user/apikeys')
    },

    /**
     * Add Api Key to the current user
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.user.addApiKey('some comment')
     * ```
     *
     * @since 3.3.0
     * @param comment - Optional comment for the API key
     * @returns Promise resolving to the created API key
     */
    addApiKey: (comment: string | null = null): Promise<UserApiKeyResponse> => {
      return state.request('POST', 'user/apikeys', { comment })
    },

    /**
     * Delete Api Key from the current user
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * await rokka.user.deleteApiKey(id)
     * ```
     *
     * @since 3.3.0
     * @param id - The ID of the API key to delete
     * @returns Promise resolving when key is deleted
     */
    deleteApiKey: (id: string): Promise<RokkaResponse> => {
      return state.request('DELETE', `user/apikeys/${id}`)
    },

    /**
     * Get currently used Api Key
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.user.getCurrentApiKey()
     * ```
     *
     * @since 3.3.0
     * @returns Promise resolving to the current API key
     */
    getCurrentApiKey: (): Promise<UserApiKeyResponse> => {
      return state.request('GET', 'user/apikeys/current')
    },

    /**
     * Gets a new JWT token from the API.
     *
     * You either provide an API Key or there's a valid JWT token registered to get a new JWT token.
     *
     * @remarks
     * Requires authentication.
     *
     * @example
     * ```js
     * const result = await rokka.user.getNewToken(apiKey, {expires_in: 48 * 3600, renewable: true})
     * ```
     *
     * @since 3.7.0
     * @param apiKey - If you don't have a valid JWT token, we need an API key to retrieve a new one
     * @param queryParams - The query parameters used for generating a new JWT token
     * @returns Promise resolving to the new token
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
     * @returns The JWT token or null
     */
    getToken: (): ApiToken => {
      return state.apiTokenGetCallback ? state.apiTokenGetCallback() : null
    },

    /**
     * Sets a new JWT token with the `apiTokenSetCallback` function
     *
     * @since 3.7.0
     * @param token - The JWT token to set
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
     * @param withinNextSeconds - Does it expire in these seconds (default: 3600)
     * @returns True if token is expiring within the specified time
     */
    isTokenExpiring(withinNextSeconds = 3600): boolean {
      return _isTokenExpiring(
        state.apiTokenPayload?.exp,
        state.apiTokenGetCallback,
        withinNextSeconds,
      )
    },

    /**
     * How long a token is still valid for (just checking for expiration time)
     *
     * @since 3.7.0
     * @returns The amount of seconds it's still valid for, -1 if it doesn't exist
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
