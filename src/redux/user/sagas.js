import { call, takeLatest } from "redux-saga/effects";
import { REQUEST } from "../actionCreator";
import {
  registerNewUser
} from "../../services/user";
import {
  REGISTER_NEW_USER_ACTION,
} from "./types";

function* handleRegisterNewUserRequest({ payload }) {
  try {
    const apiResponse = yield call(registerNewUser, { ...payload });
  } catch (e) {
  }
}

export const userSaga = {
  watchRegisterNewUser: takeLatest(REGISTER_NEW_USER_ACTION[REQUEST], handleRegisterNewUserRequest),
};
