const sourceimages = {};

export default (state) => {
  sourceimages.list = (organization, limit=null, offset=null) => {
    const queryParams = {};

    if(limit !== null) {
      queryParams.limit = limit;
    }
    if(offset !== null) {
      queryParams.offset = offset;
    }

    return state.request('GET', `sourceimages/${organization}`, null, queryParams);
  };

  sourceimages.get = (organization, hash) => {
    return state.request('GET', `sourceimages/${organization}/${hash}`);
  };


  sourceimages.getWithBinaryHash = (organization, binaryHash) => {
    const queryParams = { binaryHash: binaryHash };

    return state.request('GET', `sourceimages/${organization}`, null, queryParams);
  };

  sourceimages.download = (organization, hash) => {
    return state.request('GET', `sourceimages/${organization}/${hash}/download`);
  };

  sourceimages.create = (organization, binaryData) => {
    return state.request('POST', `sourceimages/${organization}`, binaryData, null, { fileUpload: true });
  };

  sourceimages.delete = (organization, hash) => {
    return state.request('DELETE', `sourceimages/${organization}/${hash}`);
  };

  return {
    sourceimages
  };
};
