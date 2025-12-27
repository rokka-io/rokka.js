# apis/sourceimages

## Classes

### SourceimagesApi

#### Constructors

##### Constructor

```ts
new SourceimagesApi(state): SourceimagesApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

###### Returns

[`SourceimagesApi`](#sourceimagesapi)

#### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="alias"></a> `alias` | `readonly` | [`SourceimagesAliasApi`](sourceimages.alias.md#sourceimagesaliasapi) |
| <a id="meta"></a> `meta` | `readonly` | [`SourceimagesMetaApi`](sourceimages.meta.md#sourceimagesmetaapi) |

#### Methods

##### addDynamicMetaData()

```ts
addDynamicMetaData(
   organization, 
   hash, 
   name, 
   data, 
options): Promise<RokkaResponse>;
```

Add/set dynamic metadata to an image

See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
details.

```js
const result = await rokka.sourceimages.addDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
  x: 100,
  y: 100,
  width: 50,
  height: 50
}, {
  deletePrevious: false
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `name` | `string` | The name of the dynamic metadata |
| `data` | `any` | The data to be sent. Usually an object |
| `options` | \{ `deletePrevious?`: `string` \| `boolean`; \} | Optional: only {deletePrevious: true/false} yet, false is default |
| `options.deletePrevious?` | `string` \| `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the updated source image

##### autodescription()

```ts
autodescription(
   organization, 
   hash, 
   languages, 
force): Promise<RokkaResponse>;
```

Autodescribes an image. Can be used for alt attributes in img tags.

You need to be a paying customer to be able to use this.

```js
const result = await rokka.sourceimages.autodescription('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', ['en', 'de'], false)
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `hash` | `string` | `undefined` | Image hash |
| `languages` | `string`[] | `undefined` | Languages to autodescribe the image |
| `force` | `boolean` | `false` | If it should be generated, even if already exists |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the autodescription result

##### autolabel()

```ts
autolabel(organization, hash): Promise<RokkaResponse>;
```

Autolabels an image.

You need to be a paying customer to be able to use this.

```js
const result = await rokka.sourceimages.autolabel('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the autolabel result

##### copy()

```ts
copy(
   organization, 
   hash, 
   destinationOrganization, 
overwrite): Promise<RokkaResponse>;
```

Copy image by hash to another organization.

```js
await rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'anotherorg', true)
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `hash` | `string` | `undefined` | Image hash |
| `destinationOrganization` | `string` | `undefined` | Destination organization |
| `overwrite` | `boolean` | `true` | Whether to overwrite if the image already exists |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the image is copied

##### copyAll()

```ts
copyAll(
   organization, 
   hashes, 
   destinationOrganization, 
overwrite): Promise<RokkaResponse>;
```

Copy multiple images to another organization.

```js
await rokka.sourceimages.copyAll('myorg', ['hash1', 'hash2'], 'anotherorg', true)
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `hashes` | `string`[] | `undefined` | Array of image hashes |
| `destinationOrganization` | `string` | `undefined` | Destination organization |
| `overwrite` | `boolean` | `true` | Whether to overwrite if images already exist |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the images are copied

##### create()

```ts
create(
   organization, 
   fileName, 
   binaryData, 
   metadata, 
options): Promise<RokkaResponse>;
```

Upload an image.

```js
const file = require('fs').createReadStream('picture.png')
const result = await rokka.sourceimages.create('myorg', 'picture.png', file)
```

With directly adding metadata:

```js
rokka.sourceimages.create('myorg', 'picture.png', file, {'meta_user': {'foo': 'bar'}})
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `fileName` | `string` | `undefined` | File name |
| `binaryData` | `any` | `undefined` | Either a readable stream (in node.js only) or a binary string |
| `metadata` | `CreateMetadata` \| `null` | `null` | Optional metadata to be added, either user or dynamic |
| `options` | `CreateOptions` | `{}` | Optional: only {optimize_source: true/false} yet, false is default |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the created source image

##### createByUrl()

```ts
createByUrl(
   organization, 
   url, 
   metadata, 
options): Promise<RokkaResponse>;
```

Upload an image by url.

```js
const result = await rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png')
```

With directly adding metadata:

