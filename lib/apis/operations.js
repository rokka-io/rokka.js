const operations = {};

operations.resize = (width, height, absolute=null) => {
  const options = {
    width,
    height
  };

  if(absolute !== null) {
    options.absolute = absolute;
  }

  return {
    name: 'resize',
    options
  };
};

operations.rotate = (angle, backgroundColor=null, backgroundOpacity=null) => {
  const options = {
    angle
  };

  if(backgroundColor !== null) {
    options.background_color = backgroundColor;
  }
  if(backgroundOpacity !== null) {
    options.background_opacity = background_opacity;
  }

  console.log(options);

  return {
    name: 'rotate',
    options: options
  };
};

export default (state) => {
  operations.list = () => {
    return state.request('GET', 'operations', null, null, { noAuthHeaders: true });
  };

  return {
    operations
  };
};
