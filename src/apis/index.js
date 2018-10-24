import memberships from './memberships'
import operations from './operations'
import organizations from './organizations'
import expressions from './expressions'
import render from './render'
import sourceimages from './sourceimages'
import stackoptions from './stackoptions'
import stacks from './stacks'
import stats from './stats'
import users from './users'

export default state => {
  return Object.assign(
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
    users(state)
  )
}
