# index

## Classes

### Rokka

Rokka SDK client class.

#### Example

```js
import { Rokka } from 'rokka'
const rokka = new Rokka({ apiKey: 'apikey' })
```

#### Implements

- `RokkaApi`

#### Constructors

##### Constructor

```ts
new Rokka(config): Rokka;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`Config`](#config) |

###### Returns

[`Rokka`](#rokka)

#### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="billing"></a> `billing` | `readonly` | [`Billing`](billing.md#billing) |
| <a id="expressions"></a> `expressions` | `readonly` | `Expressions` |
| <a id="memberships"></a> `memberships` | `readonly` | [`Memberships`](apis/memberships.md#memberships) |
| <a id="operations"></a> `operations` | `readonly` | [`Operations`](operations.md#operations) |
| <a id="organizations"></a> `organizations` | `readonly` | [`Organizations`](organizations.md#organizations) |
| <a id="render"></a> `render` | `readonly` | [`Render`](apis/render.md#render) |
| <a id="request"></a> `request` | `readonly` | [`Request`](request.md#request) |
| <a id="sourceimages"></a> `sourceimages` | `readonly` | [`APISourceimages`](apis/sourceimages.md#apisourceimages) |
| <a id="stackoptions"></a> `stackoptions` | `readonly` | [`StackOptions`](stackoptions.md#stackoptions) |
| <a id="stacks"></a> `stacks` | `readonly` | [`Stacks`](stacks.md#stacks) |
| <a id="stats"></a> `stats` | `readonly` | [`Stats`](stats.md#stats) |
| <a id="user"></a> `user` | `readonly` | [`User`](user.md#user) |
| <a id="users"></a> `users` | `readonly` | [`Users`](users.md#users) |
| <a id="utils"></a> `utils` | `readonly` | [`Utils`](utils.md#utils) |

## Interfaces

### Config

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="apihost"></a> `apiHost?` | `string` |
| <a id="apikey"></a> `apiKey?` | `string` |
| <a id="apitokengetcallback"></a> `apiTokenGetCallback?` | [`ApiTokenGetCallback`](user.md#apitokengetcallback) |
| <a id="apitokenoptions"></a> `apiTokenOptions?` | \| [`RequestQueryParamsNewToken`](user.md#requestqueryparamsnewtoken) \| `null` |
| <a id="apitokenrefreshtime"></a> `apiTokenRefreshTime?` | `number` |
| <a id="apitokensetcallback"></a> `apiTokenSetCallback?` | [`ApiTokenSetCallback`](user.md#apitokensetcallback) |
| <a id="apiversion"></a> `apiVersion?` | `string` \| `number` |
| <a id="debug"></a> `debug?` | `boolean` |
| <a id="renderhost"></a> `renderHost?` | `string` |
| <a id="transport"></a> `transport?` | `object` |
| `transport.agent?` | `any` |
| `transport.maxTimeout?` | `number` |
| `transport.minTimeout?` | `number` |
| `transport.randomize?` | `boolean` |
| `transport.requestTimeout?` | `number` |
| `transport.retries?` | `number` |

***

### RequestQueryParams

#### Extended by

- [`RequestQueryParamsNewToken`](user.md#requestqueryparamsnewtoken)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

***

### State

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="apihost-1"></a> `apiHost` | `string` |
| <a id="apikey-1"></a> `apiKey` | `string` \| `undefined` |
| <a id="apitokengetcallback-1"></a> `apiTokenGetCallback?` | [`ApiTokenGetCallback`](user.md#apitokengetcallback) |
| <a id="apitokenoptions-1"></a> `apiTokenOptions?` | \| [`RequestQueryParamsNewToken`](user.md#requestqueryparamsnewtoken) \| `null` |
| <a id="apitokenpayload"></a> `apiTokenPayload` | [`ApiTokenPayload`](user.md#apitokenpayload) \| `null` |
| <a id="apitokenrefreshtime-1"></a> `apiTokenRefreshTime` | `number` |
| <a id="apitokensetcallback-1"></a> `apiTokenSetCallback?` | [`ApiTokenSetCallback`](user.md#apitokensetcallback) |
| <a id="apiversion-1"></a> `apiVersion` | `string` \| `number` |
| <a id="renderhost-1"></a> `renderHost` | `string` |
| <a id="transportoptions"></a> `transportOptions` | `any` |

#### Methods

##### request()

```ts
request(
   method, 
   path, 
   payload?, 
   queryParams?, 
options?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `method` | `string` |
| `path` | `string` |
| `payload?` | `any` |
| `queryParams?` | [`RequestQueryParams`](#requestqueryparams) \| `null` |
| `options?` | `RequestOptions` \| `null` |

###### Returns

`Promise`\<`RokkaResponse`\>

## Variables

### default()

```ts
default: (config) => RokkaApi;
```

Initializing the rokka client using the factory function (backwards compatible).

All properties are optional since certain calls don't require credentials.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`Config`](#config) | Configuration properties |

#### Returns

`RokkaApi`

The rokka client API

#### Example

```js
const rokka = require('rokka')({ apiKey: 'apikey' })
```
