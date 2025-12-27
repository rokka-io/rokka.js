import { Application } from 'typedoc'
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const readme = join(__dirname, '../README.md')
const apiDocsDir = join(__dirname, 'api')
const srcDir = join(__dirname, '../src/apis')

async function generate() {
  // Clean up previous docs
  if (existsSync(apiDocsDir)) {
    rmSync(apiDocsDir, { recursive: true, force: true })
  }
  mkdirSync(apiDocsDir, { recursive: true })

  // Bootstrap TypeDoc with the markdown plugin
  const app = await Application.bootstrapWithPlugins({
    entryPoints: [
      join(__dirname, '../src/index.ts'),
      join(__dirname, '../src/apis/users.ts'),
      join(__dirname, '../src/apis/user.ts'),
      join(__dirname, '../src/apis/billing.ts'),
      join(__dirname, '../src/apis/organizations.ts'),
      join(__dirname, '../src/apis/memberships.ts'),
      join(__dirname, '../src/apis/sourceimages.ts'),
      join(__dirname, '../src/apis/sourceimages.meta.ts'),
      join(__dirname, '../src/apis/sourceimages.alias.ts'),
      join(__dirname, '../src/apis/operations.ts'),
      join(__dirname, '../src/apis/stackoptions.ts'),
      join(__dirname, '../src/apis/stacks.ts'),
      join(__dirname, '../src/apis/render.ts'),
      join(__dirname, '../src/apis/stats.ts'),
      join(__dirname, '../src/apis/request.ts'),
      join(__dirname, '../src/apis/utils.ts'),
    ],
    tsconfig: join(__dirname, '../tsconfig.json'),
    plugin: ['typedoc-plugin-markdown'],
    out: apiDocsDir,
    readme: 'none',
    excludePrivate: true,
    excludeInternal: true,
    excludeExternals: true,
    disableSources: true,
    hideGenerator: true,
    githubPages: false,
    // Markdown plugin options
    router: 'module', // Single file per module instead of per-member
    hideBreadcrumbs: true,
    hidePageHeader: true,
    hidePageTitle: false,
    useCodeBlocks: true,
    parametersFormat: 'table',
    interfacePropertiesFormat: 'table',
    classPropertiesFormat: 'table',
    enumMembersFormat: 'table',
    typeDeclarationFormat: 'table',
  })

  // Convert TypeScript to project model
  const project = await app.convert()

  if (!project) {
    console.error('Failed to convert project')
    process.exit(1)
  }

  // Generate markdown files to docs/api/
  await app.generateOutputs(project)

  // Build README summary by parsing source files directly
  let summaryContent =
    '\nSee [full API documentation](docs/api/) for detailed reference.\n\n'

  // Extract initialization documentation from index.ts
  const indexPath = join(__dirname, '../src/index.ts')
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, 'utf8')
    const initDoc = extractInitDoc(indexContent)
    if (initDoc) {
      summaryContent += initDoc + '\n\n'
    }
  }

  // API source files and their module names
  const apiFiles = [
    { file: 'users.ts', module: 'users' },
    { file: 'user.ts', module: 'user' },
    { file: 'billing.ts', module: 'billing' },
    { file: 'organizations.ts', module: 'organizations' },
    { file: 'memberships.ts', module: 'memberships' },
    { file: 'sourceimages.ts', module: 'sourceimages' },
    { file: 'sourceimages.meta.ts', module: 'sourceimages.meta' },
    { file: 'sourceimages.alias.ts', module: 'sourceimages.alias' },
    { file: 'operations.ts', module: 'operations' },
    { file: 'stackoptions.ts', module: 'stackoptions' },
    { file: 'stacks.ts', module: 'stacks' },
    { file: 'render.ts', module: 'render' },
    { file: 'stats.ts', module: 'stats' },
    { file: 'request.ts', module: 'request' },
    { file: 'utils.ts', module: 'utils' },
  ]

  for (const api of apiFiles) {
    const filePath = join(srcDir, api.file)
    if (!existsSync(filePath)) continue

    const content = readFileSync(filePath, 'utf8')
    const moduleIntro = extractModuleIntro(content)
    const returnTypes = extractReturnTypes(content)
    const methods = extractMethodsFromSource(content, api.module, returnTypes)

    if (methods.length > 0 || moduleIntro) {
      summaryContent += `### ${capitalize(api.module.replace('.', ' '))}\n\n`
      if (moduleIntro) {
        summaryContent += moduleIntro + '\n\n'
      }
      for (const method of methods) {
        summaryContent += method
      }
    }
  }

  // Insert summary into README
  let readmeStr = readFileSync(readme, 'utf8')
  readmeStr = readmeStr.replace(
    /(<!-- DOCS -->)[\s\S]+(<!-- ENDDOCS -->)/,
    '$1\n' + summaryContent + '$2'
  )

  writeFileSync(readme, readmeStr)

  console.log('Documentation generated.')
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Extract initialization documentation from index.ts (JSDoc on default export)
 */
