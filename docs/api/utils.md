# utils

### Utils

## Interfaces

### SignUrlOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="rounddateupto"></a> `roundDateUpTo?` | `number` | Round the expiration date up to this many seconds (for better caching) |

***

### Utils

#### Methods

##### signUrl()

```ts
signUrl(
   organization, 
   url, 
options?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `url` | `string` |
| `options?` | [`SignUrlOptions`](#signurloptions) |

###### Returns

`Promise`\<`RokkaResponse`\>

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
| `utils` | [`Utils`](#utils) |
