import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
const router = express.Router();
import User from "../models/user";
import * as dotenv from "dotenv";
import userService from "../services/userService";
dotenv.config();

router.post("/", (request, response) => {
  const login = async () => {
    const { username, password } = userService.getUser(request.body);

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const secret = process.env.SECRET as string;
    const token = jwt.sign(userForToken, secret, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    return response
      .status(200)
      .send({ token, username: user.username, progress: user.progress });
  };
  login();
});

export default router;