function extractInitDoc(content) {
  // Find JSDoc block followed by "export default"
  const match = content.match(/\/\*\*[\s\S]*?\*\/\s*(?=export default)/)
  if (!match) return ''

  const jsdocBlock = match[0]

  // Extract description (before @example or @param)
  let description = ''
  const descMatch = jsdocBlock.match(/\/\*\*\s*\n?\s*\*?\s*([\s\S]*?)(?=\s*\*\s*@example|\s*\*\s*@param|\s*\*\/)/m)
  if (descMatch) {
    description = descMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/(?<!\n)\n(?!\n)/g, ' ')
      .replace(/  +/g, ' ')
      .trim()
  }

  // Extract all @example blocks
  const examples = []
  const examplePattern = /@example([^\n]*)\n\s*\*?\s*```(?:js|ts)?\s*\n([\s\S]*?)```/g
  let exampleMatch
  while ((exampleMatch = examplePattern.exec(jsdocBlock)) !== null) {
    const title = exampleMatch[1].trim()
    const code = exampleMatch[2]
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim()
    examples.push({ title, code })
  }

  // Build output
  let output = '### Initialization\n\n'
  if (description) {
    output += description + '\n\n'
  }

  for (const example of examples) {
    if (example.title) {
      output += `**${example.title}**\n\n`
    }
    output += '```js\n' + example.code + '\n```\n\n'
  }

  return output.trim()
}

/**
 * Extract module-level documentation (the JSDoc block with @module)
 */
function extractModuleIntro(content) {
  // Find JSDoc block containing @module
  const moduleMatch = content.match(/\/\*\*[\s\S]*?@module[\s\S]*?\*\//)
  if (!moduleMatch) return ''

  const jsdocBlock = moduleMatch[0]

  // Get content between the module title and @module tag
  // Skip the first line (### Module Name) and get the rest
  const contentMatch = jsdocBlock.match(/\/\*\*\s*\n?\s*\*\s*###[^\n]*\n([\s\S]*?)(?=\s*\*\s*@module)/)
  if (!contentMatch) return ''

  // Process the content: remove * prefixes and clean up
  let intro = contentMatch[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim()

  return intro
}

/**
 * Extract return types from interface definitions and class methods
 */
function extractReturnTypes(content) {
  const returnTypes = {}

  // Match interface definitions
  const interfacePattern = /export\s+interface\s+\w+\s*\{([\s\S]*?)\n\}/g
  let interfaceMatch

  while ((interfaceMatch = interfacePattern.exec(content)) !== null) {
    const interfaceBody = interfaceMatch[1]

    // Match method signatures: methodName(params): ReturnType or methodName: (params) => ReturnType
    const methodPattern = /(\w+)\s*(?:\([^)]*\)\s*:\s*([^;\n]+)|:\s*\([^)]*\)\s*=>\s*([^;\n]+))/g
    let methodMatch

    while ((methodMatch = methodPattern.exec(interfaceBody)) !== null) {
      const methodName = methodMatch[1]
      const returnType = (methodMatch[2] || methodMatch[3] || '').trim()
      if (returnType && !returnType.includes('{')) {
        returnTypes[methodName] = returnType
      }
    }
  }

  // Match class method definitions: methodName(params): ReturnType or async methodName(params): ReturnType
  const classMethodPattern = /(?:async\s+)?(\w+)\s*\([^)]*\)\s*:\s*([^{]+?)\s*\{/g
  let classMethodMatch

  while ((classMethodMatch = classMethodPattern.exec(content)) !== null) {
    const methodName = classMethodMatch[1]
    const returnType = classMethodMatch[2].trim()
    // Skip constructors and already-captured methods
    if (methodName !== 'constructor' && returnType && !returnType.includes('{')) {
      returnTypes[methodName] = returnType
    }
  }

  // Match class property arrow functions: propertyName: TypeName = (...) => or propertyName: (params) => ReturnType = (
  // First, extract type aliases that define function signatures
  const typeAliases = {}
  const typeAliasPattern = /(?:export\s+)?type\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*([^;\n]+)/g
  let typeMatch
  while ((typeMatch = typeAliasPattern.exec(content)) !== null) {
    typeAliases[typeMatch[1]] = typeMatch[2].trim()
  }

  // Also extract callable interface signatures: interface Name { (params): ReturnType }
  const callableInterfacePattern = /(?:export\s+)?interface\s+(\w+)\s*\{\s*\([^)]*\)\s*:\s*([^}]+)\}/g
  let callableMatch
  while ((callableMatch = callableInterfacePattern.exec(content)) !== null) {
    typeAliases[callableMatch[1]] = callableMatch[2].trim()
  }

  // Now match class property arrow functions with type annotations
  const arrowPropPattern = /(\w+)\s*:\s*(\w+)\s*=/g
  let arrowMatch
  while ((arrowMatch = arrowPropPattern.exec(content)) !== null) {
    const propName = arrowMatch[1]
    const typeName = arrowMatch[2]
    // Look up the return type from type aliases
    if (typeAliases[typeName] && !returnTypes[propName]) {
      returnTypes[propName] = typeAliases[typeName]
    }
  }

  return returnTypes
}

