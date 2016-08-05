import transport from './transport';
import { signature } from './utils';
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
 *   secret: 'secrect',    // required for certain operations
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
    secret: config.secret,
    apiHost: config.apiHost || defaults.apiHost,
    apiVersion: config.apiVersion || defaults.apiVersion,
    renderHost: config.renderHost || defaults.renderHost,
    // functions
    request(method, path, payload=null, queryParams=null, options={}) {
      let uri = [state.apiHost, path].join('/');

      if (Object.keys(queryParams || {}).length > 0) {
        uri += '?' + Object.keys(queryParams).map((k) =>
          k + '=' + encodeURIComponent(queryParams[k])
        ).join('&');
      }

      const headers = {
        'Api-Version': state.apiVersion
      };

      if(options.noAuthHeaders !== true) {
        if (!state.apiKey) {
          return Promise.reject(new Error('Missing required property `apiKey`'));
        }

        if (!state.secret) {
          return Promise.reject(new Error('Missing required property `secret`'));
        }

        headers['Api-Signature'] = signature(state.secret, uri, payload, options.payloadSigHack);
        headers['Api-Key'] = state.apiKey;
      }

      const request = {
        method: method,
        uri: uri,
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
