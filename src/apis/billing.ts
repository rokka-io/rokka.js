/**
 * ### Billing
 *
 * @module billing
 */
import { RokkaResponse } from '../response'
import { State } from '../index'

export class BillingApi {
  constructor(private state: State) {}

  /**
   * Retrieve statistics about the billing of an organization
   *
   * If `from` and `to` are not specified, the API will return data for the last 30 days.
   *
   * @example
   * ```js
   * const result = await rokka.billing.get('myorg', '2017-01-01', '2017-01-31')
   * ```
   *
   * @param organization - Organization name
   * @param from - Start date in format YYYY-MM-DD
   * @param to - End date in format YYYY-MM-DD
   * @returns Promise resolving to billing statistics
   */
  get(
    organization: string,
    from?: string,
    to?: string,
  ): Promise<RokkaResponse> {
    return this.state.request('GET', `billing/${organization}`, null, {
      from,
      to,
    })
  }
}

export type Billing = BillingApi

export default (state: State): { billing: Billing } => ({
  billing: new BillingApi(state),
})
