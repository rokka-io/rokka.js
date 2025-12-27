# operations

### Operations

#### Available operations

- `rokka.operations.resize(width, height, options = {})`
- `rokka.operations.autorotate(options = {})`
- `rokka.operations.rotate(angle, options = {})`
- `rokka.operations.dropshadow(options = {})`
- `rokka.operations.trim(options = {})`
- `rokka.operations.crop(width, height, options = {})`
- `rokka.operations.noop()`
- `rokka.operations.composition(width, height, mode, options = {})`
- `rokka.operations.blur(sigma, radius)`

Please refer to the
[rokka API documentation](https://rokka.io/documentation/references/operations.html)

## Enumerations

### CompositionMode

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="background"></a> `Background` | `"background"` |
| <a id="foreground"></a> `Foreground` | `"foreground"` |

***

### ResizeMode

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="absolute"></a> `Absolute` | `"absolute"` |
| <a id="box"></a> `Box` | `"box"` |
| <a id="fill"></a> `Fill` | `"fill"` |

## Classes

### OperationsApi

#### Indexable

```ts
[key: string]: any
```

#### Constructors

##### Constructor

```ts
new OperationsApi(state): OperationsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`OperationsApi`](#operationsapi)

#### Methods

##### autorotate()

```ts
autorotate(options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`StackOperationOptions`](#stackoperationoptions) \| `undefined` |

###### Returns

`StackOperation`

##### blur()

```ts
blur(sigma, radius?): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `sigma` | `number` |
| `radius?` | `number` |

###### Returns

`StackOperation`

##### composition()

```ts
composition(
   width, 
   height, 
   mode, 
   options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |
| `mode` | `string` |
| `options` | [`StackOperationOptions`](#stackoperationoptions) |

###### Returns

`StackOperation`

##### crop()

```ts
crop(
   width, 
   height, 
   options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |
| `options` | [`CropOperationsOptions`](#cropoperationsoptions) |

###### Returns

`StackOperation`

##### dropshadow()

```ts
dropshadow(options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`StackOperationOptions`](#stackoperationoptions) |

###### Returns

`StackOperation`

##### list()

```ts
list(): Promise<RokkaResponse>;
```

Get a list of available stack operations.

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the list of operations

###### Example

```js
const result = await rokka.operations.list()
```

##### noop()

```ts
noop(): StackOperation;
```

###### Returns

`StackOperation`

##### resize()

```ts
resize(
   width, 
   height, 
   options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |
| `options` | [`ResizeOperationsOptions`](#resizeoperationsoptions) |

###### Returns

`StackOperation`

##### rotate()

```ts
rotate(angle, options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `angle` | `number` |
| `options` | [`StackOperationOptions`](#stackoperationoptions) |

###### Returns

`StackOperation`

##### trim()

```ts
trim(options): StackOperation;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`StackOperationOptions`](#stackoperationoptions) |

###### Returns

`StackOperation`

## Interfaces

### CompositionOperationsOptions

#### Extends

- [`StackOperationOptions`](#stackoperationoptions)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="anchor"></a> `anchor?` | `string` | - |
| <a id="enabled"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#enabled-3) |
| <a id="height"></a> `height?` | `number` | - |
| <a id="mode"></a> `mode?` | [`CompositionMode`](#compositionmode) | - |
| <a id="resize_mode"></a> `resize_mode?` | [`ResizeMode`](#resizemode) | - |
| <a id="resize_to_primary"></a> `resize_to_primary?` | `boolean` | - |
| <a id="secondary_color"></a> `secondary_color?` | `string` | - |
| <a id="secondary_image"></a> `secondary_image?` | `string` | - |
| <a id="secondary_opacity"></a> `secondary_opacity?` | `number` | - |
| <a id="width"></a> `width?` | `number` | - |

***

### CropOperationsOptions

#### Extends

- [`StackOperationOptions`](#stackoperationoptions)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="anchor-1"></a> `anchor?` | `string` | - |
| <a id="area"></a> `area?` | `string` | - |
| <a id="enabled-1"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#enabled-3) |
| <a id="fallback"></a> `fallback?` | `string` | - |
| <a id="height-1"></a> `height?` | `number` | - |
| <a id="mode-1"></a> `mode?` | `string` | - |
| <a id="scale"></a> `scale?` | `number` | - |
| <a id="width-1"></a> `width?` | `number` | - |

***

### ResizeOperationsOptions

#### Extends

- [`StackOperationOptions`](#stackoperationoptions)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="enabled-2"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#enabled-3) |
| <a id="height-2"></a> `height?` | `number` | - |
| <a id="mode-2"></a> `mode?` | [`ResizeMode`](#resizemode) | - |
| <a id="upscale"></a> `upscale?` | `boolean` | - |
| <a id="upscale_dpr"></a> `upscale_dpr?` | `boolean` | - |
| <a id="width-2"></a> `width?` | `number` | - |

***

### StackOperationOptions

#### Extended by

- [`ResizeOperationsOptions`](#resizeoperationsoptions)
- [`CropOperationsOptions`](#cropoperationsoptions)
- [`CompositionOperationsOptions`](#compositionoperationsoptions)

#### Indexable

```ts
[key: string]: string | number | boolean | null | undefined
```

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="enabled-3"></a> `enabled?` | `boolean` |

## Type Aliases

### Operations

```ts
type Operations = OperationsApi;
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
| `operations` | [`OperationsApi`](#operationsapi) |
