import { useEffect, useState } from "react";
import QuestionForm from "./QuestionForm";
import QuestionView from "./QuestionView";
import QuestionBox from "./QuestionBox";
import axios from "axios";
import toast from "react-hot-toast";
import { RateLimiting,Loading } from "../../Helper";

function EditQuestion() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/questions");
        setQuestions(data);
        setSelectedQuestion(data[0] || null);
      } catch (error) {
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load questions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Loading state
  if (loading) return <Loading/> ;

  // Rate limit state
  if (rateLimited) return <RateLimiting/>;
  
  return (
    <div className="box h-screen w-full">
      {questions.length === 0 ? (
        // Empty DB UI
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="font-[Orbitron] text-xl text-rose-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            NO QUESTION IN DATABASE — ADD QUESTION FIRST !!!
          </h1>
        </div>
      ) : (
        // Main Editor UI
        <div className="w-full grid grid-cols-12 grid-rows-12 gap-4">
          <div className="subDivs row-span-12 col-span-7">
            {selectedQuestion && (
              <QuestionView formData={selectedQuestion} />
            )}
          </div>

          <div className="subDivs row-span-4 col-span-5">
            <QuestionBox
              questions={questions}
              onSelect={setSelectedQuestion}
              activeId={selectedQuestion?._id || selectedQuestion?.id}
            />
          </div>

          <div className="subDivs row-span-8 col-span-5">
            <h1 className="authHeading pb-2">Edit Question</h1>
            <hr className="horizontalLine" />
            <div className="w-full flex h-[87%] justify-center overflow-auto scrollbar-hidden">
              {selectedQuestion && (
                <QuestionForm
                  formData={selectedQuestion}
                  onChange={handleChange}
                  mode="put"
                  isDelete={true}
                  setQuestions={setQuestions}
                  setRateLimited={setRateLimited}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditQuestion;
