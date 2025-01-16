import UserModel from "../models/user";
import { parseString, isProgressArray } from "../utils";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { BadRequestError, UnauthorizedError } from "../errors";

const parseToken = (decodedToken: unknown) => {
  if (
    typeof decodedToken === "object" &&
    decodedToken !== null &&
    "username" in decodedToken &&
    "id" in decodedToken &&
    "iat" in decodedToken &&
    "exp" in decodedToken
  )
    return {
      username: parseString(decodedToken.username),
      id: parseString(decodedToken.id),
      // iat: parseInt(decodedToken.iat),
      // exp: parseInt(decodedToken.exp),
    };
  // return decodedToken;
  throw new UnauthorizedError("token is not compatible to user");
};

const parseProgress = (body: unknown) => {
  let user: User;
  if (
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    "progress" in body
  ) {
    user = {
      username: parseString(body.username),
      password: "",
      progress: [],
    };
    if (body.progress && isProgressArray(body.progress)) {
      user.progress = body.progress;
    }
    return user;
  }
  throw new BadRequestError("request has invalid body");
};

const parseUser = (body: unknown) => {
  let user: User;
  if (
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    "password" in body
  ) {
    user = {
      username: parseString(body.username),
      password: parseString(body.password),
      progress: [],
    };
    return user;
  }
  throw new BadRequestError("request has invalid body");
};

const createUser = async (body: unknown) => {
  const { username, password, progress } = parseUser(body);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const otherUser = await UserModel.findOne({ username });
  if (otherUser) {
    throw new Error("Username is already in use");
  }
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
    throw new UnauthorizedError("Wrong username or password");
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
  let decodedToken: unknown;
  try {
    decodedToken = jwt.verify(authorization, secret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Token verification failed (JWT error):", error.message);
      throw new UnauthorizedError("Invalid token");
    } else if (error instanceof jwt.NotBeforeError) {
      console.error(
        "Token verification failed (NotBeforeError):",
        error.message
      );
      throw new UnauthorizedError("Token not active yet");
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error(
        "Token verification failed (TokenExpiredError):",
        error.message
      );
      throw new UnauthorizedError("Token expired");
    } else {
      console.error("Unexpected error during token verification:", error);
      throw new Error("Internal server error");
    }
  }

  const token = parseToken(decodedToken);
  if (!token.id) {
    throw new UnauthorizedError("token invalid");
  }
  const { progress } = parseProgress(req.body);
  const updatedUser = await UserModel.findByIdAndUpdate(
    token.id,
    { progress: progress },
    { new: true }
  );
  if (!updatedUser) {
    throw new BadRequestError("invalid body or user not found");
  }
  return updatedUser;
};

export default {
  parseUser,
  createUser,
  getAllUsers,
  login,
  parseToken,
  saveProgress,
};
