# apis/sourceimages.alias

## Classes

### SourceimagesAliasApi

#### Constructors

##### Constructor

```ts
new SourceimagesAliasApi(state): SourceimagesAliasApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

###### Returns

[`SourceimagesAliasApi`](#sourceimagesaliasapi)

#### Methods

##### create()

```ts
create(
   organization, 
   alias, 
   data, 
params?): Promise<RokkaResponse>;
```

Adds an alias to a source image.

See [the source image alias documentation](https://rokka.io/documentation/references/source-images-aliases.html)
for an explanation.

```js
const result = await rokka.sourceimages.alias.create('myorg', 'myalias', {
  hash: 'somehash',
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | name |
| `alias` | `string` | alias name |
| `data` | \{ `hash`: `string`; \} | object with "hash" key |
| `data.hash` | `string` | - |
| `params?` | \{ `overwrite?`: `boolean`; \} | params query params, only {overwrite: true|false} is currently supported |
| `params.overwrite?` | `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

###### Authenticated

##### delete()

```ts
delete(organization, alias): Promise<RokkaResponse>;
```

Delete an alias.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` |  |
| `alias` | `string` |  |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(organization, alias): Promise<RokkaResponse>;
```

Get an alias.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` |  |
| `alias` | `string` |  |

###### Returns

`Promise`\<`RokkaResponse`\>

##### invalidateCache()

```ts
invalidateCache(organization, alias): Promise<RokkaResponse>;
```

Invalidate the CDN cache for an alias.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` |  |
| `alias` | `string` |  |

###### Returns

`Promise`\<`RokkaResponse`\>

## Type Aliases

### APISourceimagesAlias

```ts
type APISourceimagesAlias = SourceimagesAliasApi;
```

## Variables

### default()

```ts
default: (state) => SourceimagesAliasApi;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

#### Returns

[`SourceimagesAliasApi`](#sourceimagesaliasapi)
