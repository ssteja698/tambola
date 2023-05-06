import { combineReducers } from "redux";

import { FAILURE, REQUEST, SUCCESS, UNSET } from "../actionCreator";
import {
    REGISTER_NEW_USER_ACTION,
} from "./types";

const initialState = {
    pending: false,
    success: false,
    set: false,
    failure: false,
    request: {},
    error: {},
    data: {},
    user: {}
};

const user = () => {
    const registerNewUser = (state = initialState, action) => {
        switch (action.type) {
            case REGISTER_NEW_USER_ACTION[REQUEST]:
                return {
                    ...initialState,
                    request: action.payload,
                    pending: true,
                };
            case REGISTER_NEW_USER_ACTION[SUCCESS]:
                return {
                    ...state,
                    pending: false,
                    success: true,
                    failure: false,
                    data: action.payload,
                };

            case REGISTER_NEW_USER_ACTION[FAILURE]:
                return {
                    ...state,
                    pending: false,
                    success: false,
                    failure: true,
                    data: {},
                    error: action.payload,
                };
            case REGISTER_NEW_USER_ACTION[UNSET]:
                return {
                    ...initialState,
                };

            default:
                return state;
        }
    };

    return combineReducers({
        registerNewUser,
    });
};

export default user;
