# Interface: Stacks

## Methods

### create()

```ts
create(
   organization, 
   name, 
   stackConfig, 
   params?, ...
rest?): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### name

`string`

##### stackConfig

[`StackConfig`](stacks.Interface.StackConfig.md) | `StackOperation`[]

##### params?

`StackOptions` | \{
`overwrite?`: `boolean`;
\}

##### rest?

...`boolean`[]

#### Returns

`Promise`\<`RokkaResponse`\>

***

### delete()

```ts
delete(organization, name): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### name

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### get()

```ts
get(organization, name): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### name

`string`

#### Returns

`Promise`\<`RokkaResponse`\>

***

### list()

```ts
list(
   organization, 
   limit?, 
offset?): Promise<RokkaResponse>;
```

#### Parameters

##### organization

`string`

##### limit?

`number` | `null`

##### offset?

`string` | `null`

#### Returns

`Promise`\<`RokkaResponse`\>
