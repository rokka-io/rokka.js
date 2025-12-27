# stats

### Stats

## Interfaces

### Stats

#### Methods

##### get()

```ts
get(
   organization, 
   from?, 
to?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `from?` | `string` \| `null` |
| `to?` | `string` \| `null` |

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
| `stats` | [`Stats`](#stats) |
