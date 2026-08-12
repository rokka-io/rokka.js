/**
 * ### User
 *
 * #### Authentication errors
 *
 * Besides a plain 401, requests can fail with a 401 and one of these `error`
 * codes in the body (together with `invalid_authentication: true`):
 *
 * - `key_expired` - the API key's `expires` date has passed
 * - `ip_not_allowed` - the request's IP is not in the key's `allowed_ips`
 * - `mfa_required` - an MFA key was used for something other than a token exchange
 * - `mfa_enrollment_required` - an MFA key was used, but TOTP isn't set up yet
 * - `totp_invalid` - the TOTP code was wrong or already used
 *
 * `allowed_ips` and `expires` are enforced retroactively, they also apply to
 * JWT tokens which were minted from that key before the restriction was set.
 *
 * @module user
 */

import { RokkaResponse } from '../response'
import { RequestQueryParams, State } from '../index'
import { _getTokenPayload, _isTokenExpiring, _tokenValidFor } from '../utils'

export interface UserApiKey {
  id: string
  accessed?: string
  created?: string
  comment?: string
  api_key?: string
  requires_mfa?: boolean
  totp_state?: MfaTotpState
  /**
   * The key can only be used from these IPs / IPv4 CIDR ranges. A request from
   * anywhere else fails with a 401 and `error: 'ip_not_allowed'`.
   */
  allowed_ips?: string[]
  /**
   * The key stops working after this date. Requests with an expired key fail
   * with a 401 and `error: 'key_expired'`.
   */
  expires?: string | null
}

/**
 * Options for creating an API key.
 *
 * `allowed_ips` and `expires` can't be `null` here, there's no restriction to
 * clear on a brand new key and the API rejects an explicit null with a 400.
 */
export interface UserApiKeyOptions {
  requires_mfa?: boolean
  allowed_ips?: string[]
  expires?: string | Date
}

/**
 * Options for updating an API key. At least one of them has to be given.
 *
 * `allowed_ips: null` (or `[]`) clears the whitelist, `expires: null` clears
 * the expiration date.
 */
export interface UserApiKeyPatchOptions {
  requires_mfa?: boolean
  allowed_ips?: string[] | null
  expires?: string | Date | null
}

export interface UserApiKeyPatchQueryParams {
  /**
   * Allow a change which would lock the key you're currently authenticating
   * with out of your own IP (or set an expiration date in the past).
   */
  force?: boolean
}

export type MfaTotpState = 'none' | 'pending' | 'active'

export interface MfaTotpStatus {
  state: MfaTotpState
  confirmed?: string | null
}

export interface MfaTotpStatusResponse extends RokkaResponse {
  body: MfaTotpStatus
}

export interface MfaTotpSetup {
  secret: string
  provisioning_uri: string
  state: MfaTotpState
}

export interface MfaTotpSetupResponse extends RokkaResponse {
  body: MfaTotpSetup
}

export interface UserApiKeyResponse extends RokkaResponse {
  body: UserApiKey
}

export type ApiToken = string | null

export interface UserKeyTokenBody extends RokkaResponse {
  token: ApiToken
  payload: ApiTokenPayload
}

export interface ApiTokenPayload {
  [key: string]: string[] | string | number | undefined | null | boolean
  exp: number
  ip?: string
  expt?: number
  nr?: boolean
  ips?: string[]
  rn?: boolean
}

export type ApiTokenGetCallback = (() => ApiToken) | null | undefined
export type ApiTokenSetCallback =
  | ((token: ApiToken, payload?: ApiTokenPayload | null) => void)
  | null

export interface UserKeyTokenResponse extends RokkaResponse {
  body: UserKeyTokenBody
}

export interface UserApiKeyListResponse extends RokkaResponse {
  body: UserApiKey[]
}

export interface UserResponse extends RokkaResponse {
  body: { user_id: string; email?: string; api_keys: UserApiKey[] }
}

export interface UserMembership {
  /** Websafe name of the organization, as used in urls */
  organization: string
  /** UUID of the organization */
  organization_id: string
  display_name: string
  /** The roles the user has in this organization, see `rokka.memberships.ROLES` */
  roles: string[]
  active: boolean
  /** Date of the last access, only updated once within 24 hours */
  last_access: string | null
  created: string | null
  comment: string | null
}

export interface UserMembershipsResponse extends RokkaResponse {
  body: { total: number; items: UserMembership[] }
}

/**
 * One organization/member pair with that member's API key metadata.
 *
 * Called `OrganizationApiKeys` in the rokka API schema, renamed here since
 * the keys belong to a member, not to the organization.
 */
