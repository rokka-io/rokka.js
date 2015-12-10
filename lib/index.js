import transport from './transport';
import {signature} from './utils';
import modules from './apis';

const defaultConfig = {
  endpoint: 'https://api.rokka.io',
  version: 1
};

export default (config={}) => {
  const state = {
    // config
    apiKey: config.apiKey,
    secret: config.secret,
    apiEndpoint: config.endpoint || defaultConfig.endpoint,
    apiVersion: config.version || defaultConfig.version,
    // functions
    request(method, path, payload, options={}) {
      const uri = [state.apiEndpoint, path].join('/');

      const headers = {
        'Api-Version': state.apiVersion
      };

      if(options.noAuthHeaders !== true) {
        if (!state.apiKey) {
          throw new Error('Missing required property `apiKey`');
        }

        if (!state.secret) {
          throw new Error('Missing required property `secret`');
        }

        headers['Api-Key'] = state.apiKey;
        headers['Api-Signature'] = signature(state.secret, uri, payload);
      }

      return transport({
        uri: uri,
        method: method,
        headers: headers,
        json: true,
        body: payload
      });
    }
  };

  return Object.assign(
    {},
    modules(state)
  );
};
