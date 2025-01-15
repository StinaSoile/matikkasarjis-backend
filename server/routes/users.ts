import userService from "../services/userService";
import express from "express";
import { handleError } from "../utils";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const savedUser = await userService.createUser(req.body);
    return res.status(201).json(savedUser);
  } catch (error: unknown) {
    return handleError(error, res);
  }
});

router.get("/", async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error: unknown) {
    return handleError(error, res);
  }
});

router.post("/save", async (req, res) => {
  try {
    const updatedUser = await userService.saveProgress(req);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

export default router;