export interface OrganizationMemberApiKeys {
  /** Websafe name of the organization, as used in urls */
  organization: string
  /** UUID of the organization */
  organization_id: string
  display_name: string
  /** UUID of the member */
  user_id: string
  email: string
  roles: string[]
  active: boolean
  last_access: string | null
  created: string | null
  comment: string | null
  /**
   * Metadata of the member's API keys. Never contains `api_key`, key values
   * are stored one way hashed and can't be recovered.
   */
  api_keys: UserApiKey[]
}

export interface AdminApiKeysResponse extends RokkaResponse {
  body: {
    total: number
    /**
     * The result was cut off, because the current user has more than 1000
     * memberships or is a member of more than 50 organizations. There is no
     * pagination or cursor to get the rest.
     */
    truncated: boolean
    items: OrganizationMemberApiKeys[]
  }
}

export interface RequestQueryParamsNewToken extends RequestQueryParams {
  renewable?: boolean
  no_ip_protection?: boolean
  ips?: string
  expires_in?: number
  /**
   * The current TOTP (MFA) code, needed when the used API key has `requires_mfa` set.
   *
   * This is a one-shot parameter for a single `getNewToken` call — never put it
   * into `apiTokenOptions`, codes are only valid for a short time and single-use
   * (and are stripped from `apiTokenOptions` defensively on token renewals).
   * It is sent in the JSON request body, never in the URL/query string.
   */
  totp?: string
}

export class UserApi {
  constructor(private state: State) {}

  /**
   * Get user_id for current user
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.users.getId()
   * ```
   *
   * @since 3.3.0
   * @returns Promise resolving to the user ID
   */
  getId(): Promise<string> {
    return this.state.request('GET', 'user').then(result => result.body.user_id)
  }

  /**
   * Get user object for current user
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.get()
   * ```
   *
   * @since 3.3.0
   * @returns Promise resolving to the user object
   */
  get(): Promise<UserResponse> {
    return this.state.request('GET', 'user')
  }

  /**
   * List the organizations the current user is a member of
   *
   * Returns one entry per organization, together with the roles the user has
   * in it. Read-only and public API keys can't use this and get a 403.
   *
   * There's no pagination, the API caps the result at 1000 memberships.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.listMemberships()
   * result.body.items.forEach(membership => {
   *   console.log(membership.organization, membership.roles)
   * })
   * ```
   *
   * @since 4.2.0
   * @returns Promise resolving to the organizations the current user is a member of
   */
  listMemberships(): Promise<UserMembershipsResponse> {
    return this.state.request('GET', 'user/memberships')
  }

  /**
   * List Api Keys of the current user
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.listApiKeys()
   * ```
   *
   * @since 3.3.0
   * @returns Promise resolving to the list of API keys
   */
  listApiKeys(): Promise<UserApiKeyListResponse> {
    return this.state.request('GET', 'user/apikeys')
  }

  /**
   * Add Api Key to the current user
   *
   * The response only contains the options you actually supplied, next to
   * `id`, `api_key` and `comment`. This is the only place where the key value
   * itself is returned, it can't be retrieved later on.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.addApiKey('some comment')
   * ```
   *
   * @example A key which only works from some IPs and expires
   * ```js
   * const result = await rokka.user.addApiKey('ci key', {
   *   allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
   *   expires: '2027-01-01T00:00:00+00:00'
   * })
   * ```
   *
   * @since 3.3.0
   * @param comment - Optional comment for the API key
   * @param options - Optional API key options: `requires_mfa`, `allowed_ips`
   *   (max 10 IPs or IPv4 CIDR ranges) and `expires` (must be in the future),
   *   all since 4.2.0
   * @returns Promise resolving to the created API key
   */
  addApiKey(
    comment: string | null = null,
    options: UserApiKeyOptions = {},
  ): Promise<UserApiKeyResponse> {
    return this.state.request('POST', 'user/apikeys', { comment, ...options })
  }

