/**
 * Source image alias examples
 * Aliases provide human-readable names for images
 */

import { Rokka } from '../src'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: Create an alias
async function createAlias() {
  const response = await client.sourceimages.alias.create(
    'myorg',
    'my-product-hero',
    { hash: 'abc123def456' },
  )
  console.log('Created alias:', response.body.alias)
  console.log('Points to hash:', response.body.hash)
}

// Example: Create alias with overwrite
async function createOrUpdateAlias() {
  const response = await client.sourceimages.alias.create(
    'myorg',
    'my-product-hero',
    { hash: 'newHash789' },
    { overwrite: true },
  )
  console.log('Alias updated to:', response.body.hash)
}

// Example: Get alias details
async function getAlias() {
  const response = await client.sourceimages.alias.get('myorg', 'my-product-hero')
  console.log('Alias:', response.body.alias)
  console.log('Hash:', response.body.hash)
  console.log('Created:', response.body.created)
}

// Example: Delete an alias
async function deleteAlias() {
  await client.sourceimages.alias.delete('myorg', 'old-alias')
  console.log('Alias deleted')
}

// Example: Invalidate alias cache
async function invalidateAliasCache() {
  await client.sourceimages.alias.invalidateCache('myorg', 'my-product-hero')
  console.log('Alias cache invalidated')
}

