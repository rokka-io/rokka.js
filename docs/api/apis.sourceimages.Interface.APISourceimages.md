# Interface: APISourceimages

## Properties

### addDynamicMetaData()

```ts
addDynamicMetaData: (organization, hash, name, data, options) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### name

`string`

##### data

`any`

##### options

###### deletePrevious?

`string` \| `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### alias

```ts
alias: APISourceimagesAlias;
```

***

### autodescription()

```ts
autodescription: (organization, hash, languages, force) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### languages

`string`[]

##### force

`boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### autolabel()

```ts
autolabel: (organization, hash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### copy()

```ts
copy: (organization, hash, destinationOrganization, overwrite?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### destinationOrganization

`string`

##### overwrite?

`boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### copyAll()

```ts
copyAll: (organization, hashes, destinationOrganization, overwrite?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hashes

`string`[]

##### destinationOrganization

`string`

##### overwrite?

`boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### create()

```ts
create: (organization, fileName, binaryData, metadata?, options?) => Promise<SourceimagesListResponse>;
```

#### Parameters

##### organization

`string`

##### fileName

`string`

##### binaryData

`any`

##### metadata?

`CreateMetadata` | `null`

##### options?

`CreateOptions`

#### Returns

`Promise`\<[`SourceimagesListResponse`](apis.sourceimages.Interface.SourceimagesListResponse.md)\>

***

### createByUrl()

```ts
createByUrl: (organization, url, metadata?, options?) => Promise<SourceimagesListResponse>;
```

#### Parameters

##### organization

`string`

##### url

`string`

##### metadata?

`CreateMetadata` | `null`

##### options?

`CreateOptions`

#### Returns

`Promise`\<[`SourceimagesListResponse`](apis.sourceimages.Interface.SourceimagesListResponse.md)\>

***

### delete()

```ts
delete: (organization, hash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### deleteDynamicMetaData()

```ts
deleteDynamicMetaData: (organization, hash, name, options) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### name

`string`

##### options

###### deletePrevious?

`string` \| `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### deleteWithBinaryHash()

```ts
deleteWithBinaryHash: (organization, binaryHash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### binaryHash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### download()

```ts
download: (organization, hash) => Promise<RokkaDownloadResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaDownloadResponse`\>

***

### downloadAsBuffer()

```ts
downloadAsBuffer: (organization, hash) => Promise<RokkaDownloadAsBufferResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaDownloadAsBufferResponse`\>

***

### downloadList()

```ts
downloadList: (organization, params?) => Promise<RokkaDownloadResponse>;
```

#### Parameters

##### organization

`string`

##### params?

[`SearchQueryParams`](apis.sourceimages.Interface.SearchQueryParams.md)

#### Returns

`Promise`\<`RokkaDownloadResponse`\>

***

### get()

```ts
get: (organization, hash, queryParams?) => Promise<SourceimageResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### queryParams?

`GetQueryParams`

#### Returns

`Promise`\<[`SourceimageResponse`](apis.sourceimages.Interface.SourceimageResponse.md)\>

***

### getWithBinaryHash()

```ts
getWithBinaryHash: (organization, binaryHash) => Promise<SourceimagesListResponse>;
```

#### Parameters

##### organization

`string`

##### binaryHash

`string`

#### Returns

`Promise`\<[`SourceimagesListResponse`](apis.sourceimages.Interface.SourceimagesListResponse.md)\>

***

### invalidateCache()

```ts
invalidateCache: (organization, hash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### list()

```ts
list: (organization, params?) => Promise<SourceimagesListResponse>;
```

#### Parameters

##### organization

`string`

##### params?

[`SearchQueryParams`](apis.sourceimages.Interface.SearchQueryParams.md)

#### Returns

`Promise`\<[`SourceimagesListResponse`](apis.sourceimages.Interface.SourceimagesListResponse.md)\>

***

### meta

```ts
meta: APISourceimagesMeta;
```

***

### putName()

```ts
putName: (organization, hash, name) => Promise<RokkaListResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### name

`string`

#### Returns

`Promise`\<`RokkaListResponse`\>

***

### removeSubjectArea()

```ts
removeSubjectArea: (organization, hash, options?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### options?

###### deletePrevious?

`string` \| `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### restore()

```ts
restore: (organization, hash) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### setLocked()

```ts
setLocked: (organization, hash, isLocked) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### isLocked

`boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### setProtected()

```ts
setProtected: (organization, hash, isProtected, options?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### isProtected

`boolean`

##### options?

###### deletePrevious?

`string` \| `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### setSubjectArea()

```ts
setSubjectArea: (organization, hash, coords, options?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### coords

###### height

`number`

###### width

`number`

###### x

`number`

###### y

`number`

##### options?

###### deletePrevious?

`string` \| `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>
