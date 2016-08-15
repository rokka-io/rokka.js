import transport from './transport';
import modules from './apis';

const defaults = {
  apiHost: 'https://api.rokka.io',
  renderHost: 'https://{organization}.rokka.io',
  apiVersion: 1
};

/**
 * Initializing the Rokka client.
 *
 * ```js
 * var rokka = require('rokka')({
 *   apiKey: 'apikey',     // required for certain operations
 *   apiHost: '<url>',     // default: https://api.rokka.io
 *   apiVersion: <number>, // default: 1
 *   renderHost: '<url>',  // default: https://{organization}.rokka.io
 *   debug: true           // default: false
 * });
 * ```
 *
 * All properties are optional since certain calls don't require credentials.
 *
 * @param  {Object} [config={}] configuration properties
 * @return {Object}
 *
 * @module rokka
 */
export default (config={}) => {
  if(config.debug !== null) {
    transport.debug = config.debug;
  }

  const state = {
    // config
    apiKey: config.apiKey,
    apiHost: config.apiHost || defaults.apiHost,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    // functions
    request(method, path, payload=null, queryParams=null, options={}) {
      let uri = [state.apiHost, path].join('/');

      const headers = {
        'Api-Version': state.apiVersion
      };

      if(options.noAuthHeaders !== true) {
        if (!state.apiKey) {
          return Promise.reject(new Error('Missing required property `apiKey`'));
        }

        headers['Api-Key'] = state.apiKey;
      }

      const request = {
        method: method,
        uri: uri,
        qs: queryParams,
        headers: headers
      };

      if(options.multipart !== true) {
        request.json = true;
        request.body = payload;
      } else {
        const formData = {};

        formData[payload.name] = {
          value: payload.contents,
          options: {
            filename: payload.filename
          }
        };

        request.formData = formData;
      }

      return transport(request);
    }
  };

  return Object.assign(
    {},
    modules(state)
  );
};
