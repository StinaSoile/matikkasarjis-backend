import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
const router = express.Router();
import User from "../models/user";
import * as dotenv from "dotenv";
dotenv.config();

router.post("/", (request, response) => {
  const login = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { username, password } = request.body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await User.findOne({ username });
    const passwordCorrect =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const token = jwt.sign(userForToken, secret);

    return (
      response
        .status(200)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        .send({ token, username: user.username, progress: user.progress })
    );
  };
  login();
});

export default router;
