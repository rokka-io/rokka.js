# stackoptions

### Stack options

## Classes

### StackOptionsApi

#### Constructors

##### Constructor

```ts
new StackOptionsApi(state): StackOptionsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`StackOptionsApi`](#stackoptionsapi)

#### Methods

##### get()

```ts
get(): Promise<RokkaResponse>;
```

Returns a json-schema like definition of options which can be set on a stack.

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to stack options schema

###### Example

```js
const result = await rokka.stackoptions.get()
```

## Type Aliases

### StackOptions

```ts
type StackOptions = StackOptionsApi;
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
| `stackoptions` | [`StackOptionsApi`](#stackoptionsapi) |
