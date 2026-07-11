# user

### User

## Classes

### UserApi

#### Constructors

##### Constructor

```ts
new UserApi(state): UserApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`UserApi`](#userapi)

#### Methods

##### addApiKey()

```ts
addApiKey(comment?, options?): Promise<UserApiKeyResponse>;
```

Add Api Key to the current user

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `comment` | `string` \| `null` | `null` | Optional comment for the API key |
| `options` | [`UserApiKeyOptions`](#userapikeyoptions) | `{}` | Optional API key options, e.g. `{requires_mfa: true}` (since 4.2.0) |

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

Promise resolving to the created API key

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.addApiKey('some comment')
```

###### Since

3.3.0

##### confirmMfaTotp()

```ts
confirmMfaTotp(totp): Promise<MfaTotpStatusResponse>;
```

Confirm the TOTP (MFA) setup with a first valid code, activating it

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `totp` | `string` | The current TOTP code from the authenticator app |

###### Returns

`Promise`\<[`MfaTotpStatusResponse`](#mfatotpstatusresponse)\>

Promise resolving to the TOTP state

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.confirmMfaTotp('123456')
```

###### Since

4.2.0

##### deleteApiKey()

```ts
deleteApiKey(id): Promise<RokkaResponse>;
```

Delete Api Key from the current user

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The ID of the API key to delete |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when key is deleted

###### Remarks

Requires authentication.

###### Example

```js
await rokka.user.deleteApiKey(id)
```

###### Since

3.3.0

##### disableMfaTotp()

```ts
disableMfaTotp(totp): Promise<RokkaResponse>;
```

Disable TOTP (MFA) for the current user

Needs a valid current TOTP code. Also removes the `requires_mfa` flag
from all API keys of the user.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `totp` | `string` | The current TOTP code from the authenticator app |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when TOTP is disabled (204)

###### Remarks

Requires authentication.

###### Example

```js
await rokka.user.disableMfaTotp('123456')
```

###### Since

4.2.0

##### get()

```ts
get(): Promise<UserResponse>;
```

Get user object for current user

###### Returns

`Promise`\<[`UserResponse`](#userresponse)\>

Promise resolving to the user object

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.get()
```

###### Since

3.3.0

##### getCurrentApiKey()

```ts
getCurrentApiKey(): Promise<UserApiKeyResponse>;
```

Get currently used Api Key

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

Promise resolving to the current API key

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.getCurrentApiKey()
```

###### Since

3.3.0

##### getId()

```ts
getId(): Promise<string>;
```

Get user_id for current user

###### Returns

`Promise`\<`string`\>

Promise resolving to the user ID

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.users.getId()
```

###### Since

3.3.0

##### getMfaTotp()

```ts
getMfaTotp(): Promise<MfaTotpStatusResponse>;
```

Get the TOTP (MFA) state of the current user

###### Returns

`Promise`\<[`MfaTotpStatusResponse`](#mfatotpstatusresponse)\>

Promise resolving to the TOTP state

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.getMfaTotp()
console.log(result.body.state) // 'none' | 'pending' | 'active'
```

###### Since

4.2.0

##### getNewToken()

```ts
getNewToken(apiKey?, queryParams?): Promise<UserKeyTokenResponse>;
```

Gets a new JWT token from the API.

You either provide an API Key or there's a valid JWT token registered to get a new JWT token.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `apiKey?` | `string` | If you don't have a valid JWT token, we need an API key to retrieve a new one |
| `queryParams?` | [`RequestQueryParamsNewToken`](#requestqueryparamsnewtoken) \| `null` | The query parameters used for generating a new JWT token. If the API key has `requires_mfa` set, pass the current TOTP code as `totp` (since 4.2.0) |

###### Returns

`Promise`\<[`UserKeyTokenResponse`](#userkeytokenresponse)\>

Promise resolving to the new token

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.getNewToken(apiKey, {expires_in: 48 * 3600, renewable: true})
```

###### Since

3.7.0

##### getToken()

```ts
getToken(): ApiToken;
```

Gets the currently registered JWT Token from the `apiTokenGetCallback` config function or null

###### Returns

[`ApiToken`](#apitoken)

The JWT token or null

###### Since

3.7.0

##### getTokenIsValidFor()

```ts
getTokenIsValidFor(): number;
```

How long a token is still valid for (just checking for expiration time)

###### Returns

`number`

The amount of seconds it's still valid for, -1 if it doesn't exist

###### Since

3.7.0

##### isTokenExpiring()

```ts
isTokenExpiring(withinNextSeconds?): boolean;
```

Check if the registered JWT token is expiring within these amount of seconds (default: 3600)

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `withinNextSeconds` | `number` | `3600` | Does it expire in these seconds (default: 3600) |

###### Returns

`boolean`

True if token is expiring within the specified time

###### Since

3.7.0

##### listApiKeys()

```ts
listApiKeys(): Promise<UserApiKeyListResponse>;
```

List Api Keys of the current user

###### Returns

`Promise`\<[`UserApiKeyListResponse`](#userapikeylistresponse)\>

Promise resolving to the list of API keys

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.listApiKeys()
```

###### Since

3.3.0

##### patchApiKey()

```ts
patchApiKey(id, options): Promise<UserApiKeyResponse>;
```

Update an Api Key of the current user

Currently only the `requires_mfa` flag can be changed. A key with
`requires_mfa` can't be used directly anymore, it can only be exchanged
for a JWT token together with a valid TOTP (MFA) code, see
[getNewToken](#getnewtoken) and its `totp` parameter.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The ID of the API key to update |
| `options` | [`UserApiKeyOptions`](#userapikeyoptions) | The API key options to change |

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

Promise resolving to the updated API key info (includes `totp_state`)

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.patchApiKey(id, { requires_mfa: true })
```

###### Since

4.2.0

##### setToken()

```ts
setToken(token): void;
```

Sets a new JWT token with the `apiTokenSetCallback` function

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | [`ApiToken`](#apitoken) | The JWT token to set |

###### Returns

`void`

###### Since

3.7.0

##### setupMfaTotp()

```ts
setupMfaTotp(): Promise<MfaTotpSetupResponse>;
```

Start the TOTP (MFA) setup for the current user

Returns the secret and an `otpauth://` provisioning URI (for QR codes).
The setup only becomes active once a first valid code is sent to
[confirmMfaTotp](#confirmmfatotp). Calling this again replaces an unconfirmed secret,
it fails with a 409 when TOTP is already active.

###### Returns

`Promise`\<[`MfaTotpSetupResponse`](#mfatotpsetupresponse)\>

Promise resolving to the new (unconfirmed) TOTP secret and provisioning URI

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.setupMfaTotp()
console.log(result.body.secret, result.body.provisioning_uri)
```

###### Since

4.2.0

## Interfaces

### ApiTokenPayload

#### Indexable

```ts
[key: string]: string | number | boolean | string[] | null | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-exp"></a> `exp` | `number` |
| <a id="property-expt"></a> `expt?` | `number` |
| <a id="property-ip"></a> `ip?` | `string` |
| <a id="property-ips"></a> `ips?` | `string`[] |
| <a id="property-nr"></a> `nr?` | `boolean` |
| <a id="property-rn"></a> `rn?` | `boolean` |

***

### MfaTotpSetup

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-provisioning_uri"></a> `provisioning_uri` | `string` |
| <a id="property-secret"></a> `secret` | `string` |
| <a id="property-state"></a> `state` | [`MfaTotpState`](#mfatotpstate) |

***

### MfaTotpSetupResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body"></a> `body` | [`MfaTotpSetup`](#mfatotpsetup) | `RokkaResponse.body` | - |
| <a id="property-error"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### MfaTotpStatus

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-confirmed"></a> `confirmed?` | `string` \| `null` |
| <a id="property-state-1"></a> `state` | [`MfaTotpState`](#mfatotpstate) |

***

### MfaTotpStatusResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-1"></a> `body` | [`MfaTotpStatus`](#mfatotpstatus) | `RokkaResponse.body` | - |
| <a id="property-error-1"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-1"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-1"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-1"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-1"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### RequestQueryParamsNewToken

#### Extends

- [`RequestQueryParams`](index.md#requestqueryparams)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-expires_in"></a> `expires_in?` | `number` | - |
| <a id="property-ips-1"></a> `ips?` | `string` | - |
| <a id="property-no_ip_protection"></a> `no_ip_protection?` | `boolean` | - |
| <a id="property-renewable"></a> `renewable?` | `boolean` | - |
| <a id="property-totp"></a> `totp?` | `string` | The current TOTP (MFA) code, needed when the used API key has `requires_mfa` set. This is a one-shot parameter for a single `getNewToken` call — never put it into `apiTokenOptions`, codes are only valid for a short time and single-use (and are stripped from `apiTokenOptions` defensively on token renewals). It is sent in the JSON request body, never in the URL/query string. |

***

### UserApiKey

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-accessed"></a> `accessed?` | `string` |
| <a id="property-api_key"></a> `api_key?` | `string` |
| <a id="property-comment"></a> `comment?` | `string` |
| <a id="property-created"></a> `created?` | `string` |
| <a id="property-id"></a> `id` | `string` |
| <a id="property-requires_mfa"></a> `requires_mfa?` | `boolean` |
| <a id="property-totp_state"></a> `totp_state?` | [`MfaTotpState`](#mfatotpstate) |

***

### UserApiKeyListResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-2"></a> `body` | [`UserApiKey`](#userapikey)[] | `RokkaResponse.body` | - |
| <a id="property-error-2"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-2"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-2"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-2"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-2"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserApiKeyOptions

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-requires_mfa-1"></a> `requires_mfa?` | `boolean` |

***

### UserApiKeyResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-3"></a> `body` | [`UserApiKey`](#userapikey) | `RokkaResponse.body` | - |
| <a id="property-error-3"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-3"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-3"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-3"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-3"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserKeyTokenBody

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-body-4"></a> `body` | `any` | `RokkaResponse.body` |
| <a id="property-error-4"></a> `error?` | `any` | `RokkaResponse.error` |
| <a id="property-message-4"></a> `message?` | `string` | `RokkaResponse.message` |
| <a id="property-payload"></a> `payload` | [`ApiTokenPayload`](#apitokenpayload) | - |
| <a id="property-response-4"></a> `response` | `Response` | `RokkaResponse.response` |
| <a id="property-statuscode-4"></a> `statusCode` | `number` | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-4"></a> `statusMessage` | `string` | `RokkaResponse.statusMessage` |
| <a id="property-token"></a> `token` | [`ApiToken`](#apitoken) | - |

***

### UserKeyTokenResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-5"></a> `body` | [`UserKeyTokenBody`](#userkeytokenbody) | `RokkaResponse.body` | - |
| <a id="property-error-5"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-5"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-5"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-5"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-5"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-6"></a> `body` | `object` | `RokkaResponse.body` | - |
| `body.api_keys` | [`UserApiKey`](#userapikey)[] | - | - |
| `body.email?` | `string` | - | - |
| `body.user_id` | `string` | - | - |
| <a id="property-error-6"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-6"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-6"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-6"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-6"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

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

***

### MfaTotpState

```ts
type MfaTotpState = "none" | "pending" | "active";
```

***

### User

```ts
type User = UserApi;
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
| `user` | [`UserApi`](#userapi) |