  /**
   * Update an Api Key of the current user
   *
   * You can change the `requires_mfa` flag, the `allowed_ips` whitelist and
   * the `expires` date. At least one of them has to be given, otherwise this
   * rejects before doing a request. `allowed_ips: null` (or `[]`) clears the
   * whitelist, `expires: null` clears the expiration date.
   *
   * A key with `requires_mfa` can't be used directly anymore, it can only be
   * exchanged for a JWT token together with a valid TOTP (MFA) code, see
   * {@link getNewToken} and its `totp` parameter.
   *
   * `allowed_ips` and `expires` are enforced retroactively, so restricting the
   * very key you're authenticating this call with is refused with a 400 when
   * it would lock you out right now. Pass `{force: true}` to override that,
   * for example when setting up a key for a server on a different IP.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.patchApiKey(id, { requires_mfa: true })
   * ```
   *
   * @example Restrict a key to some IPs, from another IP
   * ```js
   * const result = await rokka.user.patchApiKey(
   *   id,
   *   { allowed_ips: ['192.168.0.5'], expires: '2027-01-01T00:00:00+00:00' },
   *   { force: true }
   * )
   * ```
   *
   * @example Remove both restrictions again
   * ```js
   * await rokka.user.patchApiKey(id, { allowed_ips: null, expires: null })
   * ```
   *
   * @since 4.2.0
   * @param id - The ID of the API key to update
   * @param options - The API key options to change, at least one of
   *   `requires_mfa`, `allowed_ips` or `expires`
   * @param queryParams - Optional `{force: true}` to override the self lockout guard
   * @returns Promise resolving to the updated API key info (always contains
   *   `id`, `comment`, `requires_mfa`, `totp_state`, `allowed_ips` and `expires`)
   */
  patchApiKey(
    id: string,
    options: UserApiKeyPatchOptions,
    queryParams: UserApiKeyPatchQueryParams = {},
  ): Promise<UserApiKeyResponse> {
    const given = (['requires_mfa', 'allowed_ips', 'expires'] as const).filter(
      key => options && options[key] !== undefined,
    )
    if (given.length === 0) {
      return Promise.reject(
        new Error(
          'Provide at least one of requires_mfa, allowed_ips or expires in the JSON body',
        ),
      )
    }

    return this.state.request(
      'PATCH',
      `user/apikeys/${id}`,
      options,
      queryParams.force === true ? { force: true } : {},
    )
  }

  /**
   * Delete Api Key from the current user
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * await rokka.user.deleteApiKey(id)
   * ```
   *
   * @since 3.3.0
   * @param id - The ID of the API key to delete
   * @returns Promise resolving when key is deleted
   */
  deleteApiKey(id: string): Promise<RokkaResponse> {
    return this.state.request('DELETE', `user/apikeys/${id}`)
  }

  /**
   * Get currently used Api Key
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.getCurrentApiKey()
   * ```
   *
   * @since 3.3.0
   * @returns Promise resolving to the current API key
   */
  getCurrentApiKey(): Promise<UserApiKeyResponse> {
    return this.state.request('GET', 'user/apikeys/current')
  }

  /**
   * List the members and their Api Key metadata of all organizations you administrate
   *
   * Returns one entry per organization and member, for every organization
   * where the current user has the `admin:read` role (`admin` implicitly has
   * it too). Only the key metadata is returned, never the key values or the
   * organization's signing keys.
   *
   * A `truncated: true` in the response means the result was cut off, because
   * the current user has more than 1000 memberships or is a member of more
   * than 50 organizations. There is no pagination or cursor to get the rest.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.listAdminApiKeys()
   * result.body.items.forEach(member => {
   *   console.log(member.organization, member.email, member.api_keys.length)
   * })
   * ```
   *
   * @since 4.2.0
   * @returns Promise resolving to the members and their API key metadata
   */
  listAdminApiKeys(): Promise<AdminApiKeysResponse> {
    return this.state.request('GET', 'user/admin/apikeys')
  }

  /**
   * Gets a new JWT token from the API.
   *
   * You either provide an API Key or there's a valid JWT token registered to get a new JWT token.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.getNewToken(apiKey, {expires_in: 48 * 3600, renewable: true})
   * ```
   *
   * @since 3.7.0
   * @param apiKey - If you don't have a valid JWT token, we need an API key to retrieve a new one
   * @param queryParams - The query parameters used for generating a new JWT token.
   *   If the API key has `requires_mfa` set, pass the current TOTP code as `totp` (since 4.2.0)
   * @returns Promise resolving to the new token
   */
  getNewToken(
    apiKey?: string,
    queryParams: RequestQueryParamsNewToken | null = {},
  ): Promise<UserKeyTokenResponse> {
    if (apiKey) {
      this.state.apiKey = apiKey
    }
    if (!queryParams) {
      queryParams = {}
    }
    // The totp is sent in the JSON body (POST), never in the URL/query, so a
    // single-use code can't end up in an access log. Everything else
    // (expires_in, renewable, ips) stays in the query string.
    const { totp, ...restParams } = queryParams
    // never let a (stale, single-use) totp from apiTokenOptions leak into
    // token renewals either
    const apiTokenOptions = { ...this.state.apiTokenOptions }
    delete apiTokenOptions.totp
    const payload = totp ? { totp } : undefined
    return this.state
      .request(
        'POST',
        'user/apikeys/token',
        payload,
        { ...apiTokenOptions, ...restParams },
        {
          // a totp exchange is by definition an Api-Key -> token mint, don't
          // let a leftover valid token burn the single-use code via Bearer auth
          forceUseApiKey:
            (!!apiKey && this.getTokenIsValidFor() < 10) ||
            (!!apiKey && !!totp),
          noTokenRefresh: true,
        },
      )
      .then(response => {
        this.setToken(response.body.token)
        return response
      })
  }

