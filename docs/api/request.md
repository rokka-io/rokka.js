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

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

#### Returns

`object`

| Name | Type |
| ------ | ------ |
| `request` | [`Request`](#request) |
