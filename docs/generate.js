const fs = require('fs')
const markdox = require('markdox')

const sources = [
  '../src/index.ts',
  '../src/apis/users.js',
  '../src/apis/billing.ts',
  '../src/apis/organizations.ts',
  '../src/apis/memberships.js',
  '../src/apis/sourceimages.js',
  '../src/apis/operations.js',
  '../src/apis/stackoptions.ts',
  '../src/apis/stacks.js',
  '../src/apis/render.ts',
  '../src/apis/stats.js'
]
const readme = '../README.md'
const tmpFile = './API.md'

const options = {
  template: './template.md.ejs',
  output: tmpFile
}

markdox.process(sources, options, function () {
  let docsStr = fs.readFileSync(tmpFile, 'utf8')
  let readmeStr = fs.readFileSync(readme, 'utf8')

  docsStr = docsStr
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "'")
    .replace(/&amp;/g, '&')

  readmeStr = readmeStr.replace(
    /(<!-- DOCS -->)(?:\r|\n|.)+(<!-- ENDDOCS -->)/gm,
    '$1' + docsStr + '$2'
  )

  fs.writeFileSync(readme, readmeStr)
  fs.unlinkSync(tmpFile)

  process.stdout.write('Documentation generated.\n')
})
