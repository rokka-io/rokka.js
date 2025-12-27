# Variable: default()

```ts
default: (config) => RokkaApi;
```

Initializing the rokka client using the factory function (backwards compatible).

All properties are optional since certain calls don't require credentials.

## Parameters

### config

[`Config`](index.Interface.Config.md) = `{}`

Configuration properties

## Returns

`RokkaApi`

The rokka client API

## Example

```js
const rokka = require('rokka')({ apiKey: 'apikey' })
```
