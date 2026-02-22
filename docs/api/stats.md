# stats

### Stats

## Classes

### StatsApi

#### Constructors

##### Constructor

```ts
new StatsApi(state): StatsApi;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`State`](index.md#state) |

###### Returns

[`StatsApi`](#statsapi)

#### Methods

##### get()

```ts
get(
   organization, 
   from?, 
to?): Promise<RokkaResponse>;
```

Retrieve statistics about an organization.

If `from` and `to` are not specified, the API will return data for the last 30 days.

###### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `organization` | `string` | `undefined` | Organization name |
| `from` | `string` \| `null` | `null` | Start date in format YYYY-MM-DD |
| `to` | `string` \| `null` | `null` | End date in format YYYY-MM-DD |

###### Returns

`Promise`\<`RokkaResponse`\>

Promise resolving to organization statistics

###### Example

```js
const result = await rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
```

## Type Aliases

### Stats

```ts
type Stats = StatsApi;
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
| `stats` | [`StatsApi`](#statsapi) |
