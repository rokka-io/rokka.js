/**
 * API key, membership and organization administration examples
 */

import { Rokka } from '../src'

const client = new Rokka({
  apiKey: 'your-api-key',
})

// Example: Create an API key which only works from certain IPs and expires
async function createRestrictedApiKey() {
  const response = await client.user.addApiKey('ci key', {
    allowed_ips: ['192.168.0.5', '10.0.0.0/24'],
    expires: '2027-01-01T00:00:00+00:00',
  })
  // this is the only time you get to see the key itself
  console.log('New key:', response.body.api_key)
  console.log('Allowed IPs:', response.body.allowed_ips)
  console.log('Expires:', response.body.expires)
}

// Example: Restrict an existing key afterwards
//
// Restricting the key you're currently authenticating with is refused with a
// 400 when it would lock you out right now, {force: true} overrides that.
async function restrictExistingApiKey(id: string) {
  const response = await client.user.patchApiKey(
    id,
    {
      allowed_ips: ['192.168.0.5'],
      expires: new Date('2027-01-01T00:00:00+00:00'),
    },
    { force: true },
  )
  console.log('Allowed IPs:', response.body.allowed_ips)
}

// Example: Remove the restrictions again
async function clearApiKeyRestrictions(id: string) {
  const response = await client.user.patchApiKey(id, {
    allowed_ips: null,
    expires: null,
  })
  console.log('Allowed IPs:', response.body.allowed_ips) // []
  console.log('Expires:', response.body.expires) // null
}

// Example: List the organizations you're a member of
async function listMyOrganizations() {
  const response = await client.user.listMemberships()
  for (const membership of response.body.items) {
    console.log(
      `${membership.organization} (${membership.display_name}):`,
      membership.roles.join(', '),
    )
  }
}

// Example: Audit the members and their API keys of all organizations you
// have the admin or admin:read role on
async function auditApiKeys() {
  const response = await client.user.listAdminApiKeys()
  if (response.body.truncated) {
    // there's no pagination to get the rest, reduce the number of
    // organizations this user is a member of instead
    console.warn('The result was truncated')
  }
  for (const member of response.body.items) {
    for (const key of member.api_keys) {
      console.log(
        `${member.organization} / ${member.email}: key ${key.id}`,
        `expires: ${key.expires ?? 'never'}`,
        `mfa: ${key.requires_mfa ? 'yes' : 'no'}`,
      )
    }
  }
}

// Example: List the sub organizations of a master organization
async function listSubOrganizations() {
  const response = await client.organizations.listSubOrganizations('mastername')
  if (response.body.total === 0) {
    // nested master organizations don't exist, so ask the master instead
    console.log('Ask', response.body.master_organization, 'instead')
  }
  for (const organization of response.body.items) {
    console.log(organization.name, organization.display_name)
  }
}
