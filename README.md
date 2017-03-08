# rokka.js [![NPM version][npm-version-image]][npm-url] [![Dependency Status][dependencies-image]][dependencies-url]

JavaScript client library for [rokka](https://rokka.io/).

## Install

```bash
$ npm install rokka --save
```

## Usage

```js
var rokka = require('rokka')({
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

<!-- Start ../src/index.js -->

Initializing the rokka client.

```js
var rokka = require('rokka')({
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

<!-- End ../src/index.js -->

<!-- Start ../src/apis/users.js -->

### Users

#### rokka.users.create(email) → Promise

Register a new user for the rokka service.

```js
rokka.users.create('user@example.org')
	 .then(function(result) {})
	 .catch(function(err) {});
```

---

<!-- End ../src/apis/users.js -->

<!-- Start ../src/apis/organizations.js -->

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

<!-- End ../src/apis/organizations.js -->

<!-- Start ../src/apis/memberships.js -->

### Memberships

#### Roles

- `rokka.memberships.ROLES.READ` - read-only access
- `rokka.memberships.ROLES.WRITE` - read-write access
- `rokka.memberships.ROLES.ADMIN` - administrative access

#### rokka.memberships.create(organization, email, role) → Promise

Add a member to an organization.

```js
rokka.memberships.create('myorg', 'user@example.org', rokka.memberships.ROLES.WRITE)
	 .then(function(result) {})
	 .catch(function(err) {});
```

---

<!-- End ../src/apis/memberships.js -->

<!-- Start ../src/apis/sourceimages.js -->

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

#### rokka.sourceimages.get(organization, hash) → Promise

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

#### rokka.sourceimages.create(organization, fileName, binaryData) → Promise

Upload an image.

```js
const file = require('fs').createReadStream('picture.png');
rokka.sourceimages.create('myorg', 'picture.png', file)
	 .then(function(result) {})
	 .catch(function(err) {});
```

#### rokka.sourceimages.delete(organization, hash) → Promise

Delete image by hash.

```js
rokka.sourceimages.delete('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
	 .then(function(result) {})
	 .catch(function(err) {});
```

### Dynamic metadata

See [the dynamic metadata documentation](https://rokka.io/documentation/references/dynamic-metadata.html) for
more information.

#### rokka.sourceimages.setSubjectArea(organization, hash, coords) → Promise

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
}).then(function(result) {})
  .catch(function(err) {});
```

#### rokka.sourceimages.removeSubjectArea(organization, hash) → Promise

Removes the subject area from a source image.

```js
rokka.sourceimages.removeSubjectArea('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a')
  .then(function(result) {})
  .catch(function(err) {});
```

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

<!-- End ../src/apis/sourceimages.js -->

<!-- Start ../src/apis/operations.js -->

### Operations

#### Available operations

- `rokka.operations.resize(width, height, options={})`
- `rokka.operations.rotate(angle, options={})`
- `rokka.operations.dropshadow(options={})`
- `rokka.operations.trim(options={})`
- `rokka.operations.crop(options={})`
- `rokka.operations.noop()`

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

<!-- End ../src/apis/operations.js -->

<!-- Start ../src/apis/stacks.js -->

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

#### rokka.stacks.create(organization, name, operations) → Promise

Create a new stack.

```js
var operations = [
  rokka.operations.rotate(45),
  rokka.operations.resize(100, 100)
];

rokka.stacks.create('myorg', 'mystack', operations)
	 .then(function(result) {})
	 .catch(function(err) {});
```

#### rokka.stacks.delete(organization, name) → Promise

Delete a stack.

```js
rokka.stacks.delete('myorg', 'mystack')
	 .then(function(result) {})
	 .catch(function(err) {});
```

---

<!-- End ../src/apis/stacks.js -->

<!-- Start ../src/apis/render.js -->

### Render

#### rokka.render.getUrl(organization, hash, format, [mixed]) → string

Get URL for rendering an image.

```js
rokka.render.getUrl('myorg', 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a', 'png', 'mystack')
```

---

<!-- End ../src/apis/render.js -->

<!-- Start ../src/apis/stats.js -->

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

<!-- End ../src/apis/stats.js -->

<!-- ENDDOCS -->

[npm-url]: https://npmjs.com/package/rokka
[npm-version-image]: https://img.shields.io/npm/v/rokka.svg?style=flat-square

[dependencies-url]: https://david-dm.org/rokka-io/rokka.js
[dependencies-image]: https://david-dm.org/rokka-io/rokka.js.svg?style=flat-square
