# rokka.js [![NPM version][npm-version-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage][coverage-image]][coverage-url] [![Dependency Status][dependencies-image]][dependencies-url] [![bundlephobia zipped](https://badgen.net/bundlephobia/min/rokka)](https://bundlephobia.com/result?p=rokka) [![bundlephobia minified](https://badgen.net/bundlephobia/minzip/rokka)](https://bundlephobia.com/result?p=rokka) 


JavaScript client library for [rokka](https://rokka.io/).

rokka.js runs on node as well as [within the supported browsers](http://browserl.ist/?q=%3E0.1%25%2C+not+op_mini+all). 
To use in a browser, either use a script tag using [https://unpkg.com/rokka](https://unpkg.com/rokka) or import it using the ES6 module syntax:
```js
import rokka from 'rokka'
```

## Install

```bash
$ npm install rokka --save
# If using on the server side, babel-runtime is required to run it:
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

<!-- Start ../src/index.ts -->

Initializing the rokka client.

```js
const rokka = require('rokka')({
  apiKey: 'apikey',       // required for certain operations
  apiHost: '<url>',       // default: https://api.rokka.io
  apiVersion: <number>,   // default: 1
  renderHost: '<url>',    // default: https://{organization}.rokka.io
  debug: true,            // default: false
  transport: {
    requestTimeout: <number>,  // milliseconds to wait for rokka server response (default: 30000)
    retries: <number>,         // number of retries when API response is 429 (default: 10)
    minTimeout: <number>,      // minimum milliseconds between retries (default: 1000)
    maxTimeout: <number>,      // maximum milliseconds between retries (default: 10000)
    randomize: <boolean>       // randomize time between retries (default: true)
  }
});
```

All properties are optional since certain calls don't require credentials.

---

<!-- End ../src/index.ts -->

<!-- Start ../src/apis/users.ts -->

### Users

#### rokka.users.create(email, [organization) → Promise

Register a new user for the rokka service.

```js
rokka.users.create('user@example.org')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.users.getId() → Promise

Get user_id for current user

```js
rokka.users.getId()
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/users.ts -->

<!-- Start ../src/apis/billing.ts -->

### Billing

#### rokka.billing.get(organization, [from=null], [to=null]) → Promise

Retrieve statistics about the billing of an organization

If `from` and `to` are not specified, the API will return data for the last 30 days.

```js
rokka.billing.get('myorg', '2017-01-01', '2017-01-31')
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/billing.ts -->

<!-- Start ../src/apis/organizations.ts -->

### Organizations

#### rokka.organizations.get(name) → Promise

Get a list of organizations.

```js
rokka.organizations.get('myorg')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.organizations.create(name, billingEmail, displayName) → Promise

Create an organization.

```js
rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/organizations.ts -->

<!-- Start ../src/apis/memberships.ts -->

### Memberships

#### Roles

- `rokka.memberships.ROLES.READ` - read-only access
- `rokka.memberships.ROLES.WRITE` - read-write access
- `rokka.memberships.ROLES.UPLOAD` - upload-only access
- `rokka.memberships.ROLES.ADMIN` - administrative access

#### rokka.memberships.create(organization, userId, roles) → Promise

Add a member to an organization.

```js
rokka.memberships.create('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290', [rokka.memberships.ROLES.WRITE])
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.memberships.delete(organization, userId) → Promise

Delete a member in an organization.

```js
rokka.memberships.delete('myorg', '613547f8-e26d-48f6-8a6a-552c18b1a290')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.memberships.createWithNewUser(organization, roles) → Promise

Create a user and membership associated to this organization.

```js
rokka.memberships.createWithNewUser('myorg', [rokka.memberships.ROLES.READ])
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.memberships.list(organization) → Promise

Lists members in an organization.

```js
rokka.memberships.list('myorg')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.memberships.get(organization, userId) → Promise

Get info of a member in an organization.

```js
rokka.memberships.get('myorg',userId)
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/memberships.ts -->

<!-- Start ../src/apis/sourceimages.ts -->

### Source Images

#### rokka.sourceimages.list(organization, params) → Promise

Get a list of source images.

By default, listing sourceimages sorts them by created date descending.

```js
rokka.sourceimages.list('myorg')
  .then(function(result) {})
  .catch(function(err) {});
```

Searching for images can be achieved using the `search` parameter.
Supported are predefined fields like `height`, `name` etc. but also user metadata.
If you search for user metadata, the field name has to be prefixed with `user:TYPE`.
All fields are combined with an AND. OR/NOT is not possible.

Example:

```js
const search = {
  'user:int:id': '42',
  'height': '64'
}
rokka.sourceimages.list('myorg', { search: search })
  .then(function(result) {})
  .catch(function(err) {});
```

The search also supports range and wildcard queries.
Check out [the rokka documentation](https://rokka.io/documentation/references/searching-images.html) for more.

Sorting works with user metadata as well and can be passed as either an array or as a
comma separated string.

#### rokka.sourceimages.get(organization, hash, queryParams) → Promise

Get information of a source image by hash.

```js
rokka.sourceimages.get('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.getWithBinaryHash(organization, binaryHash) → Promise

Get information of a source image by its binary hash.

```js
rokka.sourceimages.getWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.download(organization, hash) → Promise

Download image by hash.

```js
rokka.sourceimages.download('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.autolabel(organization, hash) → Promise

Autolabels an image.

You need to be a paying customer to be able to use this.

```js
rokka.sourceimages.autolabel('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.create(organization, fileName, binaryData, [metadata=null], [options={}]) → Promise

Upload an image.

```js
const file = require('fs').createReadStream('picture.png');
rokka.sourceimages.create('myorg', 'picture.png', file)
  .then(function(result) {})
  .catch(function(err) {});
```

With directly adding metadata:

```
rokka.sourceimages.create('myorg', 'picture.png', file, {'meta_user': {'foo': 'bar'}})
```

#### rokka.sourceimages.createByUrl(organization, url, [metadata=null], [options={}]) → Promise

Upload an image by url.

```js
rokka.sourceimages.createByUrl('myorg', 'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png')
  .then(function(result) {})
  .catch(function(err) {});
```

With directly adding metadata:

```
rokka.sourceimages.createByUrl('myorg',  'https://rokka.rokka.io/dynamic/f4d3f334ba90d2b4b00e82953fe0bf93e7ad9912.png', {'meta_user': {'foo': 'bar'}})
```

#### rokka.sourceimages.delete(organization, hash) → Promise

Delete image by hash.

```js
rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.deleteWithBinaryHash(organization, binaryHash) → Promise

Delete source images by its binary hash.

```js
rokka.sourceimages.deleteWithBinaryHash('myorg', 'b23e17047329b417d3902dc1a5a7e158a3ee822a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.restore(organization, hash) → Promise

Restore image by hash.

```js
rokka.sourceimages.restore('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.copy(organization, hash, destinationOrganization, [overwrite=true]) → Promise

Copy image by hash to another org.

```js
rokka.sourceimages.copy('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'anotherorg', true)
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.setProtected(organization, hash, isProtected, [options={}]) → Promise

(Un)sets the protected status of an image.

Important! Returns a different hash, if the protected status changes

```js
rokka.sourceimages.setProtected('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', true,
{
  deletePrevious: false
}).then(function(result) {})
  .catch(function(err) {});
```

### Dynamic metadata

See [the dynamic metadata documentation](https://rokka.io/documentation/references/dynamic-metadata.html) for
more information.

#### rokka.sourceimages.setSubjectArea(organization, hash, coords, [options={}]) → Promise

Set the subject area of a source image.

The [subject area of an image](https://rokka.io/documentation/references/dynamic-metadata.html#subject-area) is
used when applying the [crop operation](https://rokka.io/documentation/references/operations.html#crop) with the
`auto` anchor to center the cropping box around the subject area.

```js
rokka.sourceimages.setSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  x: 100,
  y: 100,
  width: 50,
  height: 50
},
{
  deletePrevious: false
}).then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.removeSubjectArea(organization, hash, [options={}]) → Promise

Removes the subject area from a source image.

```js
rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/sourceimages.ts -->

<!-- Start ../src/apis/sourceimages.meta.ts -->

### Source Images

### User metadata

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for more information.

#### rokka.sourceimages.meta.add(organization, hash, data) → Promise

Add user metadata to a source image.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
rokka.sourceimages.meta.add('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0,
  'delete_this': null
}).then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.meta.replace(organization, hash, data) → Promise

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
rokka.sourceimages.meta.replace('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', {
  somefield: 'somevalue',
  'int:some_number': 0
}).then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.meta.delete(organization, hash, [field=null]) → Promise

Replace user metadata of a source image with the passed data.

See [the user metadata documentation](https://rokka.io/documentation/references/user-metadata.html)
for an explanation.

```js
rokka.sourceimages.meta.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

If the third parameter (field) is specified, it will just delete this field.

---

<!-- End ../src/apis/sourceimages.meta.ts -->

<!-- Start ../src/apis/operations.ts -->

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

#### rokka.operations.list() → Promise

Get a list of available stack operations.

```js
rokka.operations.list()
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/operations.ts -->

<!-- Start ../src/apis/stackoptions.ts -->

### Stack options

#### rokka.stackoptions.get() → Promise

Returns a json-schema like definition of options which can be set on a stack.

```js
rokka.stackoptions.get()
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/stackoptions.ts -->

<!-- Start ../src/apis/stacks.ts -->

### Stacks

#### rokka.stacks.list(organization, [limit=null], [offset=null]) → Promise

Get a list of available stacks.

```js
rokka.stacks.list('myorg')
  .then(function(result) {})
  .catch(function(err) {});
```

#### rokka.stacks.get(organization, name) → Promise

Get details about a stack.

```js
rokka.stacks.get('myorg', 'mystack')
  .then(function(result) {})
  .catch(function(result) {});
```

#### rokka.stacks.create(organization, name, stackConfig, [params={}]) → Promise

Create a new stack.

The signature of this method changed in 0.27.

Using a single stack operation object (without an enclosing array) as the 3rd parameter (stackConfig) is
 since version 0.27.0 not supported anymore.

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
var queryParams = { overwrite: true }
rokka.stacks.create(
  'test',
  'mystack',
  { operations, options, expressions },
  queryParams
).then(function(result) {})
 .catch(function(err) {})
```

#### rokka.stacks.delete(organization, name) → Promise

Delete a stack.

```js
rokka.stacks.delete('myorg', 'mystack')
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/stacks.ts -->

<!-- Start ../src/apis/render.ts -->

### Render

#### rokka.render.getUrl(organization, hash, format, [mixed]) → string

Get URL for rendering an image.

```js
rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
```

#### rokka.render.signUrl(url, signKey, [{until:Date = null, roundDateUpTo:number = 300}]) → string

Signs a Rokka URL with an option valid until date.

It also rounds up the date to the next 5 minutes (300 seconds) to
improve CDN caching, can be changed

#### rokka.render.signUrlWithOptions()

Signs a rokka URL with a sign key and optional signature options.

#### rokka.render.addStackVariables(url, variables, [removeSafeUrlFromQuery=false]) → string

Adds stack variables to a rokka URL in a safe way

Uses the v query parameter, if a variable shouldn't be in the path

---

<!-- End ../src/apis/render.ts -->

<!-- Start ../src/apis/stats.ts -->

### Stats

#### rokka.stats.get(organization, [from=null], [to=null]) → Promise

Retrieve statistics about an organization.

If `from` and `to` are not specified, the API will return data for the last 30 days.

```js
rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
  .then(function(result) {})
  .catch(function(err) {});
```

---

<!-- End ../src/apis/stats.ts -->

<!-- ENDDOCS -->

[npm-url]: https://npmjs.com/package/rokka
[npm-version-image]: https://img.shields.io/npm/v/rokka.svg?style=flat-square

[build-status-url]: https://travis-ci.org/rokka-io/rokka.js
[build-status-image]: https://img.shields.io/travis/rokka-io/rokka.js/master.svg?style=flat-square

[coverage-url]: https://coveralls.io/github/rokka-io/rokka.js?branch=master
[coverage-image]: https://img.shields.io/coveralls/rokka-io/rokka.js/master.svg?style=flat-square

[dependencies-url]: https://david-dm.org/rokka-io/rokka.js
[dependencies-image]: https://badgen.net/david/dep/rokka-io/rokka.js
