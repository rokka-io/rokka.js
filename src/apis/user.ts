/**
 * ### User
 *
 * @module user
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

interface UserApiKey {
  id: string
  accessed?: string
  created?: string
  comment?: string
  api_key?: string
}

interface UserApiKeyResponse extends RokkaResponse {
  body: UserApiKey
}

interface UserResponse extends RokkaResponse {
  body: UserApiKey
}

interface UserApiKeyListResponse extends RokkaResponse {
  body: { id: string; email?: string; api_keys: UserApiKey[] }
}

export interface User {
  getId(): Promise<string>
  get(): Promise<UserResponse>
  addApiKey(comment: string | null): Promise<UserApiKeyResponse>
  deleteApiKey(id: string): Promise<RokkaResponse>
  listApiKeys(): Promise<UserApiKeyListResponse>
  getCurrentApiKey(): Promise<UserApiKeyResponse>
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
  }

  return {
    user,
  }
}