```js
rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png', {'meta_user': {'foo': 'bar'}})
```

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `url` | `string` | `undefined` | The URL to the remote image |
| `metadata` | `CreateMetadata` \| `null` | `null` | Optional metadata to be added, either user or dynamic |
| `options` | `CreateOptions` | `{}` | Optional: only {optimize_source: true/false} yet, false is default |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the created source image

##### delete()

```ts
delete(organization, hash): Promise<RokkaResponse>;
```

Delete image by hash.

```js
await rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the image is deleted

##### deleteDynamicMetaData()

```ts
deleteDynamicMetaData(
   organization, 
   hash, 
   name, 
options): Promise<RokkaResponse>;
```

Delete dynamic metadata of an image

See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for
details.

```js
await rokka.sourceimages.deleteDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
  deletePrevious: false
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `name` | `string` | The name of the dynamic metadata |
| `options` | \{ `deletePrevious?`: `string` \| `boolean`; \} | Optional: only {deletePrevious: true/false} yet, false is default |
| `options.deletePrevious?` | `string` \| `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the dynamic metadata is deleted

##### deleteWithBinaryHash()

```ts
deleteWithBinaryHash(organization, binaryHash): Promise<RokkaResponse>;
```

Delete source images by its binary hash.

```js
await rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `binaryHash` | `string` | Binary image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the images are deleted

##### download()

```ts
download(organization, hash): Promise<RokkaDownloadResponse>;
```

Download image by hash, returns a Stream

```js
const result = await rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaDownloadResponse`\>

Promise resolving to a download stream

##### downloadAsBuffer()

```ts
downloadAsBuffer(organization, hash): Promise<RokkaDownloadAsBufferResponse>;
```

Download image by hash, returns a Buffer

```js
const result = await rokka.sourceimages.downloadAsBuffer('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaDownloadAsBufferResponse`\>

Promise resolving to a buffer

##### downloadList()

```ts
downloadList(organization, params): Promise<RokkaDownloadResponse>;
```

