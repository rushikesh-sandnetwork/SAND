// fullNameActions.js
import { DELETE_FULL_NAME_DATA, SET_FULL_NAME_DATA } from "./types";

export const setFullNameData = (id, fullName, componentName, options) => ({
  type: SET_FULL_NAME_DATA,
  payload: {
    uniqueId: id,
    title: fullName,
    type: componentName,
    options: options,
  },
});

export const deleteFullNameData = (id) => ({
  type: DELETE_FULL_NAME_DATA,
  payload: id,
});
