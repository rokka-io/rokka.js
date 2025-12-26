/**
 * ### Users
 *
 * @module users
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export interface Users {
  create(email: string, organization: string | null): Promise<RokkaResponse>
  getId(): Promise<string>
}

export default (state: State): { users: Users } => {
  const users: Users = {
    /**
     * Register a new user for the rokka service.
     *
     * @example
     * ```js
     * rokka.users.create('user@example.org')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param email - Email address of a user
     * @param organization - Organization to create
     * @returns Promise resolving to the created user
     */
    create: (
      email: string,
      organization: string | null = null,
    ): Promise<RokkaResponse> => {
      return state.request('POST', 'users', { email, organization }, null, {
        noAuthHeaders: true,
      })
    },

    /**
     * Get user_id for current user
     *
     * @example
     * ```js
     * rokka.users.getId()
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @returns Promise resolving to the user ID
     */
    getId: (): Promise<string> => {
      return state.request('GET', 'user').then(result => result.body.user_id)
    },
  }

  return {
    users,
  }
}
