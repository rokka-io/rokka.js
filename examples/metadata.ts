/**
 * Metadata operations examples
 * Manage user and dynamic metadata on images
 */

import { Rokka } from '../src'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: Add user metadata
async function addUserMetadata() {
  const response = await client.sourceimages.meta.add('myorg', 'abc123hash', {
    title: 'My Image',
    category: 'products',
    tags: ['featured', 'new'],
  })
  console.log('Metadata added:', response.body)
}

// Example: Replace user metadata
async function replaceUserMetadata() {
  const response = await client.sourceimages.meta.replace(
    'myorg',
    'abc123hash',
    {
      title: 'Updated Title',
      description: 'A beautiful product image',
    },
  )
  console.log('Metadata replaced:', response.body)
}

// Example: Delete specific metadata field
async function deleteMetadataField() {
  await client.sourceimages.meta.delete('myorg', 'abc123hash', 'category')
  console.log('Metadata field deleted')
}

// Example: Set subject area (dynamic metadata)
async function setSubjectArea() {
  const response = await client.sourceimages.setSubjectArea(
    'myorg',
    'abc123hash',
    {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
    },
  )
  console.log('Subject area set, new hash:', response.body.hash)
}

// Example: Add custom dynamic metadata
async function addDynamicMetadata() {
  const response = await client.sourceimages.addDynamicMetaData(
    'myorg',
    'abc123hash',
    'crop_area',
    {
      x: 50,
      y: 50,
      width: 400,
      height: 300,
    },
    {},
  )
  console.log('Dynamic metadata added:', response.body.dynamic_metadata)
}

// Example: Auto-generate labels using AI
async function autoLabel() {
  const response = await client.sourceimages.autolabel('myorg', 'abc123hash')
  console.log('Generated labels:', response.body.labels)
}

// Example: Auto-generate description using AI
async function autoDescription() {
  const response = await client.sourceimages.autodescription(
    'myorg',
    'abc123hash',
    ['en', 'de'],
    false,
  )
  console.log('English description:', response.body.descriptions.en)
  console.log('German description:', response.body.descriptions.de)
}

