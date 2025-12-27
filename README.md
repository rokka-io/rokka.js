
# rokka.js [![NPM version][npm-version-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage][coverage-image]][coverage-url]

JavaScript client library for [rokka](https://rokka.io/).

rokka.js runs on node as well as [within the supported browsers](http://browserl.ist/?q=%3E0.1%25%2C+not+op_mini+all).
To use in a browser, either use a script tag using [https://unpkg.com/rokka](https://unpkg.com/rokka) or import it using the ES6 module syntax:

```js
import rokka from 'rokka'
```

## Install

```bash
$ npm install rokka --save
# If using on the server side, babel-runtime is maybe needed to run it:
$ npm install babel-runtime --save
```

## Usage

```js
const rokka = require('rokka')({
  apiKey: 'apikey'
});

rokka.sourceimages.list('myorg')
  .then(function(result) {
    console.log(result);
  })
  .catch(function(err) {
    console.error(err);
  });
```

## Documentation

<!-- DOCS -->

See [full API documentation](docs/api/) for detailed reference.

### Initialization

Initializing the rokka client.

All properties are optional since certain calls don't require credentials.

```js
const rokka = require('rokka')({
  apiKey: 'apikey',                  // required for certain operations
  apiTokenGetCallback?: <() => string> // return JWT token instead of API Key
  apiTokenSetCallback?: <((token: string, payload?: object|null) => void)> // Stores a newly retrieved JWT token
  apiTokenOptions?: <object>         // The rokka.user.getNewToken query parameter options, default: {}
  apiTokenRefreshTime?: <number>     // how many seconds before the token is expiring, it should be refreshed, default: 3600
  apiHost: '<url>',                  // default: https://api.rokka.io
  apiVersion: <number>,              // default: 1
  renderHost: '<url>',               // default: https://{organization}.rokka.io
  debug: true,                       // default: false
  transport: {
    requestTimeout: <number>,  // milliseconds to wait for rokka server response (default: 30000)
    retries: <number>,         // number of retries when API response is 429 (default: 10)
    minTimeout: <number>,      // minimum milliseconds between retries (default: 1000)
    maxTimeout: <number>,      // maximum milliseconds between retries (default: 10000)
    randomize: <boolean>       // randomize time between retries (default: true)
    agent?: <any>               // an agent to be used with node-fetch, eg. if you need a proxy (default: undefined)
  }
});
```

**Using a proxy**

```js
import { HttpsProxyAgent } from 'https-proxy-agent'

const rokka = require('rokka')({
 apiKey: 'apikey'
 transport: {agent: new HttpsProxyAgent(proxy)}
});
```

### Users

#### `rokka.users.create(email, [organization])` → `Promise<RokkaResponse>`

Register a new user for the rokka service.

```js
const result = await rokka.users.create('user@example.org')
```


#### `rokka.users.getId()` → `Promise<string>`

Get user_id for current user

```js
const result = await rokka.users.getId()
```


### User

#### `rokka.user.getId()` → `Promise<string>`

Get user_id for current user

```js
const result = await rokka.users.getId()
```


#### `rokka.user.get()` → `Promise<UserResponse>`

Get user object for current user

```js
const result = await rokka.user.get()
```


#### `rokka.user.listApiKeys()` → `Promise<UserApiKeyListResponse>`

List Api Keys of the current user

```js
const result = await rokka.user.listApiKeys()
```


#### `rokka.user.addApiKey([comment])` → `Promise<UserApiKeyResponse>`

Add Api Key to the current user

```js
const result = await rokka.user.addApiKey('some comment')
```


#### `rokka.user.deleteApiKey(id)` → `Promise<RokkaResponse>`

Delete Api Key from the current user

```js
await rokka.user.deleteApiKey(id)
```


#### `rokka.user.getCurrentApiKey()` → `Promise<UserApiKeyResponse>`

Get currently used Api Key

```js
const result = await rokka.user.getCurrentApiKey()
```


#### `rokka.user.getNewToken([apiKey], [queryParams])` → `Promise<UserKeyTokenResponse>`

Gets a new JWT token from the API.

You either provide an API Key or there's a valid JWT token registered to get a new JWT token.

```js
const result = await rokka.user.getNewToken(apiKey, {expires_in: 48 * 3600, renewable: true})
```


#### `rokka.user.getToken()` → `ApiToken | null`

Gets the currently registered JWT Token from the `apiTokenGetCallback` config function or null


#### `rokka.user.setToken(token)` → `void`

Sets a new JWT token with the `apiTokenSetCallback` function


#### `rokka.user.isTokenExpiring([withinNextSeconds])` → `boolean`

Check if the registered JWT token is expiring within these amount of seconds (default: 3600)


#### `rokka.user.getTokenIsValidFor()` → `number`

How long a token is still valid for (just checking for expiration time)


### Billing

#### `rokka.billing.get(organization, [from], [to])` → `Promise<RokkaResponse>`

Retrieve statistics about the billing of an organization

If `from` and `to` are not specified, the API will return data for the last 30 days.

```js
const result = await rokka.billing.get('myorg', '2017-01-01', '2017-01-31')
```


### Organizations

#### `rokka.organizations.get(name)` → `Promise<RokkaResponse>`

Get a list of organizations.

```js
const result = await rokka.organizations.get('myorg')
```


#### `rokka.organizations.create(name, billingEmail, displayName)` → `Promise<RokkaResponse>`

Create an organization.

```js
const result = await rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
```


#### `rokka.organizations.setOptions(organizationName, options)` → `Promise<RokkaResponse>`

Update multiple organization options at once.

```js
const result = await rokka.organizations.setOptions('myorg', {
  protect_dynamic_stack: true,
  remote_basepath: 'https://example.com'
})
```


### Memberships

#### Roles

- `rokka.memberships.ROLES.READ` - read-only access
- `rokka.memberships.ROLES.WRITE` - read-write access
- `rokka.memberships.ROLES.UPLOAD` - upload-only access
- `rokka.memberships.ROLES.ADMIN` - administrative access

#### `rokka.memberships.create(organization, userId, roles, [comment])` → `Promise<RokkaResponse>`

Add a member to an organization.

```js
const result = await rokka.memberships.create('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290', [rokka.memberships.ROLES.WRITE], "An optional comment")
```


#### `rokka.memberships.delete(organization, userId)` → `Promise<RokkaResponse>`

Delete a member in an organization.

```js
await rokka.memberships.delete('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290')
```


#### `rokka.memberships.createWithNewUser(organization, roles, [comment])` → `Promise<RokkaResponse>`

Create a user and membership associated to this organization.

```js
const result = await rokka.memberships.createWithNewUser('myorg', [rokka.memberships.ROLES.READ], "New user for something")
```


#### `rokka.memberships.list(organization)` → `Promise<RokkaResponse>`

Lists members in an organization.

```js
const result = await rokka.memberships.list('myorg')
```


#### `rokka.memberships.get(organization, userId)` → `Promise<RokkaResponse>`

Get info of a member in an organization.

```js
const result = await rokka.memberships.get('myorg', userId)
```


### Sourceimages

#### `rokka.sourceimages.list(organization, [params])` → `Promise<SourceimagesListResponse>`

Get a list of source images.

By default, listing sourceimages sorts them by created date descending.

Searching for images can be achieved using the `search` parameter. Supported are predefined fields like `height`, `name` etc. but also user metadata. If you search for user metadata, the field name has to be prefixed with `user:TYPE`. All fields are combined with an AND. OR/NOT is not possible.

The search also supports range and wildcard queries. Check out [the rokka documentation](https://rokka.io/documentation/references/searching-images.html) for more.

Sorting works with user metadata as well and can be passed as either an array or as a comma separated string.

```js
const result = await rokka.sourceimages.list('myorg')
```

**Searching for images**

```js
const search = {
  'user:int:id': '42',
  'height': '64'
}
const result = await rokka.sourceimages.list('myorg', { search: search })
```


#### `rokka.sourceimages.downloadList(organization, [params])` → `Promise<RokkaDownloadResponse>`

Get a list of source images as zip. Same parameters as the `list` method

Example:

```js
const search = {
  'user:int:id': '42',
  'height': '64'
}
const result = await rokka.sourceimages.downloadList('myorg', { search: search })
```


#### `rokka.sourceimages.get(organization, hash, [queryParams])` → `Promise<RokkaResponse>`

Get information of a source image by hash.

```js
const result = await rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.getWithBinaryHash(organization, binaryHash)` → `Promise<SourceimagesListResponse>`

Get information of a source image by its binary hash.

```js
const result = await rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
```


#### `rokka.sourceimages.download(organization, hash)` → `Promise<RokkaDownloadResponse>`

Download image by hash, returns a Stream

```js
const result = await rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.downloadAsBuffer(organization, hash)` → `Promise<RokkaDownloadAsBufferResponse>`

Download image by hash, returns a Buffer

```js
const result = await rokka.sourceimages.downloadAsBuffer('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.autolabel(organization, hash)` → `Promise<RokkaResponse>`

Autolabels an image.

You need to be a paying customer to be able to use this.

```js
const result = await rokka.sourceimages.autolabel('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.autodescription(organization, hash, languages, [force])` → `Promise<RokkaResponse>`

Autodescribes an image. Can be used for alt attributes in img tags.

You need to be a paying customer to be able to use this.

```js
const result = await rokka.sourceimages.autodescription('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', ['en', 'de'], false)
```


#### `rokka.sourceimages.create(organization, fileName, binaryData, [metadata=null], [options={}])` → `Promise<RokkaResponse>`

Upload an image.

```js
const file = require('fs').createReadStream('picture.png')
const result = await rokka.sourceimages.create('myorg', 'picture.png', file)
```

With directly adding metadata:

```js
rokka.sourceimages.create('myorg', 'picture.png', file, {'meta_user': {'foo': 'bar'}})
```


#### `rokka.sourceimages.createByUrl(organization, url, [metadata=null], [options={}])` → `Promise<SourceimagesListResponse>`

Upload an image by url.

```js
const result = await rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png')
```

With directly adding metadata:

```js
rokka.sourceimages.createByUrl('myorg',  'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png', {'meta_user': {'foo': 'bar'}})
```


#### `rokka.sourceimages.delete(organization, hash)` → `Promise<RokkaResponse>`

Delete image by hash.

```js
await rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.deleteWithBinaryHash(organization, binaryHash)` → `Promise<RokkaResponse>`

Delete source images by its binary hash.

```js
await rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
```


#### `rokka.sourceimages.restore(organization, hash)` → `Promise<RokkaResponse>`

Restore image by hash.

```js
const result = await rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.copy(organization, hash, destinationOrganization, [overwrite=true])` → `Promise<RokkaResponse>`

Copy image by hash to another org.

```js
const result = await rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'anotherorg', true)
```


#### `rokka.sourceimages.copyAll(organization, hashes, destinationOrganization, [overwrite=true])` → `Promise<RokkaResponse>`

Copy multiple images to another organization.

See [the source images documentation](https://rokka.io/documentation/references/source-images.html#copy-a-source-image-to-another-organization) for more information.

```js
const result = await rokka.sourceimages.copyAll('myorg', [
  'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
  'f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912'
], 'anotherorg', true)
```


#### `rokka.sourceimages.invalidateCache(organization, hash)` → `Promise<RokkaResponse>`

Invalidate the CDN cache for a source image.

See [the caching documentation](https://rokka.io/documentation/references/caching.html) for more information.

```js
await rokka.sourceimages.invalidateCache('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.setProtected(organization, hash, isProtected, [options={}])` → `Promise<RokkaResponse>`

(Un)sets the protected status of an image.

Important! Returns a different hash, if the protected status changes

```js
const result = await rokka.sourceimages.setProtected('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true, {
  deletePrevious: false
})
```


#### `rokka.sourceimages.setLocked(organization, hash, isLocked)` → `Promise<RokkaResponse>`

(Un)locks an image.

Locks an image, which then can't be deleted.

```js
const result = await rokka.sourceimages.setLocked('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true)
```


#### Dynamic metadata

See [the dynamic metadata documentation](https://rokka.io/documentation/references/dynamic-metadata.html) for
more information.


#### `rokka.sourceimages.setSubjectArea(organization, hash, coords, [options={}])` → `Promise<RokkaResponse>`

Set the subject area of a source image.

The [subject area of an image](https://rokka.io/documentation/references/dynamic-metadata.html#subject-area) is used when applying the [crop operation](https://rokka.io/documentation/references/operations.html#crop) with the `auto` anchor to center the cropping box around the subject area.

```js
const result = await rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  x: 100,
  y: 100,
  width: 50,
  height: 50
}, {
  deletePrevious: false
})
```


#### `rokka.sourceimages.removeSubjectArea(organization, hash, [options={}])` → `Promise<RokkaResponse>`

Removes the subject area from a source image.

```js
await rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.addDynamicMetaData(organization, hash, name, data, [options={}])` → `Promise<RokkaResponse>`

Add/set dynamic metadata to an image

See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for details.

```js
const result = await rokka.sourceimages.addDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
  x: 100,
  y: 100,
  width: 50,
  height: 50
}, {
  deletePrevious: false
})
```


#### `rokka.sourceimages.deleteDynamicMetaData(organization, hash, name, [options={}])` → `Promise<RokkaResponse>`

Delete dynamic metadata of an image

See [the dynamic metadata chapter](https://rokka.io/documentation/references/dynamic-metadata.html) for details.

```js
await rokka.sourceimages.deleteDynamicMetaData('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'crop_area', {
  deletePrevious: false
})
```


#### `rokka.sourceimages.putName(organization, hash, name)` → `Promise<RokkaResponse>`

Change the name of a source image.

```js
const result = await rokka.sourceimages.putName('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', name)
```


### Sourceimages meta

#### User metadata

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for more information.


#### `rokka.sourceimages.meta.get(organization, hash)` → `Promise`

Get all user metadata for a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html) for an explanation.

```js
const result = await rokka.sourceimages.meta.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```


#### `rokka.sourceimages.meta.set(organization, hash, field, value)` → `Promise`

Set a single user metadata field on a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html) for an explanation.

```js
await rokka.sourceimages.meta.set('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'somefield', 'somevalue')
```


#### `rokka.sourceimages.meta.add(organization, hash, data)` → `Promise`

Add user metadata to a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html) for an explanation.

```js
const result = await rokka.sourceimages.meta.add('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0,
  'delete_this': null
})
```


#### `rokka.sourceimages.meta.replace(organization, hash, data)` → `Promise`

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html) for an explanation.

```js
const result = await rokka.sourceimages.meta.replace('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0
})
```


#### `rokka.sourceimages.meta.delete(organization, hash, [field=null])` → `Promise`

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html) for an explanation.

```js
await rokka.sourceimages.meta.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
```

If the third parameter (field) is specified, it will just delete this field.


### Sourceimages alias

#### Source Images alias

See [the usource image alias documentation](https://rokka.io/documentation/references/source-images-aliases.html)
for more information.


#### `rokka.sourceimages.alias.create(organization, alias, data, [params={}])` → `Promise`

Adds an alias to a source image.

See [the source image alias documentation](https://rokka.io/documentation/references/source-images-aliases.html) for an explanation.

```js
const result = await rokka.sourceimages.alias.create('myorg', 'myalias', {
  hash: 'somehash',
})
```


#### `rokka.sourceimages.alias.get(organization, alias)` → `Promise`

Get an alias.


#### `rokka.sourceimages.alias.delete(organization, alias)` → `Promise`

Delete an alias.


#### `rokka.sourceimages.alias.invalidateCache(organization, alias)` → `Promise`

Invalidate the CDN cache for an alias.


### Operations

#### Available operations

- `rokka.operations.resize(width, height, options = {})`
- `rokka.operations.autorotate(options = {})`
- `rokka.operations.rotate(angle, options = {})`
- `rokka.operations.dropshadow(options = {})`
- `rokka.operations.trim(options = {})`
- `rokka.operations.crop(width, height, options = {})`
- `rokka.operations.noop()`
- `rokka.operations.composition(width, height, mode, options = {})`
- `rokka.operations.blur(sigma, radius)`

Please refer to the
[rokka API documentation](https://rokka.io/documentation/references/operations.html)

#### `rokka.operations.list()` → `Promise<RokkaResponse>`

Get a list of available stack operations.

```js
const result = await rokka.operations.list()
```


### Stackoptions

#### `rokka.stackoptions.get()` → `Promise<RokkaResponse>`

Returns a json-schema like definition of options which can be set on a stack.

```js
const result = await rokka.stackoptions.get()
```


### Stacks

#### `rokka.stacks.list(organization, [limit], [offset])` → `Promise<RokkaResponse>`

Get a list of available stacks.

```js
const result = await rokka.stacks.list('myorg')
```


#### `rokka.stacks.get(organization, name)` → `Promise<RokkaResponse>`

Get details about a stack.

```js
const result = await rokka.stacks.get('myorg', 'mystack')
```


#### `rokka.stacks.create(organization, name, stackConfig, [params])` → `Promise<RokkaResponse>`

Create a new stack.

The signature of this method changed in 0.27.

Using a single stack operation object (without an enclosing array) as the 3rd parameter (stackConfig) is since version 0.27.0 not supported anymore.

```js
const operations = [
  rokka.operations.rotate(45),
  rokka.operations.resize(100, 100)
]

// stack options are optional
const options = {
  'jpg.quality': 80,
  'webp.quality': 80
}

// stack expressions are optional
const expressions = [
  rokka.expressions.default('options.dpr > 2', { 'jpg.quality': 60, 'webp.quality': 60 })
]

// query params are optional
const queryParams = { overwrite: true }
const result = await rokka.stacks.create(
  'test',
  'mystack',
  { operations, options, expressions },
  queryParams
)
```


#### `rokka.stacks.delete(organization, name)` → `Promise<RokkaResponse>`

Delete a stack.

```js
await rokka.stacks.delete('myorg', 'mystack')
```


#### `rokka.stacks.invalidateCache(organization, name)` → `Promise<RokkaResponse>`

Invalidate the CDN cache for a stack.

See [the caching documentation](https://rokka.io/documentation/references/caching.html) for more information.

```js
await rokka.stacks.invalidateCache('myorg', 'mystack')
```


### Render

#### `rokka.render.getUrl(organization, hash, format, stack, options)` → `string`

Get URL for rendering an image.

If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)

```js
rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
```


#### `rokka.render.getUrlFromUrl(rokkaUrl, stack, [options])` → `string`

Get URL for rendering an image from a rokka render URL.

If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)

```js
rokka.render.getUrlFromUrl('https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png', 'mystack')
```


#### `rokka.render.imagesByAlbum(organization, album, options)` → `Promise<RokkaResponse>`

Get image hashes and some other info belonging to a album (from metadata: user:array:albums)

```js
rokka.render.imagesByAlbum('myorg', 'Albumname', { favorites })
```


#### `rokka.render.signUrl(url, signKey, options)` → `Promise`

Signs a Rokka URL with an option valid until date.

It also rounds up the date to the next 5 minutes (300 seconds) to improve CDN caching, can be changed


#### `rokka.render.signUrlWithOptions(url, signKey, options)` → `Promise`

Signs a rokka URL with a sign key and optional signature options.


#### `rokka.render.addStackVariables(url, variables, [removeSafeUrlFromQuery])` → `Promise`

Adds stack variables to a rokka URL in a safe way

Uses the v query parameter, if a variable shouldn't be in the path

If you just need this function in a browser, you can also use [rokka-render.js](https://github.com/rokka-io/rokka-render.js)


### Stats

#### `rokka.stats.get(organization, [from], [to])` → `Promise<RokkaResponse>`

Retrieve statistics about an organization.

If `from` and `to` are not specified, the API will return data for the last 30 days.

```js
const result = await rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
```


### Request

#### `rokka.request.request(path, [method], [body])` → `Promise`

Does an authenticated request for any path to the Rokka API


### Utils

#### `rokka.utils.signUrl(organization, url, [options])` → `Promise<RokkaResponse>`

Sign a URL using the server-side signing endpoint.

This is useful when you don't have access to the signing key on the client side but want to generate signed URLs.

See [the signing URLs documentation](https://rokka.io/documentation/references/signing-urls.html) for more information.

```js
const result = await rokka.utils.signUrl('myorg', 'https://myorg.rokka.io/dynamic/abc123.jpg')
console.log(result.body.signed_url)
```


<!-- ENDDOCS -->

[npm-url]: https://npmjs.com/package/rokka
[npm-version-image]: https://img.shields.io/npm/v/rokka.svg?style=flat-square

[build-status-url]: https://github.com/rokka-io/rokka.js/actions/workflows/main.yml
[build-status-image]: https://github.com/rokka-io/rokka.js/actions/workflows/main.yml/badge.svg

[coverage-url]: https://coveralls.io/github/rokka-io/rokka.js?branch=master
[coverage-image]: https://img.shields.io/coveralls/rokka-io/rokka.js/master.svg?style=flat-square
