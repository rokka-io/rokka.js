import transport from './transport';
import {signature} from './utils';
import modules from './apis';

const defaultConfig = {
  host: 'https://api.rokka.io',
  version: 1
};

export default (config={}) => {
  if(config.debug !== null) {
    transport.debug = config.debug;
  }

  const state = {
    // config
    apiKey: config.apiKey,
    secret: config.secret,
    host: config.host || defaultConfig.host,
    apiVersion: config.version || defaultConfig.version,
    // functions
    request(method, path, payload=null, queryParams=null, options={}) {
      const uri = [state.host, path].join('/');

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

        headers['Api-Key'] = state.apiKey;
        headers['Api-Signature'] = signature(state.secret, uri, payload);
      }

      const request = {
        method: method,
        uri: uri,
        headers: headers,
        qs: queryParams
      };

      if(options.fileUpload !== true) {
        request.json = true;
        request.body = payload;
      } else {
        request.formData = {
          filedata: payload
        }
      }

      return transport(request);
    }
  };

  return Object.assign(
    {},
    modules(state)
  );
};
