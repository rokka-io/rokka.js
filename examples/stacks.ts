/**
 * Stack operations examples
 * Stacks define image processing pipelines
 */

import { Rokka } from '../src'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: List all stacks
async function listStacks() {
  const response = await client.stacks.list('myorg')
  for (const stack of response.body.items) {
    console.log(`Stack: ${stack.name}`)
  }
}

// Example: Get a specific stack
async function getStack() {
  const response = await client.stacks.get('myorg', 'thumbnail')
  console.log('Stack name:', response.body.name)
  console.log('Operations:', response.body.stack_operations)
}

// Example: Create a new stack with resize operation
async function createStack() {
  const response = await client.stacks.create('myorg', 'thumbnail', {
    operations: [
      {
        name: 'resize',
        options: {
          width: 200,
          height: 200,
          mode: 'fill',
        },
      },
    ],
  })
  console.log('Created stack:', response.body.name)
}

// Example: Create a stack with multiple operations
async function createComplexStack() {
  const response = await client.stacks.create('myorg', 'product-image', {
    operations: [
      {
        name: 'resize',
        options: {
          width: 800,
          height: 600,
          mode: 'contain',
        },
      },
      {
        name: 'blur',
        options: {
          sigma: 1.5,
        },
      },
      {
        name: 'grayscale',
        options: {},
      },
    ],
    options: {
      'jpg.quality': 85,
      'webp.quality': 80,
    },
  })
  console.log('Created complex stack:', response.body.name)
}

// Example: Delete a stack
async function deleteStack() {
  await client.stacks.delete('myorg', 'old-stack')
  console.log('Stack deleted')
}

