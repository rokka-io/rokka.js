/**
 * ### Organizations
 *
 * @module organizations
 */
import { Response } from '../response'
import { State } from '../index'

export interface Organizations {
  get(name: string): Promise<Response>
  create(
    name: string,
    billingEmail: string,
    displayName: string
  ): Promise<Response>
}

export default (state: State) => {
  const organizations: Organizations = {
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
    }
  }

  return {
    organizations
  }
}
