const sourceimages = {};

/**
 * ### Source Images
 *
 * @module sourceimages
 */
export default (state) => {
  /**
   * Get a list of source images.
   *
   * ```js
   * rokka.sourceimages.list('myorg')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string} organization  name
   * @param  {number} [limit=null]
   * @param  {number} [offset=null]
   * @return {Promise}
   */
  sourceimages.list = (organization, limit=null, offset=null) => {
    const queryParams = {};

    if(limit !== null) {
      queryParams.limit = limit;
    }
    if(offset !== null) {
      queryParams.offset = offset;
    }

    return state.request('GET', `sourceimages/${organization}`, null, queryParams);
  };

  /**
   * Get information of a source image by hash.
   *
   * ```js
   * rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  hash         image hash
   * @return {Promise}
   */
  sourceimages.get = (organization, hash) => {
    return state.request('GET', `sourceimages/${organization}/${hash}`);
  };

  /**
   * Get information of a source image by its binary hash.
   *
   * ```js
   * rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  binaryHash   binary image hash
   * @return {Promise}
   */
  sourceimages.getWithBinaryHash = (organization, binaryHash) => {
    const queryParams = { binaryHash: binaryHash };

    return state.request('GET', `sourceimages/${organization}`, null, queryParams);
  };

  /**
   * Download image by hash.
   *
   * ```js
   * rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  hash         image hash
   * @return {Promise}
   */
  sourceimages.download = (organization, hash) => {
    return state.request('GET', `sourceimages/${organization}/${hash}/download`);
  };

  /**
   * Upload an image.
   *
   * ```js
   * rokka.sourceimages.create('myorg', require('fs').createReadStream('picture.png'))
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  fileName     file name
   * @param  {mixed}   binaryData   either a readable stream or a binary string
   * @return {Promise}
   */
  sourceimages.create = (organization, fileName, binaryData) => {
    const options = {
      multipart: true,
      payloadSigHack: true
    };

    const payload = {
      name: 'filedata',
      filename: fileName,
      contents: binaryData
    };

    return state.request('POST', `sourceimages/${organization}`, payload, null, options)
      .then(JSON.parse);
  };

  /**
   * Delete image by hash.
   *
   * ```js
   * rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  organization name
   * @param  {string}  hash         image hash
   * @return {Promise}
   */
  sourceimages.delete = (organization, hash) => {
    return state.request('DELETE', `sourceimages/${organization}/${hash}`);
  };

  return {
    sourceimages
  };
};
