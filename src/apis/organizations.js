/**
 * ### Organizations
 *
 * @module organizations
 */
export default state => {
  const organizations = {}

  /**
   * Get a list of organizations.
   *
   * ```js
   * rokka.organizations.get('myorg')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  name organization
   * @return {Promise}
   */
  organizations.get = name => {
    return state.request('GET', `organizations/${name}`)
  }

  /**
   * Create an organization.
   *
   * ```js
   * rokka.organizations.create('myorg', 'billing@example.org', 'Organization Inc.')
   *   .then(function(result) {})
   *   .catch(function(err) {});
   * ```
   *
   * @authenticated
   * @param  {string}  name         organization
   * @param  {string}  billingEmail email used for billing
   * @param  {string}  displayName  pretty name
   * @return {Promise}
   */
  organizations.create = (name, billingEmail, displayName) => {
    return state.request('PUT', `organizations/${name}`, {
      billing_email: billingEmail,
      display_name: displayName
    })
  }

  return {
    organizations
  }
}
