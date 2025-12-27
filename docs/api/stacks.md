# stacks

### Stacks

## Interfaces

### StackConfig

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="expressions"></a> `expressions?` | `Expression`[] |
| <a id="operations"></a> `operations?` | `StackOperation`[] |
| <a id="options"></a> `options?` | `StackOptions` |
| <a id="variables"></a> `variables?` | `Variables` |

***

### Stacks

#### Methods

##### create()

```ts
create(
   organization, 
   name, 
   stackConfig, 
   params?, ...
rest?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `name` | `string` |
| `stackConfig` | [`StackConfig`](#stackconfig) \| `StackOperation`[] |
| `params?` | \| `StackOptions` \| \{ `overwrite?`: `boolean`; \} |
| ...`rest?` | `boolean`[] |

###### Returns

`Promise`\<`RokkaResponse`\>

##### delete()

```ts
delete(organization, name): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `name` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### get()

```ts
get(organization, name): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `name` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### invalidateCache()

```ts
invalidateCache(organization, name): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `name` | `string` |

###### Returns

`Promise`\<`RokkaResponse`\>

##### list()

```ts
list(
   organization, 
   limit?, 
offset?): Promise<RokkaResponse>;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `organization` | `string` |
| `limit?` | `number` \| `null` |
| `offset?` | `string` \| `null` |

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
| `stacks` | [`Stacks`](#stacks) |
