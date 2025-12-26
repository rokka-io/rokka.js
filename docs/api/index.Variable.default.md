# Variable: default()

```ts
default: (config) => RokkaApi;
```

Initializing the rokka client.

All properties are optional since certain calls don't require credentials.

## Parameters

### config

[`Config`](index.Interface.Config.md) = `{}`

Configuration properties

## Returns

`RokkaApi`

The rokka client API

## Examples

```js
const rokka = require('rokka')({
  apiKey: 'apikey',                  // required for certain operations
  apiTokenGetCallback?: <() => string> // return JWT token instead of API Key
  apiTokenSetCallback?: <((token: string, payload?: object|null) => void)> // Stores a newly retrieved JWT token
  apiTokenOptions?: <object>         // The rokka.user.getNewToken query parameter options, default: {}
  apiTokenRefreshTime?: <number>     // how many seconds before the token is expiring, it should be refreshed, default: 3600
  apiHost: '<url>',                  // default: https://api.rokka.io
  apiVersion: <number>,              // default: 1
  renderHost: '<url>',               // default: https://{organization}.rokka.io
  debug: true,                       // default: false
  transport: {
    requestTimeout: <number>,  // milliseconds to wait for rokka server response (default: 30000)
    retries: <number>,         // number of retries when API response is 429 (default: 10)
    minTimeout: <number>,      // minimum milliseconds between retries (default: 1000)
    maxTimeout: <number>,      // maximum milliseconds between retries (default: 10000)
    randomize: <boolean>       // randomize time between retries (default: true)
    agent?: <any>               // an agent to be used with node-fetch, eg. if you need a proxy (default: undefined)
  }
});
```

```js
import { HttpsProxyAgent } from 'https-proxy-agent'

const rokka = require('rokka')({
 apiKey: 'apikey'
 transport: {agent: new HttpsProxyAgent(proxy)}
});
```
