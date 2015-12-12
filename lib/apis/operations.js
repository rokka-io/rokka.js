const operations = {};

operations.resize = (width, height, absolute=null) => {
  const options = {
    width,
    height
  };

  if(absolute !== null) {
    options.absolute = absolute;
  }

  return {
    name: 'resize',
    options
  };
};

operations.rotate = (angle, backgroundColor=null, backgroundOpacity=null) => {
  const options = {
    angle
  };

  if(backgroundColor !== null) {
    options['background_color'] = backgroundColor;
  }
  if(backgroundOpacity !== null) {
    options['background_opacity'] = backgroundOpacity;
  }

  return {
    name: 'rotate',
    options: options
  };
};

/**
 * ### Operations
 *
 * #### Available operations
 *
 * - `rokka.operations.resize(width, height, [absolute=null])`
 * - `rokka.operations.rotate(angle, [backgroundColor=null], [backgroundOpacity=null])`
 *
 * @module operations
 */
export default (state) => {
  /**
   * Get a list of available stack operations.
   *
   * ```js
   * rokka.operations.list()
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @return {Promise}
   */
  operations.list = () => {
    return state.request('GET', 'operations', null, null, { noAuthHeaders: true });
  };

  return {
    operations
  };
};
