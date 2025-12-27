/**
 * Organization and membership examples
 */

import { Rokka } from '../src'
import { Role } from '../src/apis/memberships'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: Get organization details
async function getOrganization() {
  const response = await client.organizations.get('myorg')
  console.log('Organization:', response.body.name)
  console.log('Display name:', response.body.display_name)
  console.log('Billing email:', response.body.billing_email)
}

// Example: Create a new organization
async function createOrganization() {
  const response = await client.organizations.create('neworg', 'billing@example.com', 'New Organization')
  console.log('Created organization:', response.body.name)
}

// Example: List memberships
async function listMemberships() {
  const response = await client.memberships.list('myorg')
  for (const member of response.body.items) {
    console.log(`User: ${member.user_id}, Role: ${member.role}`)
  }
}

// Example: Add a member to organization
async function addMember() {
  const response = await client.memberships.create(
    'myorg',
    'user-uuid',
    [Role.WRITE],
  )
  console.log('Member added:', response.body)
}

// Example: Get billing information
async function getBilling() {
  const response = await client.billing.get('myorg', '2024-01-01', '2024-12-31')
  console.log('Total traffic:', response.body.total_traffic)
  console.log('Total storage:', response.body.total_storage)
}

// Example: Get usage statistics
async function getStats() {
  const response = await client.stats.get('myorg', '2024-01-01', '2024-12-31')
  console.log('Statistics:', response.body)
}

