import { variable } from "./environments";

const NEXT_ENV = process.env.NEXT_ENV;
const envConfig = variable[NEXT_ENV];

// console.log("ENV", NEXT_ENV);

export const config = Object.assign(
  {
    env: NEXT_ENV,
  },
  envConfig
);
