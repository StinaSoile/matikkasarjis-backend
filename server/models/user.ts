import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: String,
  progress: [
    {
      comic: String,
      key: String,
    },
  ],
});

userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