/**
 * Parse TypeScript source file to extract method documentation
 */
function extractMethodsFromSource(content, moduleName, returnTypes = {}) {
  const methods = []

  // Match JSDoc/TSDoc comment blocks followed by method definitions
  // This regex captures:
  // 1. The JSDoc comment block
  // 2. The method name and parameters
  const methodPattern =
    /\/\*\*[\s\S]*?\*\/\s*(?:(?:readonly\s+)?(\w+)\s*:\s*\([^)]*\)\s*=>|(\w+)\s*[=:]\s*(?:async\s*)?\([^)]*\)|(\w+)\s*\([^)]*\))/g

  // First, find all JSDoc blocks
  const jsdocPattern = /\/\*\*[\s\S]*?\*\//g
  let match

  while ((match = jsdocPattern.exec(content)) !== null) {
    const jsdocBlock = match[0]
    const afterJsdoc = content.slice(match.index + jsdocBlock.length)

    // Look for method definition after the JSDoc
    // Also match arrow functions with single param (no parens): `get: name => {`
    // And const methodName = (params) => { patterns
    // And class property arrow functions: `signUrl: SignUrlType = (params) =>`
    // And async class methods: `async downloadAsBuffer(`
    const methodMatch = afterJsdoc.match(
      /^\s*(?:readonly\s+|const\s+|async\s+)?(\w+)\s*(?::\s*\([^)]*\)\s*=>|:\s*\w+\s*=>|:\s*\w+\s*=\s*\(([^)]*)\)|\s*[=:]\s*(?:async\s*)?\(([^)]*)\)|\s*\(([^)]*)\))/
    )

    // Check if this is a section header (### title with no method after)
    if (!methodMatch) {
      // Check if it's a section header comment (has ### title but not @module)
      // Skip module-level comments which have @module tag
      if (jsdocBlock.includes('@module')) {
        continue
      }
      const sectionMatch = jsdocBlock.match(/\/\*\*\s*\n?\s*\*\s*###\s*([^\n]+)\n([\s\S]*?)\*\//)
      if (sectionMatch) {
        const sectionTitle = sectionMatch[1].trim()
        let sectionContent = sectionMatch[2]
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s?/, ''))
          .join('\n')
          .trim()

        let entry = `#### ${sectionTitle}\n\n`
        if (sectionContent) {
          entry += sectionContent + '\n\n'
        }
        methods.push(entry)
      }
      continue
    }

    const methodName = methodMatch[1]

    // Skip if it's a module-level comment or non-method
    if (!methodName || methodName === 'default' || methodName === 'module')
      continue

    // Extract description and inline examples from JSDoc, preserving interleaved order
    let contentParts = [] // Array of {type: 'text'|'code', content: string}

    // Get the main content (before @tags)
    const contentMatch = jsdocBlock.match(/\/\*\*\s*\n?\s*\*?\s*([\s\S]*?)(?=\s*\*\s*@[a-z]|\s*\*\/)/m)
    if (contentMatch) {
      let content = contentMatch[1]

      // Extract all code blocks and text, preserving order
      const codeBlockPattern = /```(?:js|ts)?\s*\n([\s\S]*?)```/g
      let codeMatch
      let lastIndex = 0

      while ((codeMatch = codeBlockPattern.exec(content)) !== null) {
        // Get text before this code block, preserving paragraph breaks
        const textBefore = content.slice(lastIndex, codeMatch.index)
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s?/, ''))
          .join('\n')
          // Convert double newlines to paragraph marker
          .replace(/\n\s*\n/g, '\n\n')
          // Collapse single newlines to spaces
          .replace(/(?<!\n)\n(?!\n)/g, ' ')
          .replace(/  +/g, ' ')
          .trim()
        if (textBefore) {
          contentParts.push({ type: 'text', content: textBefore })
        }

        // Get the example code
        const exampleCode = codeMatch[1]
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s?/, ''))
          .join('\n')
          .trim()
        if (exampleCode) {
          contentParts.push({ type: 'code', content: exampleCode })
        }

        lastIndex = codeMatch.index + codeMatch[0].length
      }

      // Get any remaining text after the last code block
      const textAfter = content.slice(lastIndex)
        .split('\n')
        .map((line) => line.replace(/^\s*\*\s?/, ''))
        .join('\n')
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/(?<!\n)\n(?!\n)/g, ' ')
        .replace(/  +/g, ' ')
        .trim()
      if (textAfter) {
        contentParts.push({ type: 'text', content: textAfter })
      }
    }

    // Extract @param tags to get parameter names (including optional with defaults)
    const params = []
    // Match @param {type} name or @param {type} [name] or @param {type} [name=default]
    // Handle nested braces in types like {{foo: bar}}
    const paramPattern = /@param\s+(?:\{(?:[^{}]|\{[^{}]*\})*\}\s+)?(\[?\w+(?:=[^\]\s]+)?\]?)/g
    let paramMatch
    while ((paramMatch = paramPattern.exec(jsdocBlock)) !== null) {
      params.push(paramMatch[1])
    }

    // Also check the TypeScript signature for optional params (param?: or param =)
    // Look at the method definition after the JSDoc (including single-param arrow functions, const, and typed arrow properties)
    const sigMatch = afterJsdoc.match(/^\s*(?:readonly\s+|const\s+)?(\w+)\s*(?::\s*\(([^)]*)\)|:\s*(\w+)\s*=>|:\s*\w+\s*=\s*\(([^)]*)\)|[=:]\s*(?:async\s*)?\(([^)]*)\)|\(([^)]*)\))/)
    if (sigMatch) {
      const sigParams = sigMatch[2] || sigMatch[3] || sigMatch[4] || sigMatch[5] || sigMatch[6] || ''
      // Parse signature params to find optional ones
      const sigParamList = sigParams.split(',').map(p => p.trim())
      for (const sp of sigParamList) {
        // Check for param?: type or param: type = default or param = default
        // Also capture the default value if present
        const optMatch = sp.match(/^(\w+)\s*\?|^(\w+)\s*(?::\s*[^=]+)?\s*=\s*(.+)$/)
        if (optMatch) {
          const optName = optMatch[1] || optMatch[2]
          const defaultValue = optMatch[3]?.trim()
          // Find this param in our list and mark as optional if not already
          const idx = params.findIndex(p => p === optName || p === `[${optName}]` || p.startsWith(`[${optName}=`))
          if (idx !== -1 && !params[idx].startsWith('[')) {
            // Include default value if available
            params[idx] = defaultValue ? `[${optName}=${defaultValue}]` : `[${optName}]`
          }
        }
      }
    }

    // Extract ALL @example blocks (if not already found inline in description)
    const hasCodeBlock = contentParts.some(p => p.type === 'code')
    if (!hasCodeBlock) {
      // Match all @example blocks with optional titles
      // Use \s*\*\s* prefix to ensure @example is at start of JSDoc line (not inside text like billing@example.org)
      const examplePattern = /\s*\*\s*@example([^\n]*)\n([\s\S]*?)(?=\s*\*\s*@example|\s*\*\s*@param|\s*\*\s*@return|\s*\*\s*@authenticated|\*\/)/g
      let exampleMatch
      while ((exampleMatch = examplePattern.exec(jsdocBlock)) !== null) {
        const title = exampleMatch[1].trim()
        const exampleContent = exampleMatch[2]

        // Add title as text if present
        if (title) {
          contentParts.push({ type: 'text', content: `**${title}**` })
        }

        // Extract code block from the example content
        const codeMatch = exampleContent.match(/```(?:js|ts)?\s*\n([\s\S]*?)```/)
        if (codeMatch) {
          contentParts.push({
            type: 'code',
            content: codeMatch[1]
              .split('\n')
              .map((line) => line.replace(/^\s*\*\s?/, ''))
              .join('\n')
              .trim()
          })
        }
      }
    }

    // Format method entry with return type if available
    const paramStr = params.join(', ')
    const returnType = returnTypes[methodName] || 'Promise'
    let entry = `#### \`rokka.${moduleName}.${methodName}(${paramStr})\` → \`${returnType}\`\n\n`

    // Output content parts in order (interleaved text and code)
    for (const part of contentParts) {
      if (part.type === 'text') {
        entry += `${part.content}\n\n`
      } else if (part.type === 'code' && part.content) {
        entry += '```js\n' + part.content + '\n```\n\n'
      }
    }

    methods.push(entry)
  }

  return methods
}

generate().catch((err) => {
  console.error('Error generating documentation:', err)
  process.exit(1)
})
