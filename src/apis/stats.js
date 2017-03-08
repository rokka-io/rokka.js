const stats = {};

/**
 * ### Stats
 *
 * @module stats
 */
export default (state) => {
  /**
   * Retrieve statistics about an organization.
   *
   * If `from` and `to` are not specified, the API will return data for the last 30 days.
   *
   * ```js
   * rokka.stats.get('myorg', '2017-01-01', '2017-01-31')
   * 	 .then(function(result) {})
   * 	 .catch(function(err) {});
   * ```
   *
   * @param {string} organization name
   * @param {string} [from=null]  date in format YYYY-MM-DD
   * @param {string} [to=null]    date in format YYYY-MM-DD
   *
   * @return {Promise}
   */
  stats.get = (organization, from = null, to = null) => {
    return state.request('GET', `stats/${organization}`, null, {
      from,
      to
    });
  };

  return {
    stats
  };
};
