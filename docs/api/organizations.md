# organizations

### Organizations

## Classes

### OrganizationsApi

#### Constructors

##### Constructor

```ts
new OrganizationsApi(state): OrganizationsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`OrganizationsApi`](#organizationsapi)

#### Properties

| Property | Modifier | Type | Default value |
| ------ | ------ | ------ | ------ |
| <a id="option_protect_dynamic_stack"></a> `OPTION_PROTECT_DYNAMIC_STACK` | `readonly` | `"protect_dynamic_stack"` | `'protect_dynamic_stack'` |

#### Methods

##### create()

```ts
create(
   name, 
   billingEmail, 
displayName): Promise<RokkaResponse>;
```

Create an organization.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Organization name |
| `billingEmail` | `string` | Email used for billing |
| `displayName` | `string` | Pretty name for the organization |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to the created organization

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
```

##### get()

```ts
get(name): Promise<RokkaResponse>;
```

Get a list of organizations.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Organization name |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to organization details

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.organizations.get('myorg')
```

##### setOption()

```ts
setOption(
   organizationName, 
   name, 
value): Promise<RokkaResponse>;
```

Set a single organization option.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organizationName` | `string` | Organization name |
| `name` | `string` | Option name |
| `value` | `string` \| `boolean` | Option value |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when option is set

###### Remarks

Requires authentication.

##### setOptions()

```ts
setOptions(organizationName, options): Promise<RokkaResponse>;
```

Update multiple organization options at once.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organizationName` | `string` | Organization name |
| `options` | `Record`\<`string`, `boolean` \| `string`\> | Object with option names as keys and their values |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving when options are updated

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.organizations.setOptions('myorg', {
  protect_dynamic_stack: true,
  remote_basepath: 'https://example.com'
})
```

## Type Aliases

### Organizations

```ts
type Organizations = OrganizationsApi;
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
| `organizations` | [`OrganizationsApi`](#organizationsapi) |
