const sourceimages = {};

export default (state) => {
  sourceimages.list = (organization) => {
    return state.request('GET', `sourceimages/${organization}`);
  };

  return {
    sourceimages
  };
};
