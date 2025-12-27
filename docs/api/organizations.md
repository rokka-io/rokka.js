# organizations

### Organizations

## Interfaces

### Organizations

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="option_protect_dynamic_stack"></a> `OPTION_PROTECT_DYNAMIC_STACK` | `string` |

#### Methods

##### create()

```ts
create(
   name, 
   billingEmail, 
displayName): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `billingEmail` | `string` |
| `displayName` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(name): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### setOption()

```ts
setOption(
   organizationName, 
   name, 
value): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organizationName` | `string` |
| `name` | `string` |
| `value` | `string` \| `boolean` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### setOptions()

```ts
setOptions(organizationName, options): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organizationName` | `string` |
| `options` | `Record`\<`string`, `boolean` \| `string`\> |

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
| `organizations` | [`Organizations`](#organizations) |
