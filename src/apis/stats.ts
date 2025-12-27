/**
 * ### Stats
 *
 * @module stats
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export class StatsApi {
  constructor(private state: State) {}

  /**
   * Retrieve statistics about an organization.
   *
   * If `from` and `to` are not specified, the API will return data for the last 30 days.
   *
   * @example
   * ```js
   * const result = await rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
   * ```
   *
   * @param organization - Organization name
   * @param from - Start date in format YYYY-MM-DD
   * @param to - End date in format YYYY-MM-DD
   * @returns Promise resolving to organization statistics
   */
  get(
    organization: string,
    from: string | null = null,
    to: string | null = null,
  ): Promise<RokkaResponse> {
    return this.state.request('GET', `stats/${organization}`, null, {
      from,
      to,
    })
  }
}

export type Stats = StatsApi

export default (state: State): { stats: Stats } => ({
  stats: new StatsApi(state),
})
