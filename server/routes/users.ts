import userService from "../services/userService";
import express from "express";
const router = express.Router();

const handleError = (error: unknown, res: express.Response) => {
  let errMsg = "Something went wrong.";
  if (error instanceof Error) {
    errMsg = error.message;
  }
  return res.status(400).send(errMsg);
};

router.post("/", (req, res) => {
  try {
    userService.createUser(req.body).then((savedUser) => {
      res.status(201).json(savedUser);
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
});

router.get("/", (_request, response) => {
  userService.getAllUsers().then((users) => {
    response.json(users);
  });
});

export default router;
