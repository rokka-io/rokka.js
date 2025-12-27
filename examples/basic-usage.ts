/**
 * Basic rokka-js usage examples
 */

import { Rokka } from '../src'

// Initialize the client using the class constructor
const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: List source images
async function listImages() {
  const response = await client.sourceimages.list('myorg')
  console.log('Total images:', response.body.total)
  for (const image of response.body.items) {
    console.log(`- ${image.name}: ${image.hash}`)
  }
}

// Example: Get a specific source image
async function getImage() {
  const response = await client.sourceimages.get('myorg', 'abc123hash')
  console.log('Image format:', response.body.format)
  console.log('Image size:', response.body.size)
  console.log('Dimensions:', response.body.width, 'x', response.body.height)
}

// Example: Delete an image
async function deleteImage() {
  await client.sourceimages.delete('myorg', 'abc123hash')
  console.log('Image deleted')
}

// Example: Search images with filters
async function searchImages() {
  const response = await client.sourceimages.list('myorg', {
    limit: 10,
    offset: 0,
    search: {
      'user:category': 'products',
    },
  })
  console.log('Found:', response.body.total)
}

// Example: Download an image
async function downloadImage() {
  const response = await client.sourceimages.download('myorg', 'abc123hash')
  console.log('Downloaded bytes:', response.body)
}

// Example: Upload an image
async function uploadImage() {
  const fs = await import('fs')
  const fileBuffer = fs.readFileSync('/path/to/image.jpg')

  const response = await client.sourceimages.create(
    'myorg',
    'image.jpg',
    fileBuffer,
  )
  console.log('Uploaded image hash:', response.body.items[0].hash)
}

// Example: Upload an image with metadata
async function uploadImageWithMetadata() {
  const fs = await import('fs')
  const fileBuffer = fs.readFileSync('/path/to/image.jpg')

  const response = await client.sourceimages.create(
    'myorg',
    'image.jpg',
    fileBuffer,
    {
      meta_user: {
        title: 'My uploaded image',
        category: 'products',
      },
    },
  )
  console.log('Uploaded with metadata:', response.body.items[0].hash)
}

