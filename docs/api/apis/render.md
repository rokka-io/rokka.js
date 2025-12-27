# apis/render

## Interfaces

### Render

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="addstackvariables"></a> `addStackVariables` | `AddStackVariablesType` |
| <a id="geturlcomponents"></a> `getUrlComponents` | `GetUrlComponentsType` |
| <a id="imagesbyalbum"></a> `imagesByAlbum` | (`organization`, `album`, `options?`) => `Promise`\<`RokkaResponse`\> |
| <a id="signurl"></a> `signUrl` | [`SignUrlType`](#signurltype) |
| <a id="signurlwithoptions"></a> `signUrlWithOptions` | `SignUrlWithOptionsType` |

#### Methods

##### getUrl()

```ts
getUrl(
   organization, 
   hash, 
   format, 
   stack, 
   options?): string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `hash` | `string` |
| `format` | `string` |
| `stack` | `string` \| `object` |
| `options?` | `GetUrlOptions` |

###### Returns

`string`

##### getUrlFromUrl()

```ts
getUrlFromUrl(
   rokkaUrl, 
   stack, 
   options?): string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `rokkaUrl` | `string` |
| `stack` | `string` \| `object` |
| `options?` | `GetUrlFromUrlOptions` |

###### Returns

`string`

***

### SignUrlOptions

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="rounddateupto"></a> `roundDateUpTo?` | `number` |
| <a id="until"></a> `until?` | `Date` \| `null` |

## Type Aliases

### SignUrlType()

```ts
type SignUrlType = (url, signKey, options?) => string;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `signKey` | `string` |
| `options?` | [`SignUrlOptions`](#signurloptions) |

#### Returns

`string`

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
| `render` | [`Render`](#render) |
