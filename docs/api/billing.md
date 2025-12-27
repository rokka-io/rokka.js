# billing

### Billing

## Interfaces

### Billing

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
| `from?` | `string` |
| `to?` | `string` |

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
| `billing` | [`Billing`](#billing) |
