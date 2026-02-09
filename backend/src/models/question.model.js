import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    javascript: { type: String, default: "" },
    java: { type: String, default: "" },
    python: { type: String, default: "" },
    c: { type: String, default: "" },
    cpp: { type: String, default: "" },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    imageURL: { type: String },

    examples: {
      type: [exampleSchema],
      default: [],
    },

    hiddenTests: {
      type: [testCaseSchema],
      default: [],
    },

    constraints: {
      type: [String],
      default: [],
    },

    starterCode: {
      type: starterCodeSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
