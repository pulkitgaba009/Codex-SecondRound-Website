import mongoose from "mongoose";
import submissionSchema from "./subschema.model.js";

const resultSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    timeRemaining: {
      type: Number,
      required: true,
    },

    results: {
      type: [submissionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;
