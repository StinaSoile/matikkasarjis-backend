import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const comicSchema = new mongoose.Schema({
  shortName: String,
  name: String,
  level: String,
  comicpages: [
    {
      key: String,
      pictureName: String,
      questionList: [
        {
          question: String,
          answer: String,
        },
      ],
    },
  ],
});

comicSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Comic = mongoose.model("Comic", comicSchema);

export default Comic;
