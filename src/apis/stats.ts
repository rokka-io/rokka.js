/**
 * ### Stats
 *
 * @module stats
 */

import { RokkaResponse } from '../response'
import { State } from '../index'

export interface Stats {
  get(
    organization: string,
    from?: string | null,
    to?: string | null,
  ): Promise<RokkaResponse>
}
export default (state: State): { stats: Stats } => {
  const stats: Stats = {
    /**
     * Retrieve statistics about an organization.
     *
     * If `from` and `to` are not specified, the API will return data for the last 30 days.
     *
     * @example
     * ```js
     * rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
     *   .then(function(result) {})
     *   .catch(function(err) {});
     * ```
     *
     * @param organization - Organization name
     * @param from - Start date in format YYYY-MM-DD
     * @param to - End date in format YYYY-MM-DD
     * @returns Promise resolving to organization statistics
     */
    get: (
      organization: string,
      from: string | null = null,
      to: string | null = null,
    ): Promise<any> => {
      return state.request('GET', `stats/${organization}`, null, {
        from,
        to,
      })
    },
  }

  return {
    stats,
  }
}
