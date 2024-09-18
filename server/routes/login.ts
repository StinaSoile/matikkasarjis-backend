import express from "express";
const router = express.Router();
import * as dotenv from "dotenv";
import userService from "../services/userService";
dotenv.config();

const handleError = (error: unknown, res: express.Response) => {
  let errMsg = "Something went wrong.";
  if (error instanceof Error) {
    errMsg = error.message;
  }
  return res.status(401).send(errMsg);
};

router.post("/", async (req, res) => {
  try {
    const response = await userService.login(req.body);
    return res.status(200).send(response);
  } catch (error: unknown) {
    return handleError(error, res);
  }
});

export default router;
