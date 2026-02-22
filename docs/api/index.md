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
new Rokka(config?): Rokka;
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
| <a id="property-billing"></a> `billing` | `readonly` | [`BillingApi`](billing.md#billingapi) |
| <a id="property-expressions"></a> `expressions` | `readonly` | `ExpressionsApi` |
| <a id="property-memberships"></a> `memberships` | `readonly` | [`MembershipsApi`](apis/memberships.md#membershipsapi) |
| <a id="property-operations"></a> `operations` | `readonly` | [`OperationsApi`](operations.md#operationsapi) |
| <a id="property-organizations"></a> `organizations` | `readonly` | [`OrganizationsApi`](organizations.md#organizationsapi) |
| <a id="property-render"></a> `render` | `readonly` | [`RenderApi`](apis/render.md#renderapi) |
| <a id="property-request"></a> `request` | `readonly` | [`Request`](request.md#request) |
| <a id="property-sourceimages"></a> `sourceimages` | `readonly` | [`SourceimagesApi`](apis/sourceimages.md#sourceimagesapi) |
| <a id="property-stackoptions"></a> `stackoptions` | `readonly` | [`StackOptionsApi`](stackoptions.md#stackoptionsapi) |
| <a id="property-stacks"></a> `stacks` | `readonly` | [`StacksApi`](stacks.md#stacksapi) |
| <a id="property-stats"></a> `stats` | `readonly` | [`StatsApi`](stats.md#statsapi) |
| <a id="property-user"></a> `user` | `readonly` | [`UserApi`](user.md#userapi) |
| <a id="property-users"></a> `users` | `readonly` | [`UsersApi`](users.md#usersapi) |
| <a id="property-utils"></a> `utils` | `readonly` | [`UtilsApi`](utils.md#utilsapi) |

## Interfaces

### Config

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-apihost"></a> `apiHost?` | `string` |
| <a id="property-apikey"></a> `apiKey?` | `string` |
| <a id="property-apitokengetcallback"></a> `apiTokenGetCallback?` | [`ApiTokenGetCallback`](user.md#apitokengetcallback) |
| <a id="property-apitokenoptions"></a> `apiTokenOptions?` | \| [`RequestQueryParamsNewToken`](user.md#requestqueryparamsnewtoken) \| `null` |
| <a id="property-apitokenrefreshtime"></a> `apiTokenRefreshTime?` | `number` |
| <a id="property-apitokensetcallback"></a> `apiTokenSetCallback?` | [`ApiTokenSetCallback`](user.md#apitokensetcallback) |
| <a id="property-apiversion"></a> `apiVersion?` | `string` \| `number` |
| <a id="property-debug"></a> `debug?` | `boolean` |
| <a id="property-renderhost"></a> `renderHost?` | `string` |
| <a id="property-transport"></a> `transport?` | `object` |
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
| <a id="property-apihost-1"></a> `apiHost` | `string` |
| <a id="property-apikey-1"></a> `apiKey` | `string` \| `undefined` |
| <a id="property-apitokengetcallback-1"></a> `apiTokenGetCallback?` | [`ApiTokenGetCallback`](user.md#apitokengetcallback) |
| <a id="property-apitokenoptions-1"></a> `apiTokenOptions?` | \| [`RequestQueryParamsNewToken`](user.md#requestqueryparamsnewtoken) \| `null` |
| <a id="property-apitokenpayload"></a> `apiTokenPayload` | [`ApiTokenPayload`](user.md#apitokenpayload) \| `null` |
| <a id="property-apitokenrefreshtime-1"></a> `apiTokenRefreshTime` | `number` |
| <a id="property-apitokensetcallback-1"></a> `apiTokenSetCallback?` | [`ApiTokenSetCallback`](user.md#apitokensetcallback) |
| <a id="property-apiversion-1"></a> `apiVersion` | `string` \| `number` |
| <a id="property-renderhost-1"></a> `renderHost` | `string` |
| <a id="property-transportoptions"></a> `transportOptions` | `any` |

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
