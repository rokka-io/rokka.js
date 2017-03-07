const memberships = {};

const ROLES = memberships.ROLES = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

/**
 * ### Memberships
 *
 * #### Roles
 *
 * - `rokka.memberships.ROLES.READ` - read-only access
 * - `rokka.memberships.ROLES.WRITE` - read-write access
 * - `rokka.memberships.ROLES.ADMIN` - administrative access
 *
 * @module memberships
 */
export default (state) => {
  /**
   * Add a member to an organization.
   *
   * ```js
   * rokka.memberships.create('myorg', 'user@example.org', rokka.memberships.ROLES.WRITE)
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  email        email address of a registered rokka user
   * @param  {string}  role         user role (`rokka.memberships.ROLES`)
   * @return {Promise}
   */
  memberships.create = (organization, email, role) => {
    if (Object.keys(ROLES).map((key) => ROLES[key]).indexOf(role) === -1) {
      return Promise.reject(new Error(`Invalid role "${role}"`));
    }

    const path = `organizations/${organization}/memberships/${email}`;

    return state.request('PUT', path, { role: role });
  };

  return {
    memberships
  };
};
