var fs = require('fs')
  , markdox = require('markdox');

var sources = [
    '../lib/index.js',
    '../lib/apis/users.js',
    '../lib/apis/organizations.js',
    '../lib/apis/memberships.js',
    '../lib/apis/sourceimages.js',
    '../lib/apis/operations.js',
    '../lib/apis/stacks.js'
    //'../lib/apis/render.js'
  ]
  , readme = '../README.md'
  , tmpFile = './API.md';

var options = {
  template: './template.md.ejs',
  output: tmpFile
};

markdox.process(sources, options, function() {
  var docsStr = fs.readFileSync(tmpFile, 'utf8')
    , readmeStr = fs.readFileSync(readme, 'utf8');

  docsStr = docsStr
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "'")
    .replace(/&amp;/g, '&');

  readmeStr = readmeStr
    .replace(/(<!-- DOCS -->)(?:\r|\n|.)+(<!-- ENDDOCS -->)/gm,
              '$1' + docsStr + '$2');

  fs.writeFileSync(readme, readmeStr);
  fs.unlinkSync(tmpFile);

  process.stdout.write('Documentation generated.\n');

});
