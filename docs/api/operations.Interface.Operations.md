# Interface: Operations

## Indexable

```ts
[key: string]: Function
```

## Methods

### autorotate()

```ts
autorotate(options?): StackOperation;
```

#### Parameters

##### options?

[`StackOperationOptions`](operations.Interface.StackOperationOptions.md)

#### Returns

`StackOperation`

***

### blur()

```ts
blur(sigma, radius?): StackOperation;
```

#### Parameters

##### sigma

`number`

##### radius?

`number`

#### Returns

`StackOperation`

***

### composition()

```ts
composition(
   width, 
   height, 
   mode, 
   options?): StackOperation;
```

#### Parameters

##### width

`number`

##### height

`number`

##### mode

`string`

##### options?

[`CompositionOperationsOptions`](operations.Interface.CompositionOperationsOptions.md)

#### Returns

`StackOperation`

***

### crop()

```ts
crop(
   width, 
   height, 
   options?): StackOperation;
```

#### Parameters

##### width

`number`

##### height

`number`

##### options?

[`CropOperationsOptions`](operations.Interface.CropOperationsOptions.md)

#### Returns

`StackOperation`

***

### dropshadow()

```ts
dropshadow(options?): StackOperation;
```

#### Parameters

##### options?

[`StackOperationOptions`](operations.Interface.StackOperationOptions.md)

#### Returns

`StackOperation`

***

### list()

```ts
list(): Promise<RokkaResponse>;
```

#### Returns

`Promise`\<`RokkaResponse`\>

***

### noop()

```ts
noop(): StackOperation;
```

#### Returns

`StackOperation`

***

### resize()

```ts
resize(
   width, 
   height, 
   options?): StackOperation;
```

#### Parameters

##### width

`number`

##### height

`number`

##### options?

[`ResizeOperationsOptions`](operations.Interface.ResizeOperationsOptions.md)

#### Returns

`StackOperation`

***

### rotate()

```ts
rotate(angle, options?): StackOperation;
```

#### Parameters

##### angle

`number`

##### options?

[`StackOperationOptions`](operations.Interface.StackOperationOptions.md)

#### Returns

`StackOperation`

***

### trim()

```ts
trim(options?): StackOperation;
```

#### Parameters

##### options?

[`StackOperationOptions`](operations.Interface.StackOperationOptions.md)

#### Returns

`StackOperation`
