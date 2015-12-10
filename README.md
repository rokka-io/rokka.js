# Rokka.js

**Currently under development**

The official JavaScript client library for [Rokka](https://rokka.io/).

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
