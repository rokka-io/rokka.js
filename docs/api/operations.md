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
| <a id="enumeration-member-background"></a> `Background` | `"background"` |
| <a id="enumeration-member-foreground"></a> `Foreground` | `"foreground"` |

***

### ResizeMode

#### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="enumeration-member-absolute"></a> `Absolute` | `"absolute"` |
| <a id="enumeration-member-box"></a> `Box` | `"box"` |
| <a id="enumeration-member-fill"></a> `Fill` | `"fill"` |

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
autorotate(options?): StackOperation;
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
   options?): StackOperation;
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
   options?): StackOperation;
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
dropshadow(options?): StackOperation;
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
   options?): StackOperation;
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
rotate(angle, options?): StackOperation;
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
trim(options?): StackOperation;
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
| <a id="property-anchor"></a> `anchor?` | `string` | - |
| <a id="property-enabled"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#property-enabled-3) |
| <a id="property-height"></a> `height?` | `number` | - |
| <a id="property-mode"></a> `mode?` | [`CompositionMode`](#compositionmode) | - |
| <a id="property-resize_mode"></a> `resize_mode?` | [`ResizeMode`](#resizemode) | - |
| <a id="property-resize_to_primary"></a> `resize_to_primary?` | `boolean` | - |
| <a id="property-secondary_color"></a> `secondary_color?` | `string` | - |
| <a id="property-secondary_image"></a> `secondary_image?` | `string` | - |
| <a id="property-secondary_opacity"></a> `secondary_opacity?` | `number` | - |
| <a id="property-width"></a> `width?` | `number` | - |

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
| <a id="property-anchor-1"></a> `anchor?` | `string` | - |
| <a id="property-area"></a> `area?` | `string` | - |
| <a id="property-enabled-1"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#property-enabled-3) |
| <a id="property-fallback"></a> `fallback?` | `string` | - |
| <a id="property-height-1"></a> `height?` | `number` | - |
| <a id="property-mode-1"></a> `mode?` | `string` | - |
| <a id="property-scale"></a> `scale?` | `number` | - |
| <a id="property-width-1"></a> `width?` | `number` | - |

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
| <a id="property-enabled-2"></a> `enabled?` | `boolean` | [`StackOperationOptions`](#stackoperationoptions).[`enabled`](#property-enabled-3) |
| <a id="property-height-2"></a> `height?` | `number` | - |
| <a id="property-mode-2"></a> `mode?` | [`ResizeMode`](#resizemode) | - |
| <a id="property-upscale"></a> `upscale?` | `boolean` | - |
| <a id="property-upscale_dpr"></a> `upscale_dpr?` | `boolean` | - |
| <a id="property-width-2"></a> `width?` | `number` | - |

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
| <a id="property-enabled-3"></a> `enabled?` | `boolean` |

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
