# stacks

### Stacks

## Classes

### StacksApi

#### Constructors

##### Constructor

```ts
new StacksApi(state): StacksApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`StacksApi`](#stacksapi)

#### Methods

##### create()

```ts
create(
   organization, 
   name, 
   stackConfig, 
   params, ...
rest): Promise<RokkaResponse>;
```

Create a new stack.

The signature of this method changed in 0.27.

Using a single stack operation object (without an enclosing array) as the 3rd parameter (stackConfig) is
since version 0.27.0 not supported anymore.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `name` | `string` | Stack name |
| `stackConfig` | [`StackConfig`](#stackconfig) \| `StackOperation`[] | Object with the stack config of stack operations, options and expressions |
| `params` | \| `StackOptions` \| \{ `overwrite?`: `boolean`; \} | Query params, only overwrite is currently supported |
| ...`rest` | `boolean`[] | - |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the created stack

###### Remarks

Requires authentication.

###### Example

```js
const operations = [
  rokka.operations.rotate(45),
  rokka.operations.resize(100, 100)
]

// stack options are optional
const options = {
  'jpg.quality': 80,
  'webp.quality': 80
}

// stack expressions are optional
const expressions = [
  rokka.expressions.default('options.dpr > 2', { 'jpg.quality': 60, 'webp.quality': 60 })
]

// query params are optional
const queryParams = { overwrite: true }
const result = await rokka.stacks.create(
  'test',
  'mystack',
  { operations, options, expressions },
  queryParams
)
```

##### delete()

```ts
delete(organization, name): Promise<RokkaResponse>;
```

Delete a stack.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `name` | `string` | Stack name |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when stack is deleted

###### Remarks

Requires authentication.

###### Example

```js
await rokka.stacks.delete('myorg', 'mystack')
```

##### get()

```ts
get(organization, name): Promise<RokkaResponse>;
```

Get details about a stack.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `name` | `string` | Stack name |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to stack details

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.stacks.get('myorg', 'mystack')
```

##### invalidateCache()

```ts
invalidateCache(organization, name): Promise<RokkaResponse>;
```

Invalidate the CDN cache for a stack.

See [the caching documentation](https://rokka.io/documentation/references/caching.html)
for more information.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `name` | `string` | Stack name |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when cache is invalidated

###### Remarks

Requires authentication.

###### Example

```js
await rokka.stacks.invalidateCache('myorg', 'mystack')
```

##### list()

```ts
list(
   organization, 
   limit, 
offset): Promise<RokkaResponse>;
```

Get a list of available stacks.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `limit` | `number` \| `null` | `null` | Maximum number of stacks to return |
| `offset` | `string` \| `null` | `null` | Cursor for pagination |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the list of stacks

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.stacks.list('myorg')
```

## Interfaces

### StackConfig

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="expressions"></a> `expressions?` | `Expression`[] |
| <a id="operations"></a> `operations?` | `StackOperation`[] |
| <a id="options"></a> `options?` | `StackOptions` |
| <a id="variables"></a> `variables?` | `Variables` |

## Type Aliases

### Stacks

```ts
type Stacks = StacksApi;
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
| `stacks` | [`StacksApi`](#stacksapi) |
