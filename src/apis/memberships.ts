import { RokkaResponse } from '../response'
import { State } from '../index'

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

export interface Memberships {
  ROLES: { READ: Role; WRITE: Role; UPLOAD: Role; ADMIN: Role }
  create(
    organization: string,
    userId: string,
    roles: Role | Role[]
  ): Promise<RokkaResponse>
  delete(organization: string, userId: string): Promise<RokkaResponse>
  createWithNewUser(organization: string, roles: Role[]): Promise<RokkaResponse>
  list(organization: string): Promise<RokkaResponse>
  get(organization: string, userId: string): Promise<RokkaResponse>
}
export enum Role {
  READ = 'read',
  WRITE = 'write',
  UPLOAD = 'upload',
  ADMIN = 'admin'
}

export default (state: State) => {
  const ROLES: {
    [key: string]: Role
    READ: Role
    WRITE: Role
    UPLOAD: Role
    ADMIN: Role
  } = {
    READ: Role.READ,
    WRITE: Role.WRITE,
    UPLOAD: Role.UPLOAD,
    ADMIN: Role.ADMIN
  }
  const memberships: Memberships = {
    ROLES,

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
    create: (
      organization: string,
      userId: string,
      roles: Role | Role[]
    ): Promise<RokkaResponse> => {
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
    },

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
    delete: (organization, userId): Promise<RokkaResponse> => {
      const path = `organizations/${organization}/memberships/${userId}`

      return state.request('DELETE', path)
    },

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
    createWithNewUser: (
      organization: string,
      roles: Role[]
    ): Promise<RokkaResponse> => {
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
    },

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
    list: (organization: string): Promise<RokkaResponse> => {
      const path = `organizations/${organization}/memberships`

      return state.request('GET', path)
    },

    /**
     * Get info of a member in an organization.
     *
     * ```js
     * rokka.memberships.get('myorg',userId)
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}        organization name
     * @param  {string}        userId
     * @return {Promise}
     */
    get: (organization: string, userId: string): Promise<RokkaResponse> => {
      const path = `organizations/${organization}/memberships/${userId}`

      return state.request('GET', path)
    }
  }

  return {
    memberships
  }
}