  /**
   * Get the TOTP (MFA) state of the current user
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.getMfaTotp()
   * console.log(result.body.state) // 'none' | 'pending' | 'active'
   * ```
   *
   * @since 4.2.0
   * @returns Promise resolving to the TOTP state
   */
  getMfaTotp(): Promise<MfaTotpStatusResponse> {
    return this.state.request('GET', 'user/mfa/totp')
  }

  /**
   * Start the TOTP (MFA) setup for the current user
   *
   * Returns the secret and an `otpauth://` provisioning URI (for QR codes).
   * The setup only becomes active once a first valid code is sent to
   * {@link confirmMfaTotp}. Calling this again replaces an unconfirmed secret,
   * it fails with a 409 when TOTP is already active.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.setupMfaTotp()
   * console.log(result.body.secret, result.body.provisioning_uri)
   * ```
   *
   * @since 4.2.0
   * @returns Promise resolving to the new (unconfirmed) TOTP secret and provisioning URI
   */
  setupMfaTotp(): Promise<MfaTotpSetupResponse> {
    return this.state.request('POST', 'user/mfa/totp')
  }

  /**
   * Confirm the TOTP (MFA) setup with a first valid code, activating it
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.user.confirmMfaTotp('123456')
   * ```
   *
   * @since 4.2.0
   * @param totp - The current TOTP code from the authenticator app
   * @returns Promise resolving to the TOTP state
   */
  confirmMfaTotp(totp: string): Promise<MfaTotpStatusResponse> {
    return this.state.request('POST', 'user/mfa/totp/confirm', { totp })
  }

  /**
   * Disable TOTP (MFA) for the current user
   *
   * Needs a valid current TOTP code. Also removes the `requires_mfa` flag
   * from all API keys of the user.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * await rokka.user.disableMfaTotp('123456')
   * ```
   *
   * @since 4.2.0
   * @param totp - The current TOTP code from the authenticator app
   * @returns Promise resolving when TOTP is disabled (204)
   */
  disableMfaTotp(totp: string): Promise<RokkaResponse> {
    return this.state.request('DELETE', 'user/mfa/totp', { totp })
  }

  /**
   * Gets the currently registered JWT Token from the `apiTokenGetCallback` config function or null
   *
   * @since 3.7.0
   * @returns The JWT token or null
   */
  getToken(): ApiToken {
    return this.state.apiTokenGetCallback
      ? this.state.apiTokenGetCallback()
      : null
  }

  /**
   * Sets a new JWT token with the `apiTokenSetCallback` function
   *
   * @since 3.7.0
   * @param token - The JWT token to set
   */
  setToken(token: ApiToken): void {
    if (this.state.apiTokenSetCallback) {
      this.state.apiTokenPayload = _getTokenPayload(token)
      this.state.apiTokenSetCallback(token, this.state.apiTokenPayload)
    }
  }

  /**
   * Check if the registered JWT token is expiring within these amount of seconds (default: 3600)
   *
   * @since 3.7.0
   * @param withinNextSeconds - Does it expire in these seconds (default: 3600)
   * @returns True if token is expiring within the specified time
   */
  isTokenExpiring(withinNextSeconds = 3600): boolean {
    return _isTokenExpiring(
      this.state.apiTokenPayload?.exp,
      this.state.apiTokenGetCallback,
      withinNextSeconds,
    )
  }

  /**
   * How long a token is still valid for (just checking for expiration time)
   *
   * @since 3.7.0
   * @returns The amount of seconds it's still valid for, -1 if it doesn't exist
   */
  getTokenIsValidFor(): number {
    return _tokenValidFor(
      this.state.apiTokenPayload?.exp,
      this.state.apiTokenGetCallback,
    )
  }
}

export type User = UserApi

export default (state: State): { user: User } => ({
  user: new UserApi(state),
})
