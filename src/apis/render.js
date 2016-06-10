import { stringifyOperations } from '../utils';

const render = {};

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
   * rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'mystack', 'png')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @param  {string}       organization name
   * @param  {string}       hash         image hash
   * @param  {string|array} mixed        stack operation name or array of stack operation objects
   * @param  {string}       format       image format: `jpg`, `png` or `gif`
   * @return {string}
   */
  render.getUrl = (organization, hash, mixed, format) => {
    const host = state.renderHost.replace('{organization}', organization);
    const mixedParam = Array.isArray(mixed)
      ? stringifyOperations(mixed) // array of operations
      : mixed; // stack name

    return `${host}/${mixedParam}/${hash}.${format}`;
  };

  return {
    render
  };
};
