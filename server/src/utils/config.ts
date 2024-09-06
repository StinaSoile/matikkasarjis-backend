// require("dotenv").config();
import * as dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
dotenv.config();
const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { MONGODB_URI, PORT };
