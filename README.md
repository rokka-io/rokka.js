# Rokka.js [![NPM version][npm-version-image]][npm-url] [![Dependency Status][dependencies-image]][dependencies-url]

JavaScript client library for [Rokka](https://rokka.io/).

## Install

```bash
$ npm install rokka --save
```

## Usage

```js
var rokka = require('rokka')({
  apiKey: 'apikey',
  secret: 'secret'
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

Initializing the Rokka client.

```js
var rokka = require('rokka')({
  apiKey: 'apikey',     // required
  secret: 'secrect',    // required
  apiHost: '<url>',     // default: https://api.rokka.io
  apiVersion: <number>, // default: 1
  renderHost: '<url>',  // default: https://{organization}.rokka.io
  debug: true           // default: false
});
```

All properties are optional since certain calls don't require credentials.

---

<!-- End ../src/index.js -->

<!-- Start ../src/apis/users.js -->

### Users

#### rokka.users.create(email) → Promise

Register a new user for the Rokka service.

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

#### rokka.sourceimages.list(organization, [limit=null], [offset=null]) → Promise

Get a list of source images.

```js
rokka.sourceimages.list('myorg')
	 .then(function(result) {})
	 .catch(function(err) {});
```

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

#### rokka.sourceimages.create(organization, binaryData) → Promise

Upload an image.

```js
rokka.sourceimages.create('myorg', require('fs').createReadStream('picture.png'))
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
[Rokka API documentation](https://rokka.io/documentation/references/operations.html)

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

<!-- Start ../lib/apis/render.js -->

#### rokka.render.getUrl()(organization, hash, mixed, format) → string

Get render URL.

```js
rokka.organizations.get('myorg')
	 .then(function(result) {})
	 .catch(function(err) {});
```

---

<!-- End ../lib/apis/render.js -->

<!-- ENDDOCS -->

[npm-url]: https://npmjs.com/package/rokka
[npm-version-image]: https://img.shields.io/npm/v/rokka.svg?style=flat-square

[dependencies-url]: https://david-dm.org/rokka-io/rokka.js
[dependencies-image]: https://david-dm.org/rokka-io/rokka.js.svg?style=flat-square
