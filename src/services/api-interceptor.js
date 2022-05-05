import { USER_TOKEN_KEYS } from "../constants/userConstants";
import { cookieGet } from "../utils/helpers/storage";

export const mainApiBeforeEach = config => {
    const token = cookieGet(USER_TOKEN_KEYS.TOKEN);
    if (token) {
        config.headers["access-token"] = token
    }
    return config;
};

export const mainApiAfterEach = response => {
    return response;
};
