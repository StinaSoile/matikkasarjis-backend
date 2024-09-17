// import UserModel from "../models/user";
import { parseString, isProgressArray } from "../utils";
import { User } from "../types";

const getUser = (body: unknown) => {
  let user: User;
  if (
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    "password" in body &&
    "progress" in body
  ) {
    user = {
      username: parseString(body.username),
      password: parseString(body.password),
      progress: [],
    };
    if (body.progress && isProgressArray(body.progress)) {
      user.progress = body.progress;
    }
    return user;
  }
  throw new Error("");
};

export default {
  getUser,
};
