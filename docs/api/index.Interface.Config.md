# Interface: Config

## Properties

### apiHost?

```ts
optional apiHost: string;
```

***

### apiKey?

```ts
optional apiKey: string;
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

### apiTokenRefreshTime?

```ts
optional apiTokenRefreshTime: number;
```

***

### apiTokenSetCallback?

```ts
optional apiTokenSetCallback: ApiTokenSetCallback;
```

***

### apiVersion?

```ts
optional apiVersion: string | number;
```

***

### debug?

```ts
optional debug: boolean;
```

***

### renderHost?

```ts
optional renderHost: string;
```

***

### transport?

```ts
optional transport: object;
```

#### agent?

```ts
optional agent: any;
```

#### maxTimeout?

```ts
optional maxTimeout: number;
```

#### minTimeout?

```ts
optional minTimeout: number;
```

#### randomize?

```ts
optional randomize: boolean;
```

#### requestTimeout?

```ts
optional requestTimeout: number;
```

#### retries?

```ts
optional retries: number;
```
