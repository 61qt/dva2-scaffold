const models = [
  require('./all_resource').default,
  require('./breadcrumb').default,
  require('./foreign_select').default,
  require('./menu_config').default,
  require('./student').default,
  require('./sys_message').default,
  require('./teacher').default,
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
