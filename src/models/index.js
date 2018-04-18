const models = [
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
