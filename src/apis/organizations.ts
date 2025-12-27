/**
 * ### Organizations
 *
 * @module organizations
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

export interface Organizations {
  OPTION_PROTECT_DYNAMIC_STACK: string
  get(name: string): Promise<RokkaResponse>

  create(
    name: string,
    billingEmail: string,
    displayName: string,
  ): Promise<RokkaResponse>

  setOption(
    organizationName: string,
    name: string,
    value: boolean | string,
  ): Promise<RokkaResponse>

  setOptions(
    organizationName: string,
    options: Record<string, boolean | string>,
  ): Promise<RokkaResponse>
}

export default (state: State): { organizations: Organizations } => {
  const organizations: Organizations = {
    OPTION_PROTECT_DYNAMIC_STACK: 'protect_dynamic_stack',
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
    get: name => {
      return state.request('GET', `organizations/${name}`)
    },

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
    create: (name, billingEmail, displayName) => {
      return state.request('PUT', `organizations/${name}`, {
        billing_email: billingEmail,
        display_name: displayName,
      })
    },

    setOption: (organizationName, name, value) => {
      return state.request(
        'PUT',
        `organizations/${organizationName}/options/${name}`,
        value,
      )
    },

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
    setOptions: (
      organizationName: string,
      options: Record<string, boolean | string>,
    ) => {
      return state.request(
        'PUT',
        `organizations/${organizationName}/options`,
        options,
      )
    },
  }

  return {
    organizations,
  }
}
