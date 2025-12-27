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

export enum Role {
  ADMIN = 'admin',
  READ = 'read',
  WRITE = 'write',
  UPLOAD = 'upload',
  SOURCEIMAGE_READ = 'sourceimages:read',
  SOURCEIMAGE_WRITE = 'sourceimages:write',
  SOURCEIMAGE_UNLOCK = 'sourceimages:unlock',
  SOURCEIMAGES_DOWNLOAD_PROTECTED = 'sourceimages:download:protected',
}

export class MembershipsApi {
  readonly ROLES: {
    [key: string]: Role
    READ: Role
    WRITE: Role
    UPLOAD: Role
    ADMIN: Role
    SOURCEIMAGE_READ: Role
    SOURCEIMAGE_WRITE: Role
    SOURCEIMAGE_UNLOCK: Role
    SOURCEIMAGES_DOWNLOAD_PROTECTED: Role
  } = {
    READ: Role.READ,
    WRITE: Role.WRITE,
    UPLOAD: Role.UPLOAD,
    ADMIN: Role.ADMIN,
    SOURCEIMAGE_READ: Role.SOURCEIMAGE_READ,
    SOURCEIMAGE_WRITE: Role.SOURCEIMAGE_WRITE,
    SOURCEIMAGE_UNLOCK: Role.SOURCEIMAGE_UNLOCK,
    SOURCEIMAGES_DOWNLOAD_PROTECTED: Role.SOURCEIMAGES_DOWNLOAD_PROTECTED,
  }

  constructor(private state: State) {}

  /**
   * Add a member to an organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.memberships.create('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290', [rokka.memberships.ROLES.WRITE], "An optional comment")
   * ```
   *
   * @param organization - Organization name
   * @param userId - UUID of user to add to the organization
   * @param roles - User roles (`rokka.memberships.ROLES`)
   * @param comment - Optional comment
   * @returns Promise resolving to the membership
   */
  create(
    organization: string,
    userId: string,
    roles: Role | Role[],
    comment?: string | null | undefined,
  ): Promise<RokkaResponse> {
    let rolesArray = roles
    if (typeof roles === 'string') {
      rolesArray = [roles]
    }

    ;(rolesArray as Role[]).forEach(role => {
      if (
        Object.keys(this.ROLES)
          .map(key => this.ROLES[key])
          .indexOf(role) === -1
      ) {
        return Promise.reject(new Error(`Invalid role "${role}"`))
      }
    })

    const path = `organizations/${organization}/memberships/${userId}`

    return this.state.request('PUT', path, { roles: rolesArray, comment })
  }

  /**
   * Delete a member in an organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * await rokka.memberships.delete('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290')
   * ```
   *
   * @param organization - Organization name
   * @param userId - UUID of user to delete from the organization
   * @returns Promise resolving when member is deleted
   */
  delete(organization: string, userId: string): Promise<RokkaResponse> {
    const path = `organizations/${organization}/memberships/${userId}`

    return this.state.request('DELETE', path)
  }

  /**
   * Create a user and membership associated to this organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.memberships.createWithNewUser('myorg', [rokka.memberships.ROLES.READ], "New user for something")
   * ```
   *
   * @param organization - Organization name
   * @param roles - User roles (`rokka.memberships.ROLES`)
   * @param comment - Optional comment
   * @returns Promise resolving to the new user and membership
   */
  createWithNewUser(
    organization: string,
    roles: Role[],
    comment?: string | null | undefined,
  ): Promise<RokkaResponse> {
    roles.forEach(role => {
      if (
        Object.keys(this.ROLES)
          .map(key => this.ROLES[key])
          .indexOf(role) === -1
      ) {
        return Promise.reject(new Error(`Invalid role "${role}"`))
      }
    })

    const path = `organizations/${organization}/memberships`

    return this.state.request('POST', path, { roles: roles, comment })
  }

  /**
   * Lists members in an organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.memberships.list('myorg')
   * ```
   *
   * @param organization - Organization name
   * @returns Promise resolving to the list of members
   */
  list(organization: string): Promise<RokkaResponse> {
    const path = `organizations/${organization}/memberships`

    return this.state.request('GET', path)
  }

  /**
   * Get info of a member in an organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.memberships.get('myorg', userId)
   * ```
   *
   * @param organization - Organization name
   * @param userId - UUID of the user
   * @returns Promise resolving to the member info
   */
  get(organization: string, userId: string): Promise<RokkaResponse> {
    const path = `organizations/${organization}/memberships/${userId}`

    return this.state.request('GET', path)
  }
}

export type Memberships = MembershipsApi

export default (state: State): { memberships: Memberships } => ({
  memberships: new MembershipsApi(state),
})
