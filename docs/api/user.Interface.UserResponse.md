# Interface: UserResponse

## Extends

- `RokkaResponse`

## Properties

### body

```ts
body: object;
```

#### api\_keys

```ts
api_keys: UserApiKey[];
```

#### email?

```ts
optional email: string;
```

#### user\_id

```ts
user_id: string;
```

#### Overrides

```ts
RokkaResponse.body
```

***

### error?

```ts
optional error: any;
```

#### Inherited from

```ts
RokkaResponse.error
```

***

### message?

```ts
optional message: string;
```

#### Inherited from

```ts
RokkaResponse.message
```

***

### response

```ts
response: Response;
```

#### Inherited from

```ts
RokkaResponse.response
```

***

### statusCode

```ts
statusCode: number;
```

#### Inherited from

```ts
RokkaResponse.statusCode
```

***

### statusMessage

```ts
statusMessage: string;
```

#### Inherited from

```ts
RokkaResponse.statusMessage
```
