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
 * - `rokka.memberships.ROLES.ADMIN_READ` - read-only administrative access: everything
 *   `READ` grants, plus the organization's memberships, users and API key metadata,
 *   but no write access. `ADMIN` implicitly has it, `WRITE` does not
 * - `rokka.memberships.ROLES.SOURCEIMAGE_READ` - read-only access to source images
 * - `rokka.memberships.ROLES.SOURCEIMAGE_WRITE` - read-write access to source images
 * - `rokka.memberships.ROLES.SOURCEIMAGE_UNLOCK` - may unlock locked source images
 * - `rokka.memberships.ROLES.SOURCEIMAGES_DOWNLOAD_PROTECTED` - may download protected source images
 * - `rokka.memberships.ROLES.BILLING_READ` - read-only access to billing statistics
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
  BILLING_READ = 'billing:read',
  ADMIN_READ = 'admin:read',
}

/**
 * Properties for the initial API key of a user created with
 * {@link MembershipsApi.createWithNewUser}.
 *
 * Same options as {@link user.UserApiKeyOptions}, plus a `comment` for the key
 * itself (the `comment` argument of `createWithNewUser` is the membership's
 * comment, not the key's).
 *
 * `requires_mfa` on a read-only membership (`read` / `upload` /
 * `sourceimages:read`) needs `trusted: true` as well, otherwise the new user
 * can't reach the TOTP enrollment endpoints and the key would be unusable. The
 * API answers with a 400 in that case.
 *
 * @since 4.3.0
 */
export interface MembershipApiKeyOptions {
  /** A comment for the key itself */
  comment?: string
  /**
   * The key may manage this user's API keys even when the user only holds a
   * read-only role. Grants no organization permissions. Never hand such a key
   * to end users.
   */
  trusted?: boolean
  requires_mfa?: boolean
  /** Max 10 IPs or IPv4 CIDR ranges */
  allowed_ips?: string[]
  /** Must be in the future */
  expires?: string | Date
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
    BILLING_READ: Role
    ADMIN_READ: Role
  } = {
    READ: Role.READ,
    WRITE: Role.WRITE,
    UPLOAD: Role.UPLOAD,
    ADMIN: Role.ADMIN,
    SOURCEIMAGE_READ: Role.SOURCEIMAGE_READ,
    SOURCEIMAGE_WRITE: Role.SOURCEIMAGE_WRITE,
    SOURCEIMAGE_UNLOCK: Role.SOURCEIMAGE_UNLOCK,
    SOURCEIMAGES_DOWNLOAD_PROTECTED: Role.SOURCEIMAGES_DOWNLOAD_PROTECTED,
    BILLING_READ: Role.BILLING_READ,
    ADMIN_READ: Role.ADMIN_READ,
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
   * @example A read-only user which can still rotate its own keys
   * ```js
   * const result = await rokka.memberships.createWithNewUser(
   *   'myorg',
   *   [rokka.memberships.ROLES.READ],
   *   'CI user',
   *   { comment: 'initial key', trusted: true }
   * )
   * ```
   *
   * @param organization - Organization name
   * @param roles - User roles (`rokka.memberships.ROLES`)
   * @param comment - Optional comment
   * @param apiKey - Optional properties for the initial API key of the new user
   *   (`comment`, `trusted`, `requires_mfa`, `allowed_ips`, `expires`). This is
   *   the only place `trusted` can be set on a user which is already read-only,
   *   its own key endpoints answer 403 from then on. Since 4.3.0
   * @returns Promise resolving to the new user and membership
   */
  createWithNewUser(
    organization: string,
    roles: Role[],
    comment?: string | null | undefined,
    apiKey?: MembershipApiKeyOptions,
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

    const payload: {
      roles: Role[]
      comment?: string | null
      api_key?: MembershipApiKeyOptions
    } = { roles: roles, comment }
    // only send api_key when there's something to say: the API rejects an
    // explicit null (or any non-object) with a 400
    if (apiKey !== undefined && apiKey !== null) {
      payload.api_key = apiKey
    }

    return this.state.request('POST', path, payload)
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
