# request

### request

## Interfaces

### Request()

```ts
Request(
   path, 
   method?, 
body?): Promise<RokkaResponse>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | `string` |
| `method?` | `string` |
| `body?` | `any` |

#### Returns

`Promise`\<`RokkaResponse`\>

## Variables

### default()

```ts
default: (state) => object;
```

Creates a request function for direct API access.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `state` | [`State`](index.md#state) | The Rokka state object |

#### Returns

`object`

A request function

| Name | Type |
| ------ | ------ |
| `request` | [`Request`](#request) |
