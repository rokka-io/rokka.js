import { isStream } from '../utils';

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
   * const file = require('fs').createReadStream('picture.png');
   * rokka.sourceimages.create('myorg', 'picture.png', file)
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string} organization name
   * @param  {string} fileName     file name
   * @param  {*}      binaryData   either a readable stream (in node.js only) or a binary string
   * @return {Promise}
   */
  sourceimages.create = (organization, fileName, binaryData) => {
    const options = {
      multipart: true
    };

    return new Promise((resolve) => {
      /*!
       * Stream and Buffer are only supported by node.js and not browsers natively
       * We just asume that a browser based solution will provide the binaryData
       * of the image as String. But patches are welcome for stream alternatives
       * in browsers
       */
      if (isStream(binaryData)) {
        const chunks = [];
        binaryData.on('data', chunk => chunks.push(chunk));
        binaryData.on('end', () => resolve(Buffer.concat(chunks)));
      } else if (typeof window !== 'undefined') {
        const fileReader = new window.FileReader();
        fileReader.onload = function(e) {
          resolve(e.target.result);
        };

        fileReader.readAsArrayBuffer(binaryData);
      } else {
        resolve(binaryData);
      }
    })
    .then((data) => {
      const payload = {
        name: 'filedata',
        filename: fileName,
        contents: data
      };
      return state.request('POST', `sourceimages/${organization}`, payload, null, options)
        .then(JSON.parse);
    });
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
