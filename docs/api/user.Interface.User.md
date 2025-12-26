# Interface: User

## Methods

### addApiKey()

```ts
addApiKey(comment): Promise<UserApiKeyResponse>;
```

#### Parameters

##### comment

`string` | `null`

#### Returns

`Promise`\<[`UserApiKeyResponse`](user.Interface.UserApiKeyResponse.md)\>

***

### deleteApiKey()

```ts
deleteApiKey(id): Promise<RokkaResponse>;
```

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get(): Promise<UserResponse>;
```

#### Returns

`Promise`\<[`UserResponse`](user.Interface.UserResponse.md)\>

***

### getCurrentApiKey()

```ts
getCurrentApiKey(): Promise<UserApiKeyResponse>;
```

#### Returns

`Promise`\<[`UserApiKeyResponse`](user.Interface.UserApiKeyResponse.md)\>

***

### getId()

```ts
getId(): Promise<string>;
```

#### Returns

`Promise`\<`string`\>

***

### getNewToken()

```ts
getNewToken(apiKey?, queryParams?): Promise<UserKeyTokenResponse>;
```

#### Parameters

##### apiKey?

`string`

##### queryParams?

[`RequestQueryParamsNewToken`](user.Interface.RequestQueryParamsNewToken.md) | `null`

#### Returns

`Promise`\<[`UserKeyTokenResponse`](user.Interface.UserKeyTokenResponse.md)\>

***

### getToken()

```ts
getToken(): ApiToken;
```

#### Returns

[`ApiToken`](user.TypeAlias.ApiToken.md)

***

### getTokenIsValidFor()

```ts
getTokenIsValidFor(): number;
```

#### Returns

`number`

***

### isTokenExpiring()

```ts
isTokenExpiring(atLeastNotForSeconds?): boolean;
```

#### Parameters

##### atLeastNotForSeconds?

`number`

#### Returns

`boolean`

***

### listApiKeys()

```ts
listApiKeys(): Promise<UserApiKeyListResponse>;
```

#### Returns

`Promise`\<[`UserApiKeyListResponse`](user.Interface.UserApiKeyListResponse.md)\>

***

### setToken()

```ts
setToken(token): void;
```

#### Parameters

##### token

[`ApiToken`](user.TypeAlias.ApiToken.md)

#### Returns

`void`
