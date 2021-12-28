import memberships, { Memberships } from './memberships'
import operations, { Operations } from './operations'
import organizations, { Organizations } from './organizations'
import expressions, { Expressions } from './expressions'
import render, { Render } from './render'
import sourceimages, { APISourceimages } from './sourceimages'
import stackoptions, { StackOptions } from './stackoptions'
import stacks, { Stacks } from './stacks'
import stats, { Stats } from './stats'
import billing, { Billing } from './billing'
import users, { Users } from './users'
import user, { User } from './user'
import { State } from '../index'
import request, { Request } from './request'

export interface RokkaApi {
  billing: Billing
  expressions: Expressions
  memberships: Memberships
  operations: Operations
  organizations: Organizations
  render: Render
  sourceimages: APISourceimages
  stackoptions: StackOptions
  stacks: Stacks
  stats: Stats
  users: Users
  user: User
  request: Request
}

export default (state: State): RokkaApi => {
  return Object.assign(
    {},
    memberships(state),
    operations(state),
    organizations(state),
    expressions(),
    render(state),
    sourceimages(state),
    stackoptions(state),
    stacks(state),
    stats(state),
    users(state),
    billing(state),
    user(state),
    request(state),
  )
}
