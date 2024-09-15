/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
const router = express.Router();

const handleError = (error: unknown, res: express.Response) => {
  let errMsg = "Something went wrong.";
  if (error instanceof Error) {
    errMsg = error.message;
  }
  return res.status(400).send(errMsg);
};

router.post("/", (req, res) => {
  const createUser = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { username, password, progress } = req.body;

      const saltRounds = 10;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        passwordHash,
        progress,
      });

      const savedUser = await user.save();
      return res.status(201).json(savedUser);
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };
  createUser();
});

router.get("/", (_request, response) => {
  User.find({}).then((users) => {
    response.json(users);
  });
});

export default router;
