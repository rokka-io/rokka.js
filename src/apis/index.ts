import memberships from './memberships'
import operations from './operations'
import organizations, { Organizations } from './organizations'
import expressions, { Expressions } from './expressions'
import render, { Render } from './render'
import sourceimages from './sourceimages'
import stackoptions, { StackOptions } from './stackoptions'
import stacks from './stacks'
import stats from './stats'
import billing, { Billing } from './billing'
import users from './users'

export interface RokkaApi {
  billing: Billing
  expressions: Expressions
  memberships: any
  operations: any
  organizations: Organizations
  render: Render
  sourceimages: any
  stackoptions: StackOptions
  stacks: any
  stats: any
  users: any
}

export default state => {
  const foo: RokkaApi = Object.assign(
    {},
    memberships(state),
    operations(state),
    organizations(state),
    expressions(state),
    render(state),
    sourceimages(state),
    stackoptions(state),
    stacks(state),
    stats(state),
    users(state),
    billing(state)
  )
  return foo
}
