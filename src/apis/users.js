/**
 * ### Users
 *
 * @module users
 */
export default state => {
  const users = {}

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
  users.create = (email, organization = null) => {
    return state.request('POST', 'users', { email, organization }, null, {
      noAuthHeaders: true
    })
  }

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
  users.getId = () => {
    return state.request('GET', 'user').then(result => result.body.user_id)
  }

  return {
    users
  }
}
