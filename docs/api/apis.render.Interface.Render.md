# Interface: Render

## Properties

### addStackVariables

```ts
addStackVariables: AddStackVariablesType;
```

***

### getUrlComponents

```ts
getUrlComponents: GetUrlComponentsType;
```

***

### imagesByAlbum()

```ts
imagesByAlbum: (organization, album, options?) => Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### album

`string`

##### options?

`ImagesByAlbumOptions`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### signUrl

```ts
signUrl: SignUrlType;
```

***

### signUrlWithOptions

```ts
signUrlWithOptions: SignUrlWithOptionsType;
```

## Methods

### getUrl()

```ts
getUrl(
   organization, 
   hash, 
   format, 
   stack, 
   options?): string;
```

#### Parameters

##### organization

`string`

##### hash

`string`

##### format

`string`

##### stack

`string` | `object`

##### options?

`GetUrlOptions`

#### Returns

`string`

***

### getUrlFromUrl()

```ts
getUrlFromUrl(
   rokkaUrl, 
   stack, 
   options?): string;
```

#### Parameters

##### rokkaUrl

`string`

##### stack

`string` | `object`

##### options?

`GetUrlFromUrlOptions`

#### Returns

`string`
