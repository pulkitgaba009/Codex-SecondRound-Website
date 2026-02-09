import Question from "../models/Question.model.js";

const getQuestions = async (req, res) => {
  try {
    const data = await Question.find();
    res.status(200).send(data);
  } catch (error) {
    console.log("Error in Get Question Route : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const question = req.body;
    await Question.create(question);

    res.status(200).json({ message: "Question Added Successfuilly in DB" });
  } catch (error) {
    console.log("Error in Add Question Route: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Question ID is required",
      });
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error in Delete Question Route:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Question ID is required",
      });
    }

    const updateQuest = await Question.findByIdAndUpdate(id, data);

    if (!updateQuest) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json({
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error in Update Question Route:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { getQuestions, addQuestion, deleteQuestion, updateQuestion };
