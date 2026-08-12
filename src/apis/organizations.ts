/**
 * ### Organizations
 *
 * @module organizations
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

export interface SubOrganization {
  /** Websafe name of the organization, as used in urls */
  name: string
  /** UUID of the organization */
  id: string
  display_name: string
  billing_email: string
  created: string | null
  /** Only returned for super admins */
  disabled?: boolean
}

export interface SubOrganizationsResponse extends RokkaResponse {
  body: {
    /** The organization which was asked for */
    organization: string
    /**
     * The master organization of the organization which was asked for,
     * itself if it is a master organization
     */
    master_organization: string
    total: number
    items: SubOrganization[]
  }
}

export interface SubOrganizationsOptions {
  /** Also return disabled sub organizations. Super admins only */
  include_disabled?: boolean
}

export class OrganizationsApi {
  readonly OPTION_PROTECT_DYNAMIC_STACK = 'protect_dynamic_stack'

  constructor(private state: State) {}

  /**
   * Get a list of organizations.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.organizations.get('myorg')
   * ```
   *
   * @param name - Organization name
   * @returns Promise resolving to organization details
   */
  get(name: string): Promise<RokkaResponse> {
    return this.state.request('GET', `organizations/${name}`)
  }

  /**
   * Create an organization.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
   * ```
   *
   * @param name - Organization name
   * @param billingEmail - Email used for billing
   * @param displayName - Pretty name for the organization
   * @returns Promise resolving to the created organization
   */
  create(
    name: string,
    billingEmail: string,
    displayName: string,
  ): Promise<RokkaResponse> {
    return this.state.request('PUT', `organizations/${name}`, {
      billing_email: billingEmail,
      display_name: displayName,
    })
  }

  /**
   * List the sub organizations of a master organization.
   *
   * Sub organizations are the ones whose usage is aggregated onto the master
   * organization's invoice. Needs the `admin` or `admin:read` role on the
   * organization. The list is sorted by name and is not paginated.
   *
   * rokka doesn't support nested master organizations, so asking this on an
   * organization which is itself a sub organization returns an empty list.
   * Use the returned `master_organization` to know which organization to ask
   * instead.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.organizations.listSubOrganizations('mastername')
   * result.body.items.forEach(org => {
   *   console.log(org.name, org.display_name)
   * })
   * ```
   *
   * @since 4.2.0
   * @param organization - Organization name
   * @param options - Optional `{include_disabled: true}` to also return disabled
   *   sub organizations. Super admins only, everyone else gets a 403
   * @returns Promise resolving to the sub organizations
   */
  listSubOrganizations(
    organization: string,
    options: SubOrganizationsOptions = {},
  ): Promise<SubOrganizationsResponse> {
    const queryParams: { include_disabled?: boolean } = {}
    if (options.include_disabled !== undefined) {
      queryParams.include_disabled = options.include_disabled
    }

    return this.state.request(
      'GET',
      `organizations/${organization}/sub_organizations`,
      null,
      queryParams,
    )
  }

  /**
   * Set a single organization option.
   *
   * @remarks
   * Requires authentication.
   *
   * @param organizationName - Organization name
   * @param name - Option name
   * @param value - Option value
   * @returns Promise resolving when option is set
   */
  setOption(
    organizationName: string,
    name: string,
    value: boolean | string,
  ): Promise<RokkaResponse> {
    return this.state.request(
      'PUT',
      `organizations/${organizationName}/options/${name}`,
      value,
    )
  }

  /**
   * Update multiple organization options at once.
   *
   * @remarks
   * Requires authentication.
   *
   * @example
   * ```js
   * const result = await rokka.organizations.setOptions('myorg', {
   *   protect_dynamic_stack: true,
   *   remote_basepath: 'https://example.com'
   * })
   * ```
   *
   * @param organizationName - Organization name
   * @param options - Object with option names as keys and their values
   * @returns Promise resolving when options are updated
   */
  setOptions(
    organizationName: string,
    options: Record<string, boolean | string>,
  ): Promise<RokkaResponse> {
    return this.state.request(
      'PUT',
      `organizations/${organizationName}/options`,
      options,
    )
  }
}

export type Organizations = OrganizationsApi

export default (state: State): { organizations: Organizations } => ({
  organizations: new OrganizationsApi(state),
})
