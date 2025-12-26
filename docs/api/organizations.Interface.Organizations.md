# Interface: Organizations

## Properties

### OPTION\_PROTECT\_DYNAMIC\_STACK

```ts
OPTION_PROTECT_DYNAMIC_STACK: string;
```

## Methods

### create()

```ts
create(
   name, 
   billingEmail, 
displayName): Promise<RokkaResponse>;
```

#### Parameters

##### name

`string`

##### billingEmail

`string`

##### displayName

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get(name): Promise<RokkaResponse>;
```

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### setOption()

```ts
setOption(
   organizationName, 
   name, 
value): Promise<RokkaResponse>;
```

#### Parameters

##### organizationName

`string`

##### name

`string`

##### value

`string` | `boolean`

#### Returns

`Promise`\<`RokkaResponse`\>
