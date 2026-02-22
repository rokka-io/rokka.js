# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JavaScript/TypeScript client library for the [rokka.io](https://rokka.io/) image management API. Runs in Node.js (>=10) and browsers. Published as the `rokka` npm package (v4.0.0+).

## Common Commands

```bash
npm test                    # lint + jest + typecheck examples (run this before committing)
npm run jest                # jest tests only
npm run jest -- --testPathPattern=billing  # run a single test file
npm run lint                # eslint only
npm run lint:fix            # eslint with auto-fix
npm run build               # build dist/ via rollup (clears dist/ first)
npm run watch               # rollup in watch mode
npm run docs                # regenerate API docs in docs/api/
npm run typecheck:examples  # typecheck examples/*.ts
npm run coverage            # jest with coverage report
```

## Architecture

### Entry Points & Initialization

Two ways to create a client (both produce the same `RokkaApi` interface):

```ts
// Class-based (recommended)
import { Rokka } from 'rokka'
const rokka = new Rokka({ apiKey: 'key' })

// Factory function (backwards compatible)
const rokka = require('rokka')({ apiKey: 'key' })
```

The `Rokka` class and factory function both call `createState()` in `src/index.ts`, which creates a `State` object containing config, auth state, and the central `request()` method used by all API modules.

### API Module Pattern

Each module in `src/apis/` follows this class-based pattern (introduced in v4.0.0):

```ts
export class FooApi {
  constructor(private state: State) {}
  someMethod(org: string): Promise<RokkaResponse> {
    return this.state.request('GET', `foo/${org}`)
  }
}
export type Foo = FooApi
export default (state: State): { foo: Foo } => ({ foo: new FooApi(state) })
```

The default export is a factory that returns `{ moduleName: instance }`. All modules are aggregated in `src/apis/index.ts` via `Object.assign()` to form the complete `RokkaApi` interface.

### Key Source Files

- `src/index.ts` — `Rokka` class, factory function, `createState()`, `State` interface, `Config` interface
- `src/apis/index.ts` — aggregates all API modules into `RokkaApi` interface
- `src/transport.ts` — HTTP transport with retry logic (exponential backoff for 429/502/503/504)
- `src/apis/sourceimages.ts` — largest API module, composes `sourceimages.meta.ts` and `sourceimages.alias.ts`

### Build Outputs

Rollup produces three formats in `dist/`:
- `index.js` — CommonJS
- `index.esm.js` — ES modules
- `index.umd.min.js` — UMD (browser `<script>` tag)

The `src/` directory is excluded from the npm package.

## Testing

Tests use **Jest** with **ts-jest** and **nock** for HTTP mocking. Tests are in `tests/apis/`.

Two testing patterns coexist:
1. **Direct nock**: Create `nock('https://api.rokka.io')` interceptors inline (see `billing.test.ts`)
2. **Fixture-based**: Use `query()` / `queryAndCheckAnswer()` from `tests/mockServer.ts` with recorded fixtures in `tests/fixtures/` (see older tests)

The `rokka()` helper in `tests/mockServer.ts` creates a client with `retries: 0` and API key `'APIKEY'`.

## Code Style

- Prettier: no semicolons, single quotes, trailing commas, 2-space indent, no parens on single arrow params
- ESLint: TypeScript recommended + Prettier integration; `no-explicit-any` and `ban-types` are disabled
- Husky runs pre-commit hooks
