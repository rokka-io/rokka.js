const users = {};

export default (state) => {
  users.create = (email) => {
    return state.request('POST', 'users', { email: email }, { noAuthHeaders: true });
  };

  return {
    users
  };
};
