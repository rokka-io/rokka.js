# [4.3.0] - 2026-08-28

## Added

- Add the `trusted` flag for API keys, settable with `rokka.user.addApiKey(comment, {trusted: true})` and `rokka.user.patchApiKey(id, {trusted})`, and returned on `UserApiKey`. A trusted key may manage its own user's API keys even when that user only holds a read-only role (`read` / `upload` / `sourceimages:read`), which is what makes key rotation possible for such a user. It's evaluated per key, so a published sibling key of the same user stays locked down, and it grants no organization permissions — never hand a trusted key to end users. Clearing it on the key you're authenticating with is refused with a 400 when that would strand you, override with `{force: true}`
- `rokka.user.patchApiKey()` accepts a body with only `trusted` in it (it previously rejected client-side, before doing a request)
- Add an optional 4th `apiKey` parameter to `rokka.memberships.createWithNewUser()` for the initial API key of the new user (`comment`, `trusted`, `requires_mfa`, `allowed_ips`, `expires`). It's only sent when given. This is the only place `trusted` can be set on a user which is already read-only, since its own key endpoints answer 403 from then on. `requires_mfa` on a read-only membership needs `trusted: true` as well, otherwise the new user can't reach the TOTP enrollment endpoints and the API answers with a 400

# [4.2.0] - 2026-08-13

## Added

- Add TOTP (MFA) support for API keys:
  - `rokka.user.getMfaTotp()`, `setupMfaTotp()` (returns secret + `otpauth://` provisioning URI for QR codes), `confirmMfaTotp(totp)` and `disableMfaTotp(totp)` for the TOTP setup lifecycle
  - `rokka.user.patchApiKey(id, {requires_mfa})` to require MFA for a key (such a key can only be exchanged for a JWT token together with a valid TOTP code)
  - `rokka.user.addApiKey(comment, {requires_mfa})` to create an already protected key
  - `totp` parameter on `rokka.user.getNewToken()` for the token exchange with an MFA key. The token endpoint is now called via `POST` (the `totp` is sent in the JSON body, never in the URL); the exchange is forced over the `Api-Key` header and a `totp` is never sent on automatic token renewals
  - `requires_mfa` / `totp_state` fields on the `UserApiKey` type
- Add `ADMIN_READ` (`admin:read`) to `rokka.memberships.ROLES`, a read-only organization admin. It grants everything `READ` grants, plus read access to the organization's memberships, users and API key metadata, and no write access of any kind. `ADMIN` implicitly satisfies it, `WRITE` deliberately does not
- Add `allowed_ips` (IP whitelist) and `expires` restrictions for API keys, settable on `rokka.user.addApiKey()` and changeable with `rokka.user.patchApiKey(id, options, {force})`. `null` clears them, at least one option is required, and `{force: true}` overrides the guard against locking out your own key. Restricted keys fail with a 401 and `error: 'key_expired'` / `'ip_not_allowed'`
- Add `rokka.user.listMemberships()` to list the organizations the current user is a member of, with their roles in each
- Add `rokka.user.listAdminApiKeys()` to list the members and their API key metadata of all organizations you have `admin` or `admin:read` on. Check `truncated`, there's no pagination to get the rest
- Add `rokka.organizations.listSubOrganizations(organization, {include_disabled})` to list the sub organizations of a master organization
- Add `rokka.sourceimages.contentCredentials(organization, hash)` to (re-)read the C2PA / Content Credentials of an image, exposed as the searchable `content_credentials` static metadata block. `Sourceimage.static_metadata` stays `any`, cast it to the new `StaticMetadata` type to get the typing

# [4.1.0] - 2026-06-11

## Added

- Add `keepHash` option to `rokka.sourceimages.addDynamicMetaData()` and `deleteDynamicMetaData()` to update/remove dynamic metadata in place without changing the image hash (mutually exclusive with `deletePrevious`)
- Add `BILLING_READ` (`billing:read`) to `rokka.memberships.ROLES` for granting read-only access to billing statistics

## Changed

- `rokka.sourceimages.copy()` now uses `POST /sourceimages/{org}/{hash}/copy` instead of the `COPY` HTTP verb (firewall-friendly proxy, same behavior; no public API change)
- Exclude src directory from npm package (smaller install size)

## Fixed

- `rokka.sourceimages.deleteDynamicMetaData()` now correctly sends `deletePrevious` (and `keepHash`) as query parameters; previously they were never sent to the API

## Security

- Upgrade jwt-decode from v3 to v4 (no public API changes)

# [4.0.0] - 2025-12-27

## Changed

- **Internal refactor**: Convert all API modules from interface/factory pattern to class-based architecture
  - Reduces code duplication by ~150-200 lines across 17 modules
  - Each API module now uses a clean class structure instead of separate interface + factory function
  - All TypeScript types remain exported for consumers
- Improve documentation generator to handle class-based patterns correctly

## Backwards Compatibility

This is a major version bump for transparency, but **the public API is backwards compatible**:

- Factory-style initialization continues to work: `const client = rokka({ apiKey: 'key' })`
- Class-style initialization continues to work: `new Rokka({ apiKey: 'key' })`
- All existing method calls work identically: `rokka.stacks.list()`, `rokka.sourceimages.get()`, etc.
- All TypeScript types are still exported

The changes are purely internal - no migration needed for existing code.

# [3.17.0] - 2025-12-27

## Added

