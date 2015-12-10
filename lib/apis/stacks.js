const stacks = {};

export default (state) => {
  stacks.list = (organization, limit=null, offset=null) => {
    const queryParams = {};

    if(limit !== null) {
      queryParams.limit = limit;
    }
    if(offset !== null) {
      queryParams.offset = offset;
    }

    return state.request('GET', `stacks/${organization}`, null, queryParams);
  };

  stacks.get = (organization, name) => {
    return state.request('GET', `stacks/${organization}/${name}`);
  };

  stacks.create = (organization, name, operations) => {
    operations = Array.isArray(operations) ? operations : [operations];

    return state.request('PUT', `stacks/${organization}/${name}`, operations);
  };

  stacks.delete = (organization, name) => {
    return state.request('DELETE', `stacks/${organization}/${name}`);
  };

  return {
    stacks
  };
};
