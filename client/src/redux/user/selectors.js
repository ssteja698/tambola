import { createSelector } from "reselect";

export const selectUser = (state) => state.user;

export const selectRegisterNewUser = createSelector(
    [selectUser],
    (val) => val?.registerNewUser
);