import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    language: {
      type: String,
      enum: ["c", "cpp", "java", "python", "javascript"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      enum: ["Pending", "Accepted", "Wrong Answer", "TLE", "Runtime Error"],
      default: "Pending",
    },
  },
  { _id: false }
);

export default submissionSchema;
