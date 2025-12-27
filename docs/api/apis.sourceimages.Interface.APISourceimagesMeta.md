# Interface: APISourceimagesMeta

## Properties

### add()

```ts
add: (organization, hash, data) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### data

#### Returns

`Promise`\<`RokkaResponse`\>

***

### delete()

```ts
delete: (organization, hash, field?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### field?

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get: (organization, hash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### replace()

```ts
replace: (organization, hash, data) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### data

#### Returns

`Promise`\<`RokkaResponse`\>

***

### set()

```ts
set: (organization, hash, field, value) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### field

`string`

##### value

`any`

#### Returns

`Promise`\<`RokkaResponse`\>
