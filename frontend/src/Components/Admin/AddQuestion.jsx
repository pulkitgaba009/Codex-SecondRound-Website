import { useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionView from "./QuestionView";
import { RateLimiting } from "../../Helper";
import toast from "react-hot-toast";
import axios from "axios";

function AddQuestion() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageURL: "",
    examples: [{ input: "", output: "", explanation: "" }],
    hiddenTests: [{ input: "", output: "" }],
    constraints: [""],
    starterCode: {
      javascript: "",
      java: "",
      python: "",
      c: "",
      cpp: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const postQuestion = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3000/api/question",
        formData
      );

      toast.success("Added question in DB Successfully !!!");
    } catch (error) {
      if (error.response?.status === 429) {
        setRateLimited(true);
      } else {
        toast.error("Question can't be added in DB");
      }
    } finally {
      setLoading(false);
    }
  };

  if (rateLimited) return <RateLimiting />;
  return (
    <div className="box">
      <div className="subDivs w-[60%] mt-4">
        <QuestionView formData={formData} />
      </div>

      <div className="subDivs w-[40%] mt-4">
        <h1 className="authHeading">Enter the Question</h1>
        <hr className="horizontalLine mt-2" />

        <div className="w-full mt-4 h-[87%] overflow-auto scrollbar-hidden px-8">
          <QuestionForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={postQuestion}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
