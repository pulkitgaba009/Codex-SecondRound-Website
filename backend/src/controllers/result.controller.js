import Result from "../models/results.model.js";

const getResult = async (req, res) => {
  try {
    const data = await Result.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in GET Results : ",error.message);
  }
};

const addResult = async (req, res) => {
  try {
    const data = req.body;
    await Result.create(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in Add Result : ",error.message);
  }
};

const deleteResult = async(req,res)=>{
  try {
    const {id} = req.params;
    const del = await Result.findByIdAndDelete(id);

    if (!del) return res.status(404).json({"message":"Question not found"}); 

    res.status(200).json({"message":"Question Deleated Successfully"});
  } catch (error) {
    res.status(500).json({"message":"Internal Server Error"});
    console.log("Error in Delete Result Route");
  }
}

const seeDetailedResult = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Result.findById(id).populate({
      path: "results.questionId",
      select: "title", 
    });

    res.status(200).json(data);
  } catch (error) {
    console.log("Error in See Detailed Result Route", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { getResult, addResult,deleteResult ,seeDetailedResult};
