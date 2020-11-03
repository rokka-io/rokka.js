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
    displayName: string
  ): Promise<RokkaResponse>

  setOption(organizationName:string, name:string, value:boolean|string): Promise<RokkaResponse>
}

export default (state: State) => {
  const organizations: Organizations = {
    OPTION_PROTECT_DYNAMIC_STACK: 'protect_dynamic_stack',
    /**
     * Get a list of organizations.
     *
     * ```js
     * rokka.organizations.get('myorg')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  name organization
     * @return {Promise}
     */
    get: name => {
      return state.request('GET', `organizations/${name}`)
    },

    /**
     * Create an organization.
     *
     * ```js
     * rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @authenticated
     * @param  {string}  name         organization
     * @param  {string}  billingEmail email used for billing
     * @param  {string}  displayName  pretty name
     * @return {Promise}
     */
    create: (name, billingEmail, displayName) => {
      return state.request('PUT', `organizations/${name}`, {
        billing_email: billingEmail,
        display_name: displayName
      })
    },

    setOption: (organizationName, name, value) => {
      return state.request('PUT', `organizations/${organizationName}/options/${name}`, value)
    }

  }

  return {
    organizations
  }
}
