import { stringifyOperations } from '../utils'
import { State } from '../index'

export interface Render {
  getUrl(
    organization: string,
    hash: string,
    format: string,
    mixed: string | object
  ): string
}

/**
 * ### Render
 *
 * @module render
 */
export default (state: State) => {
  const render: Render = {
    /**
     * Get URL for rendering an image.
     *
     * ```js
     * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
     * ```
     *
     * @param  {string}       organization name
     * @param  {string}       hash         image hash
     * @param  {string}       format       image format: `jpg`, `png` or `gif`
     * @param  {string|array} [mixed]      optional stack name or an array of stack operation objects
     * @return {string}
     */
    getUrl: (organization, hash, format, mixed) => {
      const host = state.renderHost.replace('{organization}', organization)
      const mixedParam = Array.isArray(mixed)
        ? `dynamic/${stringifyOperations(mixed)}` // array of operations
        : mixed // stack name
      const stack = mixedParam || 'dynamic/noop'

      return `${host}/${stack}/${hash}.${format}`
    }
  }

  return {
    render
  }
}
