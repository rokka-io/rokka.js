# user

### User

#### Authentication errors

Besides a plain 401, requests can fail with a 401 and one of these `error`
codes in the body (together with `invalid_authentication: true`):

- `key_expired` - the API key's `expires` date has passed
- `ip_not_allowed` - the request's IP is not in the key's `allowed_ips`
- `mfa_required` - an MFA key was used for something other than a token exchange
- `mfa_enrollment_required` - an MFA key was used, but TOTP isn't set up yet
- `totp_invalid` - the TOTP code was wrong or already used

`allowed_ips` and `expires` are enforced retroactively, they also apply to
JWT tokens which were minted from that key before the restriction was set.

#### Trusted keys

A user which only holds read-only roles (`read` / `upload` /
`sourceimages:read`) gets a 403 on all of its own key, user and membership
endpoints, so it can't even rotate its own keys. A key with `trusted: true`
(since 4.3.0) is exempt from that guard, which makes such a user
self-serviceable again. The flag is per key, so a published sibling key of
the same user stays locked down, and it grants no organization permissions.
Never hand a trusted key to end users.

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

The response only contains the options you actually supplied, next to
`id`, `api_key` and `comment`. This is the only place where the key value
itself is returned, it can't be retrieved later on.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `comment` | `string` \| `null` | `null` | Optional comment for the API key |
| `options` | [`UserApiKeyOptions`](#userapikeyoptions) | `{}` | Optional API key options: `requires_mfa`, `allowed_ips` (max 10 IPs or IPv4 CIDR ranges) and `expires` (must be in the future), all since 4.2.0, and `trusted` since 4.3.0 |

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

Promise resolving to the created API key

###### Remarks

Requires authentication.

###### Examples

```js
const result = await rokka.user.addApiKey('some comment')
```

```js
const result = await rokka.user.addApiKey('ci key', {
  allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
  expires: '2027-01-01T00:00:00+00:00'
})
```

```js
const result = await rokka.user.addApiKey('deploy key', { trusted: true })
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

##### listAdminApiKeys()

```ts
listAdminApiKeys(): Promise<AdminApiKeysResponse>;
```

List the members and their Api Key metadata of all organizations you administrate

Returns one entry per organization and member, for every organization
where the current user has the `admin:read` role (`admin` implicitly has
it too). Only the key metadata is returned, never the key values or the
organization's signing keys.

A `truncated: true` in the response means the result was cut off, because
the current user has more than 1000 memberships or is a member of more
than 50 organizations. There is no pagination or cursor to get the rest.

###### Returns

`Promise`\<[`AdminApiKeysResponse`](#adminapikeysresponse)\>

Promise resolving to the members and their API key metadata

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.listAdminApiKeys()
result.body.items.forEach(member => {
  console.log(member.organization, member.email, member.api_keys.length)
})
```

###### Since

4.2.0

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

##### listMemberships()

```ts
listMemberships(): Promise<UserMembershipsResponse>;
```

List the organizations the current user is a member of

Returns one entry per organization, together with the roles the user has
in it. Read-only and public API keys can't use this and get a 403.

There's no pagination, the API caps the result at 1000 memberships.

###### Returns

`Promise`\<[`UserMembershipsResponse`](#usermembershipsresponse)\>

Promise resolving to the organizations the current user is a member of

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.user.listMemberships()
result.body.items.forEach(membership => {
  console.log(membership.organization, membership.roles)
})
```

###### Since

4.2.0

##### patchApiKey()

```ts
patchApiKey(
   id, 
   options, 
queryParams?): Promise<UserApiKeyResponse>;
```

Update an Api Key of the current user

You can change the `requires_mfa` and `trusted` flags, the `allowed_ips`
whitelist and the `expires` date. At least one of them has to be given,
otherwise this rejects before doing a request. `allowed_ips: null` (or
`[]`) clears the whitelist, `expires: null` clears the expiration date.

A key with `requires_mfa` can't be used directly anymore, it can only be
exchanged for a JWT token together with a valid TOTP (MFA) code, see
[getNewToken](#getnewtoken) and its `totp` parameter.

`allowed_ips` and `expires` are enforced retroactively, so restricting the
very key you're authenticating this call with is refused with a 400 when
it would lock you out right now. Pass `{force: true}` to override that,
for example when setting up a key for a server on a different IP. The same
guard applies to clearing `trusted` on the current key when that flag is
the only reason this key may manage keys at all.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | The ID of the API key to update |
| `options` | [`UserApiKeyPatchOptions`](#userapikeypatchoptions) | The API key options to change, at least one of `requires_mfa`, `trusted` (since 4.3.0), `allowed_ips` or `expires` |
| `queryParams` | [`UserApiKeyPatchQueryParams`](#userapikeypatchqueryparams) | Optional `{force: true}` to override the self lockout guard |

###### Returns

`Promise`\<[`UserApiKeyResponse`](#userapikeyresponse)\>

Promise resolving to the updated API key info (always contains
  `id`, `comment`, `requires_mfa`, `totp_state`, `trusted`, `allowed_ips`
  and `expires`)

###### Remarks

Requires authentication.

###### Examples

```js
const result = await rokka.user.patchApiKey(id, { requires_mfa: true })
```

```js
const result = await rokka.user.patchApiKey(
  id,
  { allowed_ips: ['192.168.0.5'], expires: '2027-01-01T00:00:00+00:00' },
  { force: true }
)
```

```js
await rokka.user.patchApiKey(id, { allowed_ips: null, expires: null })
```

```js
await rokka.user.patchApiKey(id, { trusted: true })
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

### AdminApiKeysResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-body"></a> `body` | `object` | - | `RokkaResponse.body` | - |
| `body.items` | [`OrganizationMemberApiKeys`](#organizationmemberapikeys)[] | - | - | - |
| `body.total` | `number` | - | - | - |
| `body.truncated` | `boolean` | The result was cut off, because the current user has more than 1000 memberships or is a member of more than 50 organizations. There is no pagination or cursor to get the rest. | - | - |
| <a id="property-error"></a> `error?` | `any` | - | - | `RokkaResponse.error` |
| <a id="property-message"></a> `message?` | `string` | - | - | `RokkaResponse.message` |
| <a id="property-response"></a> `response` | `Response` | - | - | `RokkaResponse.response` |
| <a id="property-statuscode"></a> `statusCode` | `number` | - | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage"></a> `statusMessage` | `string` | - | - | `RokkaResponse.statusMessage` |

***

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
| <a id="property-body-1"></a> `body` | [`MfaTotpSetup`](#mfatotpsetup) | `RokkaResponse.body` | - |
| <a id="property-error-1"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-1"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-1"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-1"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-1"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

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
| <a id="property-body-2"></a> `body` | [`MfaTotpStatus`](#mfatotpstatus) | `RokkaResponse.body` | - |
| <a id="property-error-2"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-2"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-2"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-2"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-2"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### OrganizationMemberApiKeys

One organization/member pair with that member's API key metadata.

Called `OrganizationApiKeys` in the rokka API schema, renamed here since
the keys belong to a member, not to the organization.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-active"></a> `active` | `boolean` | - |
| <a id="property-api_keys"></a> `api_keys` | [`UserApiKey`](#userapikey)[] | Metadata of the member's API keys. Never contains `api_key`, key values are stored one way hashed and can't be recovered. |
| <a id="property-comment"></a> `comment` | `string` \| `null` | - |
| <a id="property-created"></a> `created` | `string` \| `null` | - |
| <a id="property-display_name"></a> `display_name` | `string` | - |
| <a id="property-email"></a> `email` | `string` | - |
| <a id="property-last_access"></a> `last_access` | `string` \| `null` | - |
| <a id="property-organization"></a> `organization` | `string` | Websafe name of the organization, as used in urls |
| <a id="property-organization_id"></a> `organization_id` | `string` | UUID of the organization |
| <a id="property-roles"></a> `roles` | `string`[] | - |
| <a id="property-user_id"></a> `user_id` | `string` | UUID of the member |

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

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-accessed"></a> `accessed?` | `string` | - |
| <a id="property-allowed_ips"></a> `allowed_ips?` | `string`[] | The key can only be used from these IPs / IPv4 CIDR ranges. A request from anywhere else fails with a 401 and `error: 'ip_not_allowed'`. |
| <a id="property-api_key"></a> `api_key?` | `string` | - |
| <a id="property-comment-1"></a> `comment?` | `string` | - |
| <a id="property-created-1"></a> `created?` | `string` | - |
| <a id="property-expires"></a> `expires?` | `string` \| `null` | The key stops working after this date. Requests with an expired key fail with a 401 and `error: 'key_expired'`. |
| <a id="property-id"></a> `id` | `string` | - |
| <a id="property-requires_mfa"></a> `requires_mfa?` | `boolean` | - |
| <a id="property-totp_state"></a> `totp_state?` | [`MfaTotpState`](#mfatotpstate) | - |
| <a id="property-trusted"></a> `trusted?` | `boolean` | The key is declared to never be handed to end users and may manage its own user's API keys even when that user only holds a read-only role (`read` / `upload` / `sourceimages:read`). It grants no organization permissions, and it's evaluated per key, so a published sibling key of the same user stays locked down. **Since** 4.3.0 |

***

### UserApiKeyListResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-3"></a> `body` | [`UserApiKey`](#userapikey)[] | `RokkaResponse.body` | - |
| <a id="property-error-3"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-3"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-3"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-3"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-3"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserApiKeyOptions

Options for creating an API key.

`allowed_ips` and `expires` can't be `null` here, there's no restriction to
clear on a brand new key and the API rejects an explicit null with a 400.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-allowed_ips-1"></a> `allowed_ips?` | `string`[] | - |
| <a id="property-expires-1"></a> `expires?` | `string` \| `Date` | - |
| <a id="property-requires_mfa-1"></a> `requires_mfa?` | `boolean` | - |
| <a id="property-trusted-1"></a> `trusted?` | `boolean` | Declare the key as never being handed to end users, so it can manage this user's API keys even when the user only holds a read-only role. **Since** 4.3.0 |

***

### UserApiKeyPatchOptions

Options for updating an API key. At least one of them has to be given.

`allowed_ips: null` (or `[]`) clears the whitelist, `expires: null` clears
the expiration date.

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-allowed_ips-2"></a> `allowed_ips?` | `string`[] \| `null` | - |
| <a id="property-expires-2"></a> `expires?` | `string` \| `Date` \| `null` | - |
| <a id="property-requires_mfa-2"></a> `requires_mfa?` | `boolean` | - |
| <a id="property-trusted-2"></a> `trusted?` | `boolean` | Declare the key as never being handed to end users, so it can manage this user's API keys even when the user only holds a read-only role. Clearing it on the key you're authenticating with is guarded against, see [UserApiKeyPatchQueryParams.force](#property-force). **Since** 4.3.0 |

***

### UserApiKeyPatchQueryParams

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-force"></a> `force?` | `boolean` | Allow a change which would lock the key you're currently authenticating with out of your own IP (or set an expiration date in the past, or clear its `trusted` flag while that's the only thing letting this key manage keys at all). |

***

### UserApiKeyResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-4"></a> `body` | [`UserApiKey`](#userapikey) | `RokkaResponse.body` | - |
| <a id="property-error-4"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-4"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-4"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-4"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-4"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserKeyTokenBody

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="property-body-5"></a> `body` | `any` | `RokkaResponse.body` |
| <a id="property-error-5"></a> `error?` | `any` | `RokkaResponse.error` |
| <a id="property-message-5"></a> `message?` | `string` | `RokkaResponse.message` |
| <a id="property-payload"></a> `payload` | [`ApiTokenPayload`](#apitokenpayload) | - |
| <a id="property-response-5"></a> `response` | `Response` | `RokkaResponse.response` |
| <a id="property-statuscode-5"></a> `statusCode` | `number` | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-5"></a> `statusMessage` | `string` | `RokkaResponse.statusMessage` |
| <a id="property-token"></a> `token` | [`ApiToken`](#apitoken) | - |

***

### UserKeyTokenResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-6"></a> `body` | [`UserKeyTokenBody`](#userkeytokenbody) | `RokkaResponse.body` | - |
| <a id="property-error-6"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-6"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-6"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-6"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-6"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserMembership

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-active-1"></a> `active` | `boolean` | - |
| <a id="property-comment-2"></a> `comment` | `string` \| `null` | - |
| <a id="property-created-2"></a> `created` | `string` \| `null` | - |
| <a id="property-display_name-1"></a> `display_name` | `string` | - |
| <a id="property-last_access-1"></a> `last_access` | `string` \| `null` | Date of the last access, only updated once within 24 hours |
| <a id="property-organization-1"></a> `organization` | `string` | Websafe name of the organization, as used in urls |
| <a id="property-organization_id-1"></a> `organization_id` | `string` | UUID of the organization |
| <a id="property-roles-1"></a> `roles` | `string`[] | The roles the user has in this organization, see `rokka.memberships.ROLES` |

***

### UserMembershipsResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-7"></a> `body` | `object` | `RokkaResponse.body` | - |
| `body.items` | [`UserMembership`](#usermembership)[] | - | - |
| `body.total` | `number` | - | - |
| <a id="property-error-7"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-7"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-7"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-7"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-7"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### UserResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="property-body-8"></a> `body` | `object` | `RokkaResponse.body` | - |
| `body.api_keys` | [`UserApiKey`](#userapikey)[] | - | - |
| `body.email?` | `string` | - | - |
| `body.user_id` | `string` | - | - |
| <a id="property-error-8"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="property-message-8"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="property-response-8"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="property-statuscode-8"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage-8"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

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
