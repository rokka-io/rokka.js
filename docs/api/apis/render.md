# apis/render

## Classes

### RenderApi

#### Constructors

##### Constructor

```ts
new RenderApi(state): RenderApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](../index.md#state) |

###### Returns

[`RenderApi`](#renderapi)

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="property-addstackvariables"></a> `addStackVariables` | `AddStackVariablesType` | `undefined` | Adds stack variables to a rokka URL in a safe way Uses the v query parameter, if a variable shouldn't be in the path If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js) **Param** The URL the stack variables are added to **Param** The variables to add **Param** If true, removes some safe characters from the query |
| <a id="property-geturlcomponents"></a> `getUrlComponents` | `GetUrlComponentsType` | `getUrlComponents` | Get rokka components from an URL object. Returns false, if it could not parse it as rokka URL. **Param** The URL object to parse |
| <a id="property-signurl"></a> `signUrl` | [`SignUrlType`](#signurltype) | `undefined` | Signs a Rokka URL with an option valid until date. It also rounds up the date to the next 5 minutes (300 seconds) to improve CDN caching, can be changed **Param** The URL to be signed **Param** The organization's sign key **Param** Optional options. until: Valid until date, roundDateUpTo: For improved caching, the date can be rounded up by so many seconds (default: 300) |
| <a id="property-signurlwithoptions"></a> `signUrlWithOptions` | `SignUrlWithOptionsType` | `undefined` | Signs a rokka URL with a sign key and optional signature options. **Param** The URL to be signed **Param** The organization's sign key **Param** Optional signature options |

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

Get URL for rendering an image.

If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `hash` | `string` | Image hash |
| `format` | `string` | Image format: `jpg`, `png` or `gif` |
| `stack` | `string` \| `object` | Optional stack name or an array of stack operation objects |
| `options?` | `GetUrlOptions` | Optional. filename: Adds the filename to the URL, stackoptions: Adds stackoptions to the URL |

###### Returns

`string`

The render URL

###### Example

```js
rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
```

##### getUrlFromUrl()

```ts
getUrlFromUrl(
   rokkaUrl, 
   stack, 
   options?): string;
```

Get URL for rendering an image from a rokka render URL.

If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rokkaUrl` | `string` | Rokka render URL |
| `stack` | `string` \| `object` | Stack name or an array of stack operation objects |
| `options` | `GetUrlFromUrlOptions` | Optional. filename: Adds or changes the filename to the URL, stackoptions: Adds stackoptions to the URL, format: Changes the format |

###### Returns

`string`

The render URL

###### Example

```js
rokka.render.getUrlFromUrl('https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png', 'mystack')
```

##### imagesByAlbum()

```ts
imagesByAlbum(
   organization, 
   album, 
options?): Promise<RokkaResponse>;
```

Get image hashes and some other info belonging to a album (from metadata: user:array:albums)

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `album` | `string` | Album name |
| `options?` | `ImagesByAlbumOptions` | Optional options |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to album images

###### Example

```js
rokka.render.imagesByAlbum('myorg', 'Albumname', { favorites })
```

## Interfaces

### SignUrlOptions

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="property-rounddateupto"></a> `roundDateUpTo?` | `number` |
| <a id="property-until"></a> `until?` | `Date` \| `null` |

## Type Aliases

### Render

```ts
type Render = RenderApi;
```

***

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
| `render` | [`RenderApi`](#renderapi) |
