const operations = {};

export default (state) => {
  operations.list = () => {
    return state.request('GET', 'operations', null, null, { noAuthHeaders: true });
  };

  return {
    operations
  };
};
