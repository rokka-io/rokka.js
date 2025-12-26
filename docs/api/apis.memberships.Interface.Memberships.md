# Interface: Memberships

## Properties

### ROLES

```ts
ROLES: object;
```

#### ADMIN

```ts
ADMIN: Role;
```

#### READ

```ts
READ: Role;
```

#### UPLOAD

```ts
UPLOAD: Role;
```

#### WRITE

```ts
WRITE: Role;
```

## Methods

### create()

```ts
create(
   organization, 
   userId, 
   roles, 
comment?): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### userId

`string`

##### roles

[`Role`](apis.memberships.Enumeration.Role.md) | [`Role`](apis.memberships.Enumeration.Role.md)[]

##### comment?

`string` | `null`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### createWithNewUser()

```ts
createWithNewUser(
   organization, 
   roles, 
comment?): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### roles

[`Role`](apis.memberships.Enumeration.Role.md)[]

##### comment?

`string` | `null`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### delete()

```ts
delete(organization, userId): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### userId

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get(organization, userId): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### userId

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### list()

```ts
list(organization): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

#### Returns

`Promise`\<`RokkaResponse`\>
