import UserModel from "../models/user";
import { parseString, isProgressArray } from "../utils";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  throw new Error("request has invalid body");
};

const createUser = async (body: unknown) => {
  const { username, password, progress } = getUser(body);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new UserModel({
    username,
    passwordHash,
    progress,
  });

  const savedUser = await user.save();
  return savedUser;
};

const getAllUsers = async () => {
  const users = await UserModel.find({});
  return users;
};

const login = async (body: unknown) => {
  const { username, password } = getUser(body);

  const user = await UserModel.findOne({ username });
  const passwordCorrect =
    user === null ? false : bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw new Error("No keys found");
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const secret = process.env.SECRET as string;
  const token = jwt.sign(userForToken, secret, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  return { token, username: user.username, progress: user.progress };
};

export default {
  getUser,
  createUser,
  getAllUsers,
  login,
};
