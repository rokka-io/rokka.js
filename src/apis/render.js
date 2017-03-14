import { stringifyOperations } from '../utils'

const render = {}

/**
 * ### Render
 *
 * @module render
 */
export default (state) => {
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
  render.getUrl = (organization, hash, format, mixed) => {
    const host = state.renderHost.replace('{organization}', organization)
    const mixedParam = Array.isArray(mixed)
      ? `dynamic/${stringifyOperations(mixed)}` // array of operations
      : mixed // stack name
    const stack = mixedParam || 'dynamic/noop'

    return `${host}/${stack}/${hash}.${format}`
  }

  return {
    render
  }
}
