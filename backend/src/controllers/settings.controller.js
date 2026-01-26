import QuizSetting from "../models/settings.model.js";

const getSettings = async (req, res) => {
  try {
    const settings = await QuizSetting.find();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("ERROR in get quiz settings : ", { error });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { questionNumbers, quizTime, quizStatus, shuffleStatus } = req.body;
    const { id } = req.params;

    const updateSett = await QuizSetting.findByIdAndUpdate(
      id,{ 
        questionNumbers, 
        quizTime, 
        quizStatus, 
        shuffleStatus 
      },
      { new: true }
    );

    if (!updateSett)
      return res.status(404).json({ message: "Settings Not Found" });

    res.status(200).json({ message: "Settings Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in Put Settings API : ", error);
  }
};

const addSettings = async (req, res) => {
  try {
    const { questionNumbers, quizTime, quizStatus, shuffleStatus } = req.body;
    const settings = new QuizSetting({
      questionNumbers,
      quizTime,
      quizStatus,
      shuffleStatus,
    });

    await settings.save();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error In Post reults API : ", error);
  }
};

export { getSettings, updateSettings, addSettings };