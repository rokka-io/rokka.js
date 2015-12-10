const organizations = {};

export default (state) => {
  organizations.get = (name) => {
    return state.request('GET', `organizations/${name}`);
  };

  organizations.create = (name, billingEmail, displayName) => {
    return state.request('PUT', `organizations/${name}`, {
      billing_email: billingEmail,
      display_name: displayName
    });
  };

  return {
    organizations
  };
};
