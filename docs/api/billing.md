# billing

### Billing

## Classes

### BillingApi

#### Constructors

##### Constructor

```ts
new BillingApi(state): BillingApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`BillingApi`](#billingapi)

#### Methods

##### get()

```ts
get(
   organization, 
   from?, 
to?): Promise<RokkaResponse>;
```

Retrieve statistics about the billing of an organization

If `from` and `to` are not specified, the API will return data for the last 30 days.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `organization` | `string` | Organization name |
| `from?` | `string` | Start date in format YYYY-MM-DD |
| `to?` | `string` | End date in format YYYY-MM-DD |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to billing statistics

###### Example

```js
const result = await rokka.billing.get('myorg', '2017-01-01', '2017-01-31')
```

## Type Aliases

### Billing

```ts
type Billing = BillingApi;
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
| `billing` | [`BillingApi`](#billingapi) |
