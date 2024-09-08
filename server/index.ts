import { app } from "./app";
// import config from "./utils/config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const PORT = 3333;

const CHOSEN_MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const url = CHOSEN_MONGODB_URI as string;

console.log("connecting to MongoDB");
mongoose
  .connect(url)

  .then((_result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
