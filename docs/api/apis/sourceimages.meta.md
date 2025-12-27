# apis/sourceimages.meta

## Classes

### SourceimagesMetaApi

#### Constructors

##### Constructor

```ts
new SourceimagesMetaApi(state): SourceimagesMetaApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

###### Returns

[`SourceimagesMetaApi`](#sourceimagesmetaapi)

#### Methods

##### add()

```ts
add(
   organization, 
   hash, 
data): Promise<RokkaResponse>;
```

Add user metadata to a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
const result = await rokka.sourceimages.meta.add('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0,
  'delete_this': null
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | name |
| `hash` | `string` | image hash |
| `data` | \{ \[`key`: `string`\]: `any`; \} | metadata to add to the image |

###### Returns

`Promise`\<`RokkaResponse`\>

###### Authenticated

##### delete()

```ts
delete(
   organization, 
   hash, 
field?): Promise<RokkaResponse>;
```

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
await rokka.sourceimages.meta.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

If the third parameter (field) is specified, it will just delete this field.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | name |
| `hash` | `string` | `undefined` | image hash |
| `field?` | `string` \| `null` | `null` | optional field to delete |

###### Returns

`Promise`\<`RokkaResponse`\>

###### Authenticated

##### get()

```ts
get(organization, hash): Promise<RokkaResponse>;
```

Get all user metadata for a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to user metadata

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.sourceimages.meta.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

##### replace()

```ts
replace(
   organization, 
   hash, 
data): Promise<RokkaResponse>;
```

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
const result = await rokka.sourceimages.meta.replace('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | name |
| `hash` | `string` | image hash |
| `data` | \{ \[`key`: `string`\]: `any`; \} | new metadata |

###### Returns

`Promise`\<`RokkaResponse`\>

###### Authenticated

##### set()

```ts
set(
   organization, 
   hash, 
   field, 
value): Promise<RokkaResponse>;
```

Set a single user metadata field on a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `field` | `string` | Metadata field name |
| `value` | `any` | Metadata field value |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when metadata is set

###### Remarks

Requires authentication.

###### Example

```js
await rokka.sourceimages.meta.set('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'somefield', 'somevalue')
```

## Type Aliases

### APISourceimagesMeta

```ts
type APISourceimagesMeta = SourceimagesMetaApi;
```

## Variables

### default()

```ts
default: (state) => SourceimagesMetaApi;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

#### Returns

[`SourceimagesMetaApi`](#sourceimagesmetaapi)
