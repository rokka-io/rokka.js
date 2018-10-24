/**
 * ### Stacks
 *
 * @module stacks
 */
export default state => {
  const stacks = {}

  /**
   * Get a list of available stacks.
   *
   * ```js
   * rokka.stacks.list('myorg')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization  name
   * @param  {number}  [limit=null]
   * @param  {number}  [offset=null]
   * @return {Promise}
   */
  stacks.list = (organization, limit = null, offset = null) => {
    const queryParams = {}

    if (limit !== null) {
      queryParams.limit = limit
    }
    if (offset !== null) {
      queryParams.offset = offset
    }

    return state.request('GET', `stacks/${organization}`, null, queryParams)
  }

  /**
   * Get details about a stack.
   *
   * ```js
   * rokka.stacks.get('myorg', 'mystack')
   *   .then(function(result) {})
   *   .catch(function(result) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  name         stack name
   * @return {Promise}
   */
  stacks.get = (organization, name) => {
    return state.request('GET', `stacks/${organization}/${name}`)
  }

  /**
   * Create a new stack.
   *
   * The signature of this method changed in 0.27.
   *
   * Using a single stack operation object (without an enclosing array) as the 3rd parameter (stackConfig) is
   *  since version 0.27.0 not supported anymore.
   *
   * ```js
   * const operations = [
   *   rokka.operations.rotate(45),
   *   rokka.operations.resize(100, 100)
   * ]
   *
   * // stack options are optional
   * const options = {
   *   'jpg.quality': 80,
   *   'webp.quality': 80
   * }
   *
   * // stack expressions are optional
   * const expressions = [
   *   rokka.expressions.default('options.dpr > 2', { 'jpg.quality': 60, 'webp.quality': 60 })
   * ]
   *
   * // query params are optional
   * var queryParams = { overwrite: true }
   * rokka.stacks.create(
   *   'test',
   *   'mystack',
   *   { operations, options, expressions },
   *   queryParams
   * ).then(function(result) {})
   *  .catch(function(err) {})
   * ```
   *
   * @authenticated
   * @param  {string}       organization name
   * @param  {string}       name         stack name
   * @param  {Object}       stackConfig  object with the stack config of stack operations, options and expressions.
   * @param  {{overwrite: bool}} [params={}]  params       query params, only {overwrite: true|false} is currently supported
   * @return {Promise}
   */

  stacks.create = (organization, name, stackConfig, params = {}, ...rest) => {
    const queryParams = Object.assign({}, params)
    let body = {}

    // backwards compatibility for previous signature:
    // create(organization, name, operations, options = null, overwrite = false)
    if (Array.isArray(stackConfig)) {
      body.operations = stackConfig
      body.options = params
      const _overwrite = rest.length > 0 ? rest[0] : false
      if (_overwrite) {
        queryParams.overwrite = _overwrite
      }
    } else {
      body = stackConfig
    }

    return state.request(
      'PUT',
      `stacks/${organization}/${name}`,
      body,
      queryParams
    )
  }

  /**
   * Delete a stack.
   *
   * ```js
   * rokka.stacks.delete('myorg', 'mystack')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  name         stack name
   * @return {Promise}
   */
  stacks.delete = (organization, name) => {
    return state.request('DELETE', `stacks/${organization}/${name}`)
  }

  return {
    stacks
  }
}
