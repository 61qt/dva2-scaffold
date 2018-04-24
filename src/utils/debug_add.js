window.debugAdd = function debugAdd(key, memory) {
  window.debugAddSave = window.debugAddSave || {};
  window.debugAddSave[key] = memory;
};
