const users = {};

/**
 * ### Users
 *
 * @module users
 */
export default (state) => {
  /**
   * Register a new user for the rokka service.
   *
   * ```js
   * rokka.users.create('user@example.org')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @param {string} email address of a user
   * @return {Promise}
   */
  users.create = (email) => {
    return state.request('POST', 'users', { email: email }, null, { noAuthHeaders: true });
  };

  return {
    users
  };
};
