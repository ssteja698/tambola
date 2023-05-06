import { GET, POST, PUT } from ".";

export const registerNewUser = payload => POST("", {
  ...payload
}, {
  // headers: {
  //   "OS-Version": "29",
  //   "App-Version": "1.0.0"
  // }
});
