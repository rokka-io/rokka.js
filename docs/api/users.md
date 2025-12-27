# users

### Users

## Classes

### UsersApi

#### Constructors

##### Constructor

```ts
new UsersApi(state): UsersApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`UsersApi`](#usersapi)

#### Methods

##### create()

```ts
create(email, organization): Promise<RokkaResponse>;
```

Register a new user for the rokka service.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `email` | `string` | `undefined` | Email address of a user |
| `organization` | `string` \| `null` | `null` | Organization to create |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the created user

###### Example

```js
const result = await rokka.users.create('user@example.org')
```

##### getId()

```ts
getId(): Promise<string>;
```

Get user_id for current user

###### Returns

`Promise`\<`string`\>

Promise resolving to the user ID

###### Example

```js
const result = await rokka.users.getId()
```

## Type Aliases

### Users

```ts
type Users = UsersApi;
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
| `users` | [`UsersApi`](#usersapi) |
