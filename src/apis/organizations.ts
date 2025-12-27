/**
 * ### Organizations
 *
 * @module organizations
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

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
