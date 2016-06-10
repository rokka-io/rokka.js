import { stringifyOperations } from '../utils';

const render = {};

export default (state) => {
  /**
   * Get render URL.
   *
   * ```js
   * rokka.organizations.get('myorg')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
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
