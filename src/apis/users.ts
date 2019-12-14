/**
 * ### Users
 *
 * @module users
 */

import { Response } from '../response'
import { State } from '../index'

export interface Users {
  create(email: string, organization: string | null): Promise<Response>
  getId(): Promise<string>
}

export default (state: State) => {
  const users: Users = {
    /**
     * Register a new user for the rokka service.
     *
     * ```js
     * rokka.users.create('user@example.org')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} email address of a user
     * @param {string} [organization = null] to create
     * @return {Promise}
     */
    create: (
      email: string,
      organization: string | null = null
    ): Promise<Response> => {
      return state.request('POST', 'users', { email, organization }, null, {
        noAuthHeaders: true
      })
    },

    /**
     * Get user_id for current user
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
    }
  }

  return {
    users
  }
}
