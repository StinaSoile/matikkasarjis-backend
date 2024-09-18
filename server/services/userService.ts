import UserModel from "../models/user";
import { parseString, isProgressArray } from "../utils";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
const parseToken = (decodedToken: unknown) => {
  if (
    typeof decodedToken === "object" &&
    decodedToken !== null &&
    "username" in decodedToken &&
    "id" in decodedToken
  )
    return decodedToken;
  throw new Error("token is not compatible to user");
};

const parseUser = (body: unknown) => {
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
  const { username, password, progress } = parseUser(body);

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
  const { username, password } = parseUser(body);

  const user = await UserModel.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw new Error("Wrong username or password");
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

const saveProgress = async (req: Request) => {
  let authorization = req.get("authorization") as string;
  if (authorization && authorization.startsWith("Bearer ")) {
    authorization = authorization.replace("Bearer ", "");
  }
  const secret = process.env.SECRET as string;
  const decodedToken = jwt.verify(authorization, secret);
  const token = parseToken(decodedToken);

  const user = await UserModel.findById(token.id);
  if (user && user.username === req.body.username) {
    const updatedUser = await updateProgress(req);
    return updatedUser;
  }
  throw new Error("invalid body");
};

const updateProgress = async (request: Express.Request) => {
  if ("body" in request) {
    const { username, progress } = parseUser(request.body);
    const user = await UserModel.findOneAndUpdate(
      { username },
      { progress: progress }
    );
    return user;
  }
  throw new Error("body not found");
};

export default {
  parseUser,
  createUser,
  getAllUsers,
  login,
  updateProgress,
  parseToken,
  saveProgress,
};
