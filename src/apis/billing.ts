/**
 * ### Billing
 *
 * @module billing
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

export interface Billing {
  get(organization: string, from?: string, to?: string): Promise<RokkaResponse>
}

export default (state: State) => {
  const billing: Billing = {
    /**
     * Retrieve statistics about the billing of an organization
     *
     * If `from` and `to` are not specified, the API will return data for the last 30 days.
     *
     * ```js
     * rokka.billing.get('myorg', '2017-01-01', '2017-01-31')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param {string} organization name
     * @param {string} [from=null]  date in format YYYY-MM-DD
     * @param {string} [to=null]    date in format YYYY-MM-DD
     *
     * @return {Promise}
     */
    get: (
      organization,
      from = undefined,
      to = undefined
    ): Promise<RokkaResponse> => {
      return state.request('GET', `billing/${organization}`, null, {
        from,
        to
      })
    }
  }

  return {
    billing
  }
}
