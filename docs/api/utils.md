# utils

### Utils

## Classes

### UtilsApi

#### Constructors

##### Constructor

```ts
new UtilsApi(state): UtilsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`UtilsApi`](#utilsapi)

#### Methods

##### signUrl()

```ts
signUrl(
   organization, 
   url, 
options?): Promise<RokkaResponse>;
```

Sign a URL using the server-side signing endpoint.

This is useful when you don't have access to the signing key on the client side
but want to generate signed URLs.

See [the signing URLs documentation](https://rokka.io/documentation/references/signing-urls.html)
for more information.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `url` | `string` | The URL to sign |
| `options` | [`SignUrlOptions`](#signurloptions) | Optional signing options |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the signed URL response

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.utils.signUrl('myorg', 'https://myorg.rokka.io/dynamic/abc123.jpg')
console.log(result.body.signed_url)
```

## Interfaces

### SignUrlOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-rounddateupto"></a> `roundDateUpTo?` | `number` | Round the expiration date up to this many seconds (for better caching) |

## Type Aliases

### Utils

```ts
type Utils = UtilsApi;
```

## Variables

### default()

```ts
default: (state) => object;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

#### Returns

`object`

| Name | Type |
| ------ | ------ |
| `utils` | [`UtilsApi`](#utilsapi) |
