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
| <a id="property-option_protect_dynamic_stack"></a> `OPTION_PROTECT_DYNAMIC_STACK` | `readonly` | `"protect_dynamic_stack"` | `'protect_dynamic_stack'` |

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

##### listSubOrganizations()

```ts
listSubOrganizations(organization, options?): Promise<SubOrganizationsResponse>;
```

List the sub organizations of a master organization.

Sub organizations are the ones whose usage is aggregated onto the master
organization's invoice. Needs the `admin` or `admin:read` role on the
organization. The list is sorted by name and is not paginated.

rokka doesn't support nested master organizations, so asking this on an
organization which is itself a sub organization returns an empty list.
Use the returned `master_organization` to know which organization to ask
instead.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `options` | [`SubOrganizationsOptions`](#suborganizationsoptions) | Optional `{include_disabled: true}` to also return disabled sub organizations. Super admins only, everyone else gets a 403 |

###### Returns

`Promise`\<[`SubOrganizationsResponse`](#suborganizationsresponse)\>

Promise resolving to the sub organizations

###### Remarks

Requires authentication.

###### Example

```js
const result = await rokka.organizations.listSubOrganizations('mastername')
result.body.items.forEach(org => {
  console.log(org.name, org.display_name)
})
```

###### Since

4.2.0

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

## Interfaces

### SubOrganization

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-billing_email"></a> `billing_email` | `string` | - |
| <a id="property-created"></a> `created` | `string` \| `null` | - |
| <a id="property-disabled"></a> `disabled?` | `boolean` | Only returned for super admins |
| <a id="property-display_name"></a> `display_name` | `string` | - |
| <a id="property-id"></a> `id` | `string` | UUID of the organization |
| <a id="property-name"></a> `name` | `string` | Websafe name of the organization, as used in urls |

***

### SubOrganizationsOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-include_disabled"></a> `include_disabled?` | `boolean` | Also return disabled sub organizations. Super admins only |

***

### SubOrganizationsResponse

#### Extends

- `RokkaResponse`

#### Properties

| Property | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-body"></a> `body` | `object` | - | `RokkaResponse.body` | - |
| `body.items` | [`SubOrganization`](#suborganization)[] | - | - | - |
| `body.master_organization` | `string` | The master organization of the organization which was asked for, itself if it is a master organization | - | - |
| `body.organization` | `string` | The organization which was asked for | - | - |
| `body.total` | `number` | - | - | - |
| <a id="property-error"></a> `error?` | `any` | - | - | `RokkaResponse.error` |
| <a id="property-message"></a> `message?` | `string` | - | - | `RokkaResponse.message` |
| <a id="property-response"></a> `response` | `Response` | - | - | `RokkaResponse.response` |
| <a id="property-statuscode"></a> `statusCode` | `number` | - | - | `RokkaResponse.statusCode` |
| <a id="property-statusmessage"></a> `statusMessage` | `string` | - | - | `RokkaResponse.statusMessage` |

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
