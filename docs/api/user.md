# user

### User

## Interfaces

### ApiTokenPayload

#### Indexable

```ts
[key: string]: string | number | boolean | string[] | null | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="exp"></a> `exp` | `number` |
| <a id="expt"></a> `expt?` | `number` |
| <a id="ip"></a> `ip?` | `string` |
| <a id="ips"></a> `ips?` | `string`[] |
| <a id="nr"></a> `nr?` | `boolean` |

***

### RequestQueryParamsNewToken

#### Extends

- [`RequestQueryParams`](index.md#requestqueryparams)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="expires_in"></a> `expires_in?` | `number` |
| <a id="ips-1"></a> `ips?` | `string` |
| <a id="no_ip_protection"></a> `no_ip_protection?` | `boolean` |
| <a id="renewable"></a> `renewable?` | `boolean` |

***

### User

#### Methods

##### addApiKey()

```ts
addApiKey(comment): Promise<UserApiKeyResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `comment` | `string` \| `null` |

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

##### deleteApiKey()

```ts
deleteApiKey(id): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `id` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(): Promise<UserResponse>;
```

###### Returns

`Promise`\<[`UserResponse`](#userresponse)\>

##### getCurrentApiKey()

```ts
getCurrentApiKey(): Promise<UserApiKeyResponse>;
```

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

##### getId()

```ts
getId(): Promise<string>;
```

###### Returns

`Promise`\<`string`\>

##### getNewToken()

```ts
getNewToken(apiKey?, queryParams?): Promise<UserKeyTokenResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `apiKey?` | `string` |
| `queryParams?` | [`RequestQueryParamsNewToken`](#requestqueryparamsnewtoken) \| `null` |

###### Returns

`Promise`\<[`UserKeyTokenResponse`](#userkeytokenresponse)\>

##### getToken()

```ts
getToken(): ApiToken;
```

###### Returns

[`ApiToken`](#apitoken)

##### getTokenIsValidFor()

```ts
getTokenIsValidFor(): number;
```

###### Returns

`number`

##### isTokenExpiring()

```ts
isTokenExpiring(atLeastNotForSeconds?): boolean;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `atLeastNotForSeconds?` | `number` |

###### Returns

`boolean`

##### listApiKeys()

```ts
listApiKeys(): Promise<UserApiKeyListResponse>;
```

###### Returns

`Promise`\<[`UserApiKeyListResponse`](#userapikeylistresponse)\>

##### setToken()

```ts
setToken(token): void;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ApiToken`](#apitoken) |

###### Returns

`void`

***

### UserApiKey

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="accessed"></a> `accessed?` | `string` |
| <a id="api_key"></a> `api_key?` | `string` |
| <a id="comment"></a> `comment?` | `string` |
| <a id="created"></a> `created?` | `string` |
| <a id="id"></a> `id` | `string` |

***

### UserApiKeyListResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body"></a> `body` | [`UserApiKey`](#userapikey)[] | `RokkaResponse.body` | - |
| <a id="error"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="message"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="response"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="statuscode"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="statusmessage"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserApiKeyResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body-1"></a> `body` | [`UserApiKey`](#userapikey) | `RokkaResponse.body` | - |
| <a id="error-1"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="message-1"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="response-1"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="statuscode-1"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="statusmessage-1"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserKeyTokenBody

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="body-2"></a> `body` | `any` | `RokkaResponse.body` |
| <a id="error-2"></a> `error?` | `any` | `RokkaResponse.error` |
| <a id="message-2"></a> `message?` | `string` | `RokkaResponse.message` |
| <a id="payload"></a> `payload` | [`ApiTokenPayload`](#apitokenpayload) | - |
| <a id="response-2"></a> `response` | `Response` | `RokkaResponse.response` |
| <a id="statuscode-2"></a> `statusCode` | `number` | `RokkaResponse.statusCode` |
| <a id="statusmessage-2"></a> `statusMessage` | `string` | `RokkaResponse.statusMessage` |
| <a id="token"></a> `token` | [`ApiToken`](#apitoken) | - |

***

### UserKeyTokenResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body-3"></a> `body` | [`UserKeyTokenBody`](#userkeytokenbody) | `RokkaResponse.body` | - |
| <a id="error-3"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="message-3"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="response-3"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="statuscode-3"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="statusmessage-3"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body-4"></a> `body` | `object` | `RokkaResponse.body` | - |
| `body.api_keys` | [`UserApiKey`](#userapikey)[] | - | - |
| `body.email?` | `string` | - | - |
| `body.user_id` | `string` | - | - |
| <a id="error-4"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="message-4"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="response-4"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="statuscode-4"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="statusmessage-4"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

## Type Aliases

### ApiToken

```ts
type ApiToken = string | null;
```

***

### ApiTokenGetCallback

```ts
type ApiTokenGetCallback = () => ApiToken | null | undefined;
```

***

### ApiTokenSetCallback

```ts
type ApiTokenSetCallback = (token, payload?) => void | null;
```

## Variables

### default()

```ts
default: (state) => object;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

#### Returns

`object`

| Name | Type |
| ------ | ------ |
| `user` | [`User`](#user) |
