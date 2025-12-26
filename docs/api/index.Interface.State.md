# Interface: State

## Properties

### apiHost

```ts
apiHost: string;
```

***

### apiKey

```ts
apiKey: string | undefined;
```

***

### apiTokenGetCallback?

```ts
optional apiTokenGetCallback: ApiTokenGetCallback;
```

***

### apiTokenOptions?

```ts
optional apiTokenOptions: 
  | RequestQueryParamsNewToken
  | null;
```

***

### apiTokenPayload

```ts
apiTokenPayload: ApiTokenPayload | null;
```

***

### apiTokenRefreshTime

```ts
apiTokenRefreshTime: number;
```

***

### apiTokenSetCallback?

```ts
optional apiTokenSetCallback: ApiTokenSetCallback;
```

***

### apiVersion

```ts
apiVersion: string | number;
```

***

### renderHost

```ts
renderHost: string;
```

***

### transportOptions

```ts
transportOptions: any;
```

## Methods

### request()

```ts
request(
   method, 
   path, 
   payload?, 
   queryParams?, 
options?): Promise<RokkaResponse>;
```

#### Parameters

##### method

`string`

##### path

`string`

##### payload?

`any`

##### queryParams?

[`RequestQueryParams`](index.Interface.RequestQueryParams.md) | `null`

##### options?

`RequestOptions` | `null`

#### Returns

`Promise`\<`RokkaResponse`\>
