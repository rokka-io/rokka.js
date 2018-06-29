
/**
 * ### Stack options
 *
 * @module stackoptions
 */
export default (state) => {
  const stackoptions = {}

  /**
   * Returns a json-schema like definition of options which can be set on a stack.
   *
   * ```js
   * rokka.stackoptions.get()
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @return {Promise}
   */
  stackoptions.get = () => {
    return state.request('GET', 'stackoptions', null, null, { noAuthHeaders: true })
  }

  return {
    stackoptions
  }
}
