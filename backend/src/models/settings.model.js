import mongoose from "mongoose";

const quizSettingsSchema = new mongoose.Schema(
  {
    questionNumbers: {
      type: Number,
      required: true,
      min: 1,
    },

    quizTime: {
      type: Number, 
      required: true,
      min: 1,
    },

    quizStatus: {
      type: Boolean,
      default: false,
    },

    shuffleStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const QuizSetting = mongoose.model("QuizSetting", quizSettingsSchema);

export default QuizSetting;