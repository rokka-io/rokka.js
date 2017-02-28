const stacks = {};

/**
 * ### Stacks
 *
 * @module stacks
 */
export default (state) => {
  /**
   * Get a list of available stacks.
   *
   * ```js
   * rokka.stacks.list('myorg')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization  name
   * @param  {number}  [limit=null]
   * @param  {number}  [offset=null]
   * @return {Promise}
   */
  stacks.list = (organization, limit=null, offset=null) => {
    const queryParams = {};

    if(limit !== null) {
      queryParams.limit = limit;
    }
    if(offset !== null) {
      queryParams.offset = offset;
    }

    return state.request('GET', `stacks/${organization}`, null, queryParams);
  };

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
    return state.request('GET', `stacks/${organization}/${name}`);
  };

  /**
   * Create a new stack.
   *
   * ```js
   * var operations = [
   *   rokka.operations.rotate(45),
   *   rokka.operations.resize(100, 100)
   * ];
   *
   * rokka.stacks.create('myorg', 'mystack', operations)
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  name         stack name
   * @param  {mixed}   operations   array or single stack operation object
   * @return {Promise}
   */
  stacks.create = (organization, name, operations) => {
    operations = Array.isArray(operations) ? operations : [operations];

    return state.request('PUT', `stacks/${organization}/${name}`, operations);
  };

  /**
   * Delete a stack.
   *
   * ```js
   * rokka.stacks.delete('myorg', 'mystack')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  name         stack name
   * @return {Promise}
   */
  stacks.delete = (organization, name) => {
    return state.request('DELETE', `stacks/${organization}/${name}`);
  };

  return {
    stacks
  };
};
