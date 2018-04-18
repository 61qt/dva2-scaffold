const models = [
  require('./all_resource').default,
  require('./menu_config').default,
  require('./student').default,
];

function modelReset(dispatch) {
  models.forEach((model) => {
    dispatch({
      type: `${model.namespace}/reset`,
    });
  });
}

export { modelReset };

export default models;