Get a list of source images as zip. Same parameters as the `list` method

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `params` | [`SearchQueryParams`](#searchqueryparams) | Query string params (limit, offset, sort and search) |

###### Returns

`Promise`\<`RokkaDownloadResponse`\>

Promise resolving to a download stream

###### Example

```js
const search = {
  'user:int:id': '42',
  'height': '64'
}
const result = await rokka.sourceimages.downloadList('myorg', { search: search })
```

##### get()

```ts
get(
   organization, 
   hash, 
queryParams): Promise<RokkaResponse>;
```

Get information of a source image by hash.

```js
const result = await rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `queryParams` | `GetQueryParams` | Query params like {deleted: true} |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the source image

##### getWithBinaryHash()

```ts
getWithBinaryHash(organization, binaryHash): Promise<RokkaResponse>;
```

Get information of a source image by its binary hash.

```js
const result = await rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `binaryHash` | `string` | Binary image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the source image

##### invalidateCache()

```ts
invalidateCache(organization, hash): Promise<RokkaResponse>;
```

Invalidate the CDN cache for a source image.

See [the caching documentation](https://rokka.io/documentation/references/caching.html) for more information.

```js
await rokka.sourceimages.invalidateCache('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the cache is invalidated

##### list()

```ts
list(organization, params): Promise<SourceimagesListResponse>;
```

Get a list of source images.

By default, listing sourceimages sorts them by created date descending.

Searching for images can be achieved using the `search` parameter.
Supported are predefined fields like `height`, `name` etc. but also user metadata.
If you search for user metadata, the field name has to be prefixed with `user:TYPE`.
All fields are combined with an AND. OR/NOT is not possible.

The search also supports range and wildcard queries.
Check out [the rokka documentation](https://rokka.io/documentation/references/searching-images.html) for more.

Sorting works with user metadata as well and can be passed as either an array or as a
comma separated string.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `params` | [`SearchQueryParams`](#searchqueryparams) | Query string params (limit, offset, sort and search) |

###### Returns

`Promise`\<[`SourceimagesListResponse`](#sourceimageslistresponse)\>

Promise resolving to the list of source images

###### Remarks

Requires authentication.

###### Examples

```js
const result = await rokka.sourceimages.list('myorg')
```

```js
const search = {
  'user:int:id': '42',
  'height': '64'
}
const result = await rokka.sourceimages.list('myorg', { search: search })
```

##### putName()

```ts
putName(
   organization, 
   hash, 
name): Promise<RokkaResponse>;
```

Change the name of a source image.

```js
const result = await rokka.sourceimages.putName('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', name)
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `name` | `string` | New name of the image |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the updated source image

##### removeSubjectArea()

```ts
removeSubjectArea(
   organization, 
   hash, 
options): Promise<RokkaResponse>;
```

Removes the subject area from a source image.

```js
await rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `options` | \{ `deletePrevious?`: `string` \| `boolean`; \} | Optional: only {deletePrevious: true/false} yet, false is default |
| `options.deletePrevious?` | `string` \| `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the subject area is removed

##### restore()

```ts
restore(organization, hash): Promise<RokkaResponse>;
```

Restore image by hash.

```js
await rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when the image is restored

##### setLocked()

```ts
setLocked(
   organization, 
   hash, 
isLocked): Promise<RokkaResponse>;
```

Set the locked status of a source image. Locked images cannot be deleted.

```js
const result = await rokka.sourceimages.setLocked('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true)
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `isLocked` | `boolean` | If image should be locked or not |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the updated source image

##### setProtected()

```ts
setProtected(
   organization, 
   hash, 
   isProtected, 
options): Promise<RokkaResponse>;
```

Set the protected status of a source image.

Important! Returns a different hash, if the protected status changes
```js
const result = await rokka.sourceimages.setProtected('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true, {
  deletePrevious: false
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `isProtected` | `boolean` | If image should be protected or not |
| `options` | \{ `deletePrevious?`: `string` \| `boolean`; \} | Optional: only {deletePrevious: true/false} yet, false is default |
| `options.deletePrevious?` | `string` \| `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the updated source image

##### setSubjectArea()

```ts
setSubjectArea(
   organization, 
   hash, 
   coords, 
options): Promise<RokkaResponse>;
```

Set the subject area of a source image.

The [subject area of an image](https://rokka.io/documentation/references/dynamic-metadata.html#subject-area) is
used when applying the [crop operation](https://rokka.io/documentation/references/operations.html#crop) with the
`auto` anchor to center the cropping box around the subject area.

```js
const result = await rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  x: 100,
  y: 100,
  width: 50,
  height: 50
}, {
  deletePrevious: false
})
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `coords` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | x, y starting from top left |
| `coords.height` | `number` | - |
| `coords.width` | `number` | - |
| `coords.x` | `number` | - |
| `coords.y` | `number` | - |
| `options` | \{ `deletePrevious?`: `string` \| `boolean`; \} | Optional: only {deletePrevious: true/false} yet, false is default |
| `options.deletePrevious?` | `string` \| `boolean` | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the updated source image

## Interfaces

### MetaDataDynamic

#### Indexable

```ts
[key: string]: 
  | {
[key: string]: any;
}
  | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="crop_area"></a> `crop_area?` | `object` |
| `crop_area.height` | `number` |
| `crop_area.width` | `number` |
| `crop_area.x` | `number` |
| `crop_area.y` | `number` |
| <a id="subject_area"></a> `subject_area?` | `object` |
| `subject_area.height?` | `number` |
| `subject_area.width?` | `number` |
| `subject_area.x` | `number` |
| `subject_area.y` | `number` |
| <a id="version"></a> `version?` | `object` |
| `version.text` | `string` |

***

### MetaDataOptions

#### Indexable

```ts
[key: string]: any
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="protected"></a> `protected?` | `boolean` |
| <a id="visual_binaryhash"></a> `visual_binaryhash?` | `boolean` |

***

### MetaDataUser

#### Indexable

```ts
[key: string]: string | number | boolean | string[]
```

***

### MetaStatic

#### Indexable

```ts
[key: string]: object
```

***

### SearchQueryParams

#### Indexable

```ts
[key: string]: any
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="deleted"></a> `deleted?` | `boolean` \| `null` |
| <a id="facets"></a> `facets?` | `string` \| `null` |
| <a id="limit"></a> `limit?` | `number` \| `null` |
| <a id="offset"></a> `offset?` | `string` \| `number` \| `null` |
| <a id="search"></a> `search?` | \| \{ \[`key`: `string`\]: `string`; \} \| `null` |
| <a id="sort"></a> `sort?` | `string` \| `string`[] \| `null` |

***

### Sourceimage

#### Indexable

```ts
[key: string]: 
  | string
  | number
  | boolean
  | MetaDataUser
  | MetaDataDynamic
  | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="binary_hash"></a> `binary_hash` | `string` |
| <a id="created"></a> `created` | `string` |
| <a id="deleted-1"></a> `deleted?` | `boolean` |
| <a id="dynamic_metadata"></a> `dynamic_metadata?` | [`MetaDataDynamic`](#metadatadynamic) |
| <a id="format"></a> `format` | `string` |
| <a id="hash"></a> `hash` | `string` |
| <a id="height"></a> `height` | `number` |
| <a id="link"></a> `link` | `string` |
| <a id="mimetype"></a> `mimetype` | `string` |
| <a id="name"></a> `name` | `string` |
| <a id="opaque"></a> `opaque?` | `boolean` |
| <a id="organization"></a> `organization` | `string` |
| <a id="protected-1"></a> `protected?` | `boolean` |
| <a id="short_hash"></a> `short_hash` | `string` |
| <a id="size"></a> `size` | `number` |
| <a id="static_metadata"></a> `static_metadata?` | `any` |
| <a id="user_metadata"></a> `user_metadata?` | [`MetaDataUser`](#metadatauser) |
| <a id="width"></a> `width` | `number` |

***

### SourceimageResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body"></a> `body` | [`Sourceimage`](#sourceimage) | `RokkaResponse.body` | - |
| <a id="error"></a> `error?` | `any` | - | `RokkaResponse.error` |
| <a id="message"></a> `message?` | `string` | - | `RokkaResponse.message` |
| <a id="response"></a> `response` | `Response` | - | `RokkaResponse.response` |
| <a id="statuscode"></a> `statusCode` | `number` | - | `RokkaResponse.statusCode` |
| <a id="statusmessage"></a> `statusMessage` | `string` | - | `RokkaResponse.statusMessage` |

***

### SourceimagesListResponse

#### Extends

- `RokkaListResponse`

#### Properties

| Property | Type | Overrides | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="body-1"></a> `body` | [`SourceimagesListResponseBody`](#sourceimageslistresponsebody-1) | `RokkaListResponse.body` | - |
| <a id="error-1"></a> `error?` | `any` | - | `RokkaListResponse.error` |
| <a id="message-1"></a> `message?` | `string` | - | `RokkaListResponse.message` |
| <a id="response-1"></a> `response` | `Response` | - | `RokkaListResponse.response` |
| <a id="statuscode-1"></a> `statusCode` | `number` | - | `RokkaListResponse.statusCode` |
| <a id="statusmessage-1"></a> `statusMessage` | `string` | - | `RokkaListResponse.statusMessage` |

***

### SourceimagesListResponseBody

#### Extends

- `RokkaListResponseBody`

#### Properties

| Property | Type | Overrides |
| ------ | ------ | ------ |
| <a id="cursor"></a> `cursor` | `string` | `RokkaListResponseBody.cursor` |
| <a id="items"></a> `items` | [`Sourceimage`](#sourceimage)[] | `RokkaListResponseBody.items` |
| <a id="links"></a> `links` | `object` | `RokkaListResponseBody.links` |
| `links.next?` | `object` | - |
| `links.next.href` | `string` | - |
| `links.prev?` | `object` | - |
| `links.prev.href` | `string` | - |
| <a id="total"></a> `total` | `number` | `RokkaListResponseBody.total` |

## Type Aliases

### APISourceimages

```ts
type APISourceimages = SourceimagesApi;
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
| `sourceimages` | [`SourceimagesApi`](#sourceimagesapi) |

## References

### APISourceimagesAlias

Re-exports [APISourceimagesAlias](sourceimages.alias.md#apisourceimagesalias)

***

### APISourceimagesMeta

Re-exports [APISourceimagesMeta](sourceimages.meta.md#apisourceimagesmeta)
