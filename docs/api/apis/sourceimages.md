# apis/sourceimages

## Interfaces

### APISourceimages

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="adddynamicmetadata"></a> `addDynamicMetaData` | (`organization`, `hash`, `name`, `data`, `options`) => `Promise`\<`RokkaResponse`\> |
| <a id="alias"></a> `alias` | [`APISourceimagesAlias`](#apisourceimagesalias-1) |
| <a id="autodescription"></a> `autodescription` | (`organization`, `hash`, `languages`, `force`) => `Promise`\<`RokkaResponse`\> |
| <a id="autolabel"></a> `autolabel` | (`organization`, `hash`) => `Promise`\<`RokkaResponse`\> |
| <a id="copy"></a> `copy` | (`organization`, `hash`, `destinationOrganization`, `overwrite?`) => `Promise`\<`RokkaResponse`\> |
| <a id="copyall"></a> `copyAll` | (`organization`, `hashes`, `destinationOrganization`, `overwrite?`) => `Promise`\<`RokkaResponse`\> |
| <a id="create"></a> `create` | (`organization`, `fileName`, `binaryData`, `metadata?`, `options?`) => `Promise`\<[`SourceimagesListResponse`](#sourceimageslistresponse)\> |
| <a id="createbyurl"></a> `createByUrl` | (`organization`, `url`, `metadata?`, `options?`) => `Promise`\<[`SourceimagesListResponse`](#sourceimageslistresponse)\> |
| <a id="delete"></a> `delete` | (`organization`, `hash`) => `Promise`\<`RokkaResponse`\> |
| <a id="deletedynamicmetadata"></a> `deleteDynamicMetaData` | (`organization`, `hash`, `name`, `options`) => `Promise`\<`RokkaResponse`\> |
| <a id="deletewithbinaryhash"></a> `deleteWithBinaryHash` | (`organization`, `binaryHash`) => `Promise`\<`RokkaResponse`\> |
| <a id="download"></a> `download` | (`organization`, `hash`) => `Promise`\<`RokkaDownloadResponse`\> |
| <a id="downloadasbuffer"></a> `downloadAsBuffer` | (`organization`, `hash`) => `Promise`\<`RokkaDownloadAsBufferResponse`\> |
| <a id="downloadlist"></a> `downloadList` | (`organization`, `params?`) => `Promise`\<`RokkaDownloadResponse`\> |
| <a id="get"></a> `get` | (`organization`, `hash`, `queryParams?`) => `Promise`\<[`SourceimageResponse`](#sourceimageresponse)\> |
| <a id="getwithbinaryhash"></a> `getWithBinaryHash` | (`organization`, `binaryHash`) => `Promise`\<[`SourceimagesListResponse`](#sourceimageslistresponse)\> |
| <a id="invalidatecache"></a> `invalidateCache` | (`organization`, `hash`) => `Promise`\<`RokkaResponse`\> |
| <a id="list"></a> `list` | (`organization`, `params?`) => `Promise`\<[`SourceimagesListResponse`](#sourceimageslistresponse)\> |
| <a id="meta"></a> `meta` | [`APISourceimagesMeta`](#apisourceimagesmeta-1) |
| <a id="putname"></a> `putName` | (`organization`, `hash`, `name`) => `Promise`\<`RokkaResponse`\> |
| <a id="removesubjectarea"></a> `removeSubjectArea` | (`organization`, `hash`, `options?`) => `Promise`\<`RokkaResponse`\> |
| <a id="restore"></a> `restore` | (`organization`, `hash`) => `Promise`\<`RokkaResponse`\> |
| <a id="setlocked"></a> `setLocked` | (`organization`, `hash`, `isLocked`) => `Promise`\<`RokkaResponse`\> |
| <a id="setprotected"></a> `setProtected` | (`organization`, `hash`, `isProtected`, `options?`) => `Promise`\<`RokkaResponse`\> |
| <a id="setsubjectarea"></a> `setSubjectArea` | (`organization`, `hash`, `coords`, `options?`) => `Promise`\<`RokkaResponse`\> |

***

### APISourceimagesAlias

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="create-1"></a> `create` | (`organization`, `alias`, `data`, `params?`) => `Promise`\<`RokkaResponse`\> |

#### Methods

##### delete()

```ts
delete(organization, alias): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `alias` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(organization, alias): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `alias` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### invalidateCache()

```ts
invalidateCache(organization, alias): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `alias` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

***

### APISourceimagesMeta

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="add"></a> `add` | (`organization`, `hash`, `data`) => `Promise`\<`RokkaResponse`\> |
| <a id="delete-3"></a> `delete` | (`organization`, `hash`, `field?`) => `Promise`\<`RokkaResponse`\> |
| <a id="get-3"></a> `get` | (`organization`, `hash`) => `Promise`\<`RokkaResponse`\> |
| <a id="replace"></a> `replace` | (`organization`, `hash`, `data`) => `Promise`\<`RokkaResponse`\> |
| <a id="set"></a> `set` | (`organization`, `hash`, `field`, `value`) => `Promise`\<`RokkaResponse`\> |

***

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
| `sourceimages` | [`APISourceimages`](#apisourceimages) |
