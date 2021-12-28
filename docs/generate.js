// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdox = require('markdox')

const sources = [
  '../src/index.ts',
  '../src/apis/users.ts',
  '../src/apis/user.ts',
  '../src/apis/billing.ts',
  '../src/apis/organizations.ts',
  '../src/apis/memberships.ts',
  '../src/apis/sourceimages.ts',
  '../src/apis/sourceimages.meta.ts',
  '../src/apis/operations.ts',
  '../src/apis/stackoptions.ts',
  '../src/apis/stacks.ts',
  '../src/apis/render.ts',
  '../src/apis/stats.ts',
  '../src/apis/request.ts',
]
const readme = '../README.md'
const tmpFile = './API.md'

const options = {
  template: './template.md.ejs',
  output: tmpFile,
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
    '$1' + docsStr + '$2',
  )

  fs.writeFileSync(readme, readmeStr)
  fs.unlinkSync(tmpFile)

  process.stdout.write('Documentation generated.\n')
})
