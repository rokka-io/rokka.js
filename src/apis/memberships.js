/**
 * ### Memberships
 *
 * #### Roles
 *
 * - `rokka.memberships.ROLES.READ` - read-only access
 * - `rokka.memberships.ROLES.WRITE` - read-write access
 * - `rokka.memberships.ROLES.UPLOAD` - upload-only access
 * - `rokka.memberships.ROLES.ADMIN` - administrative access
 *
 * @module memberships
 */
export default state => {
  const ROLES = {
    READ: 'read',
    WRITE: 'write',
    UPLOAD: 'upload',
    ADMIN: 'admin'
  }
  const memberships = { ROLES }

  /**
   * Add a member to an organization.
   *
   * ```js
   * rokka.memberships.create('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290', [rokka.memberships.ROLES.WRITE])
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}        organization name
   * @param  {string}        userId       UUID of user to add to the organization
   * @param  {string|array}  roles        user roles (`rokka.memberships.ROLES`)
   * @return {Promise}
   */
  memberships.create = (organization, userId, roles) => {
    if (typeof roles === 'string') {
      roles = [roles]
    }

    roles.forEach(role => {
      if (
        Object.keys(ROLES)
          .map(key => ROLES[key])
          .indexOf(role) === -1
      ) {
        return Promise.reject(new Error(`Invalid role "${role}"`))
      }
    })

    const path = `organizations/${organization}/memberships/${userId}`

    return state.request('PUT', path, { roles: roles })
  }

  /**
   * Delete a member in an organization.
   *
   * ```js
   * rokka.memberships.delete('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}        organization name
   * @param  {string}        userId       UUID of user to add to the organization
   * @return {Promise}
   */
  memberships.delete = (organization, userId) => {
    const path = `organizations/${organization}/memberships/${userId}`

    return state.request('DELETE', path)
  }

  /**
   * Create a user and membership associated to this organization.
   *
   * ```js
   * rokka.memberships.createWithNewUser('myorg', [rokka.memberships.ROLES.READ])
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}        organization name
   * @param  {array}  roles        user roles (`rokka.memberships.ROLES`)
   * @return {Promise}
   */
  memberships.createWithNewUser = (organization, roles) => {
    roles.forEach(role => {
      if (
        Object.keys(ROLES)
          .map(key => ROLES[key])
          .indexOf(role) === -1
      ) {
        return Promise.reject(new Error(`Invalid role "${role}"`))
      }
    })

    const path = `organizations/${organization}/memberships`

    return state.request('POST', path, { roles: roles })
  }

  /**
   * Lists members in an organization.
   *
   * ```js
   * rokka.memberships.list('myorg')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}        organization name
   * @return {Promise}
   */
  memberships.list = organization => {
    const path = `organizations/${organization}/memberships`

    return state.request('GET', path)
  }

  return {
    memberships
  }
}
