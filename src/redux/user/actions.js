import {
  FAILURE,
  REQUEST,
  SUCCESS,
  action,
} from "../actionCreator";
import {
  REGISTER_NEW_USER_ACTION,
} from "./types";

export const registerNewUserAction = {
  request: (payload) =>
    action(REGISTER_NEW_USER_ACTION[REQUEST], { ...payload }),
  success: (data, response) =>
    action(REGISTER_NEW_USER_ACTION[SUCCESS], { data, response }),
  failure: (data, response) =>
    action(REGISTER_NEW_USER_ACTION[FAILURE], { data, response }),
};