- Add `Rokka` class for modern class-based initialization: `new Rokka({ apiKey })` (backwards compatible)
- Add `rokka.utils.signUrl()` for server-side URL signing (new utils module)
- Add `rokka.organizations.setOptions()` to update multiple organization options at once
- Add `rokka.sourceimages.copyAll()` to copy multiple images to another organization
- Add `rokka.sourceimages.invalidateCache()` to clear CDN cache for a source image
- Add `rokka.sourceimages.meta.get()` to retrieve all user metadata
- Add `rokka.sourceimages.meta.set()` to update a single user metadata field
- Add `rokka.stacks.invalidateCache()` to clear CDN cache for a stack

## Fixed

- Fix transport options mutation bug that could affect multiple client instances

## Changed

- Replace outdated markdox documentation generator with TypeDoc + typedoc-plugin-markdown
- Upgrade TypeScript from 4.6.4 to 5.7.0
- Migrate JSDoc comments to TSDoc syntax across all API modules
- Add full API reference documentation in docs/api/ folder
- Add comprehensive unit tests for previously untested API methods (billing, utils, aliases, etc.)
- Add TypeScript example files in examples/ directory

## Security

- Fix 14 npm audit vulnerabilities by updating dependencies
- Replace deprecated `rollup-plugin-terser` with `@rollup/plugin-terser`
- Remove deprecated `coveralls` npm package, use GitHub Action instead
- Update GitHub Actions to v4 (checkout, setup-node)
- Update `coverallsapp/github-action` to v2

# 3.16.0 - [02-01-2024]

- Add meta_static interface and autodescription method to sourceimages API

# 3.15.0 - [22-08-2023]

- Add source image alias support.   See [the Source Images Alias Guide](https://rokka.io/documentation/references/source-images-aliases.html) for details.

# 3.14.1 - [30-03-2023]

- Export StackOperation, StackOptions, Variables from rokka-render for BC reasons

# 3.14.0 - [30-03-2023]

- Use rokka-render.js
- Add `variables` to `StackConfig` interface

# 3.13.3 - [13-03-2023]

- Fix url signing when it contains a filename

# 3.13.2 - [06-03-2023]

- Fix hostname replacement in `rokka.render.getUrlFromUrl`

# 3.13.1 - [01-03-2023]

- Put variables into ?v when long or have a space in it

# 3.13.0 - [27-02-2023]

- Added variables support to `rokka.render.getUrlFromUrl` and `rokka.render.getUrl`

# 3.12.0 - [26-02-2023]

- Added `rokka.render.getUrlFromUrl(rokkaUrl, stack, options)` to change a rokka render URL string to other stacks/options.

# 3.11.0 - [31-10-2022]

- Remove 3rd parameter in`rokka.sourceimages.downloadAsBuffer`, it's not used.
- Add stackoptions option to getUrl 5th parameter

# 3.10.0 - [24-09-2022]

- Add support for downloading a list of images as Zip via `rokka.sourceimages.listDownload`

# 3.9.1 - [19-09-2022]

- Fix getting new Token, when apiKey is set via `rokka.user.getNewToken`

# 3.9.0 - [08-09-2022]

- Added support for getting a list of images in an album via `rokka.render.imagesByAlbum`

# 3.8.0 - [16-08-2022]

- Added support for locked sourceimages.
  See [the Source images Guide](https://rokka.io/documentation/references/source-images.html#lock-a-source-image-to-prevent-deletion) for details.

# 3.7.0 - [30-05-2022]

- Added support for API Tokens.
  See [the Authentication Guide](https://rokka.io/documentation/guides/authentication.html#using-rokka-with-a-jwt-token) for details
- Added possibility to add a comment to new memberships

# 3.6.0 [01-01-2022]

- Export more typescript interfaces

# 3.5.1 [28-12-2021]

- Fix request interface

# 3.5.0 [28-12-2021]

- Added `rokka.sourceimages.downloadAsBuffer` to get a Buffer more easily
- Added `rokka.render(path, method, payload)` to do any request against the rokka API
- Fixed return type of body for non JSON responses. It's now always a Stream.

# 3.4.0 [10-12-2021]

- Added `rokka.sourceimages.addDynamicMetaData` and `rokka.sourceimages.deleteDynamicMetaData`  method.

# 3.3.0 [07-12-2021]

- Added User Api Keys methods.
  See <https://rokka.io/documentation/references/users-and-memberships.html#rotate-your-api-key> for details.

# 3.2.0 [23-11-2021]

- Added agent transport option (for example for adding proxy options. See the README for an example)

# 3.1.0 [20-10-2021]

- Added `rokka.sourceimages.putName` method to change the name of an image.

# 3.0.1 [17-09-2021]

- Actually release the correct version

# 3.0.0 [17-09-2021]

- Converted to typescript. Even though it's supposed to be 100% backwards compatible, we decided to make this a major release.
- Moved tests from ava to jest and nock.
- Added `rokka.render.signUrl` method.
- Added `rokka.render.addStackVariables` method.
- Added `rokka.render.getUrlComponents` method.
- Added `rokka.sourceimages.setProtected` method (and support for setting it during creation)
- Added `rokka.organizations.setOption` method.

# 2.0.1 [04-11-2019]

- Small, non-code related fixes.
- Use rollup instead of babel for packaging files.

# 2.0.0 [25-10-2019]

- Replace request package with cross-fetch.
  rokka.js uses now cross-fetch instead of "request" for making the actual http calls. It's much smaller as the main reason.
  The object returned as response in the Promises therefore also changed. We tried to make it as backwards compatible as possible with providing the relevant properties as before, but we can't guarantee 100% BC
- Added deleted query support for `rokka.sourceimages.get` and `rokka.sourceimages.list`
- Added `rokka.memberships.get(organization,userId)`  
