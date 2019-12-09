export = rokka

interface Config {
  apiKey: string
  apiHost?: string // default: https://api.rokka.io
  apiVersion?: number // default: 1
  renderHost?: string // default: https://{organization}.rokka.io
  debug?: boolean // default: false
  transport?: {
    requestTimeout?: number // milliseconds to wait for rokka server response (default: 30000)
    retries?: number // number of retries when API response is 429 (default: 10)
    minTimeout?: number // minimum milliseconds between retries (default: 1000)
    maxTimeout?: number // maximum milliseconds between retries (default: 10000)
    randomize?: boolean // randomize time between retries (default: true)
  }
}

interface Billing {
  get(organization: string, from?: string, to?: string): Promise<Response>
}

interface Expressions {
  expression: string
  overrides: {
    options: object
  }
}

declare enum Role {
  READ = 'read',
  WRITE = 'write',
  UPLOAD = 'upload',
  ADMIN = 'admin'
}

interface Memberships {
  create(
    organization: string,
    userId: string,
    roles: [Role] | Role
  ): Promise<Response>
}

interface Response {
  response: any
  body: any
  statusCode: number
  statusMessage: string
}

interface Organizations {
  get(name: string): Promise<Response>
  create(
    name: string,
    billingEmail: string,
    displayName: string
  ): Promise<Response>
}

interface Rokka {
  billing: Billing
  expressions: Expressions
  memberships: Memberships
  operations: any
  organizations: Organizations
  render: any
  sourceimages: any
  stackoptions: any
  stacks: any
  stats: any
  users: any
}

declare function rokka(config: Config): Rokka
