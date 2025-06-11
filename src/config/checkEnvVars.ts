import * as variables from './variables';

(() => {
  Object.entries(variables).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`${key} not found`);
    }
  });
})();
