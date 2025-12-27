import { State } from '../index'
import { APISourceimagesAlias } from './sourceimages'
import { RokkaResponse } from '../response'

/**
 * ### Source Images alias
 *
 * @module sourceimages.alias
 */
export default (state: State): APISourceimagesAlias => {
  return {
    /**
     * ### Source Images alias
     *
     * See [the usource image alias documentation](https://rokka.io/documentation/references/source-images-aliases.html)
     * for more information.
     */

    /**
     * Adds an alias to a source image.
     *
     * See [the source image alias documentation](https://rokka.io/documentation/references/source-images-aliases.html)
     * for an explanation.
     *
     * ```js
     * const result = await rokka.sourceimages.alias.create('myorg', 'myalias', {
     *   hash: 'somehash',
     * })
     * ```
     *
     * @authenticated
     * @param {string} organization name
     * @param {string} alias        alias name
     * @param {object} data         object with "hash" key
     * @param  {{overwrite: bool}} [params={}]  params       query params, only {overwrite: true|false} is currently supported
     * @return {Promise}
     */
    create: (
      organization: string,
      alias: string,
      data: { hash: string },
      params: { overwrite?: boolean } = {},
    ): Promise<RokkaResponse> => {
      const queryParams = Object.assign({}, params)

      return state.request(
        'PUT',
        `sourceimages/${organization}/alias/${alias}`,
        data,
        queryParams,
      )
    },

    /**
     * Get an alias.
     * @param organization
     * @param alias
     */
    get(organization: string, alias: string): Promise<RokkaResponse> {
      return state.request('GET', `sourceimages/${organization}/alias/${alias}`)
    },

    /**
     * Delete an alias.
     *
     * @param organization
     * @param alias
     */
    delete(organization: string, alias: string): Promise<RokkaResponse> {
      return state.request(
        'DELETE',
        `sourceimages/${organization}/alias/${alias}`,
      )
    },
    /**
     * Invalidate the CDN cache for an alias.
     *
     * @param organization
     * @param alias
     */
    invalidateCache(
      organization: string,
      alias: string,
    ): Promise<RokkaResponse> {
      return state.request(
        'DELETE',
        `sourceimages/${organization}/alias/${alias}/cache`,
      )
    },
  }
}
