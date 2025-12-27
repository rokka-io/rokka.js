# apis/memberships

## Enumerations

### Role

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="admin"></a> `ADMIN` | `"admin"` |
| <a id="read"></a> `READ` | `"read"` |
| <a id="sourceimage_read"></a> `SOURCEIMAGE_READ` | `"sourceimages:read"` |
| <a id="sourceimage_unlock"></a> `SOURCEIMAGE_UNLOCK` | `"sourceimages:unlock"` |
| <a id="sourceimage_write"></a> `SOURCEIMAGE_WRITE` | `"sourceimages:write"` |
| <a id="sourceimages_download_protected"></a> `SOURCEIMAGES_DOWNLOAD_PROTECTED` | `"sourceimages:download:protected"` |
| <a id="upload"></a> `UPLOAD` | `"upload"` |
| <a id="write"></a> `WRITE` | `"write"` |

## Classes

### MembershipsApi

#### Constructors

##### Constructor

```ts
new MembershipsApi(state): MembershipsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

###### Returns

[`MembershipsApi`](#membershipsapi)

#### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="roles"></a> `ROLES` | `readonly` | `object` |
| `ROLES.ADMIN` | `public` | [`Role`](#role) |
| `ROLES.READ` | `public` | [`Role`](#role) |
| `ROLES.SOURCEIMAGE_READ` | `public` | [`Role`](#role) |
| `ROLES.SOURCEIMAGE_UNLOCK` | `public` | [`Role`](#role) |
| `ROLES.SOURCEIMAGE_WRITE` | `public` | [`Role`](#role) |
| `ROLES.SOURCEIMAGES_DOWNLOAD_PROTECTED` | `public` | [`Role`](#role) |
| `ROLES.UPLOAD` | `public` | [`Role`](#role) |
| `ROLES.WRITE` | `public` | [`Role`](#role) |

#### Methods

##### create()

```ts
create(
   organization, 
   userId, 
   roles, 
comment?): Promise<RokkaResponse>;
```

Add a member to an organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `userId` | `string` | UUID of user to add to the organization |
| `roles` | [`Role`](#role) \| [`Role`](#role)[] | User roles (`rokka.memberships.ROLES`) |
| `comment?` | `string` \| `null` | Optional comment |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the membership

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.memberships.create('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290', [rokka.memberships.ROLES.WRITE], "An optional comment")
```

##### createWithNewUser()

```ts
createWithNewUser(
   organization, 
   roles, 
comment?): Promise<RokkaResponse>;
```

Create a user and membership associated to this organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `roles` | [`Role`](#role)[] | User roles (`rokka.memberships.ROLES`) |
| `comment?` | `string` \| `null` | Optional comment |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the new user and membership

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.memberships.createWithNewUser('myorg', [rokka.memberships.ROLES.READ], "New user for something")
```

##### delete()

```ts
delete(organization, userId): Promise<RokkaResponse>;
```

Delete a member in an organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `userId` | `string` | UUID of user to delete from the organization |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when member is deleted

###### Remarks

Requires authentication.

###### Example

```js
await rokka.memberships.delete('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290')
```

##### get()

```ts
get(organization, userId): Promise<RokkaResponse>;
```

Get info of a member in an organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `userId` | `string` | UUID of the user |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the member info

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.memberships.get('myorg', userId)
```

##### list()

```ts
list(organization): Promise<RokkaResponse>;
```

Lists members in an organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the list of members

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.memberships.list('myorg')
```

## Type Aliases

### Memberships

```ts
type Memberships = MembershipsApi;
```

## Variables

### default()

```ts
default: (state) => object;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

#### Returns

`object`

| Name | Type |
| ------ | ------ |
| `memberships` | [`MembershipsApi`](#membershipsapi) |
