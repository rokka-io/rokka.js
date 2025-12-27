/**
 * Render URL generation examples
 * Generate URLs for rendered images
 */

import { Rokka } from '../src'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: Get a simple render URL
function getSimpleUrl() {
  const url = client.render.getUrl('myorg', 'abc123hash', 'jpg', 'thumbnail')
  console.log('Render URL:', url)
  // https://myorg.rokka.io/thumbnail/abc123hash.jpg
}

// Example: Get URL with options
function getUrlWithOptions() {
  const url = client.render.getUrl('myorg', 'abc123hash', 'webp', 'thumbnail', {
    filename: 'my-image',
  })
  console.log('URL with filename:', url)
}

// Example: Sign a URL for protected images
async function signUrl() {
  const signedUrl = client.render.signUrl(
    'https://myorg.rokka.io/thumbnail/abc123hash.jpg',
    'my-signing-key',
  )
  console.log('Signed URL:', signedUrl)
}

// Example: Sign URL with expiration
function signUrlWithExpiration() {
  const signedUrl = client.render.signUrl(
    'https://myorg.rokka.io/thumbnail/abc123hash.jpg',
    'my-signing-key',
    {
      until: new Date('2025-12-31'),
    },
  )
  console.log('Signed URL with expiration:', signedUrl)
}

// Example: Parse URL components
function parseUrl() {
  const url = new URL('https://myorg.rokka.io/thumbnail/abc123hash.jpg')
  const components = client.render.getUrlComponents(url)
  if (components) {
    console.log('Stack:', components.stack)
    console.log('Hash:', components.hash)
    console.log('Format:', components.format)
    console.log('Filename:', components.filename)
  }
}

