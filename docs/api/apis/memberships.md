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

## Interfaces

### Memberships

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="roles"></a> `ROLES` | `object` |
| `ROLES.ADMIN` | [`Role`](#role) |
| `ROLES.READ` | [`Role`](#role) |
| `ROLES.UPLOAD` | [`Role`](#role) |
| `ROLES.WRITE` | [`Role`](#role) |

#### Methods

##### create()

```ts
create(
   organization, 
   userId, 
   roles, 
comment?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `userId` | `string` |
| `roles` | [`Role`](#role) \| [`Role`](#role)[] |
| `comment?` | `string` \| `null` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### createWithNewUser()

```ts
createWithNewUser(
   organization, 
   roles, 
comment?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `roles` | [`Role`](#role)[] |
| `comment?` | `string` \| `null` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### delete()

```ts
delete(organization, userId): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `userId` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(organization, userId): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `userId` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### list()

```ts
list(organization): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

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
| `memberships` | [`Memberships`](#memberships) |
