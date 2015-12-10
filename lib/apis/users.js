const users = {};

export default (state) => {
  users.create = (email) => {
    return state.request('POST', 'users', { email: email }, null, { noAuthHeaders: true });
  };

  return {
    users
  };
};
