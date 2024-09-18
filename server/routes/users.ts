import userService from "../services/userService";
import express from "express";

const router = express.Router();

const handleError = (error: unknown, res: express.Response) => {
  let errMsg = "Something went wrong.";
  console.log(error);
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    errMsg = "Username already exists";
  } else if (error instanceof Error) {
    errMsg = error.message;
  }

  return res.status(400).send(errMsg);
};

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

//save progress
// hash-homma toimii ihan vinksusti,
// ja virheenkäsittelyssä on jossain vika, yhteys katkess
router.post("/save", (req, res) => {
  try {
    userService.saveProgress(req).then((updatedUser) => {
      res.status(201).json(updatedUser);
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
});

export default router;
