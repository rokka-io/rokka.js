/**
 * ### Users
 *
 * @module users
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export class UsersApi {
  constructor(private state: State) {}

  /**
   * Register a new user for the rokka service.
   *
   * @example
   * ```js
   * const result = await rokka.users.create('user@example.org')
   * ```
   *
   * @param email - Email address of a user
   * @param organization - Organization to create
   * @returns Promise resolving to the created user
   */
  create(
    email: string,
    organization: string | null = null,
  ): Promise<RokkaResponse> {
    return this.state.request('POST', 'users', { email, organization }, null, {
      noAuthHeaders: true,
    })
  }

  /**
   * Get user_id for current user
   *
   * @example
   * ```js
   * const result = await rokka.users.getId()
   * ```
   *
   * @returns Promise resolving to the user ID
   */
  getId(): Promise<string> {
    return this.state.request('GET', 'user').then(result => result.body.user_id)
  }
}

export type Users = UsersApi

export default (state: State): { users: Users } => ({
  users: new UsersApi(state),
})
