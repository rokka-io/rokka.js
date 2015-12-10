const operations = {};

export default (state) => {
  operations.list = () => {
    return state.request('GET', 'operations');
  };

  return {
    operations
  };
};
