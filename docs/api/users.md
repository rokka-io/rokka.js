# users

### Users

## Interfaces

### Users

#### Methods

##### create()

```ts
create(email, organization): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `email` | `string` |
| `organization` | `string` \| `null` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### getId()

```ts
getId(): Promise<string>;
```

###### Returns

`Promise`\<`string`\>

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
| `users` | [`Users`](#users) |
