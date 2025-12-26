# Interface: APISourceimagesAlias

## Properties

### create()

```ts
create: (organization, alias, data, params?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### alias

`string`

##### data

###### hash

`string`

##### params?

###### overwrite?

`boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

## Methods

### delete()

```ts
delete(organization, alias): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### alias

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get(organization, alias): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### alias

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### invalidateCache()

```ts
invalidateCache(organization, alias): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### alias

`string`

#### Returns

`Promise`\<`RokkaResponse`\>
