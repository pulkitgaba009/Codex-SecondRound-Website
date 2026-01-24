import { useState, useContext, useEffect } from "react";
import Layout from "../Layout";
import QuizQuestionsList from "./QuizQuestionList";
import QuizQuestionView from "./QuizQuestionView";
import { motion } from "framer-motion";
import SecureQuiz from "./SecureQuiz";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";
import Header from "../Header";
import TeamContext from "../../Contexts/teamContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Loading, RateLimiting } from "../../Helper";
import TimeContext from "../../Contexts/timeContext";

function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submit, setSubmit] = useState(false);
  const nevigate = useNavigate();
  const [results, setResults] = useState([]);
  const { team } = useContext(TeamContext);
  const { timeData } = useContext(TimeContext);

  const [settings, setSettings] = useState();

  const getSettings = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/settings");
      setSettings(data[0]);
      // toast.success("Got settings");
    } catch (error) {
      console.log("ERROR : ", error);
      toast.error("Failed to load quiz settings");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (settings) {
      console.log("Settings updated:", settings);
    }
  }, [settings]);

  const prepareQuestions = (allQuestions, settings) => {
    if (!settings || !Array.isArray(allQuestions)) return [];

    let finalQuestions = [...allQuestions];

    // Shuffle if enabled
    if (settings.shuffleStatus) {
      for (let i = finalQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalQuestions[i], finalQuestions[j]] = [
          finalQuestions[j],
          finalQuestions[i],
        ];
      }
    }

    return finalQuestions.slice(
      0,
      Math.min(settings.questionNumbers, finalQuestions.length)
    );
  };

  const saveResult = async () => {
    try {
      setSubmit(true);
      axios.post("http://localhost:3000/api/results", {
        teamName: team,
        score: score,
        timeRemaining: timeData,
      });
      toast.success("Results saved in DB Successfully !!!");
      nevigate("/end");
    } catch (error) {
      toast.error("Results can't be saved");
    } finally {
      setSubmit(false);
    }
  };

    useEffect(() => {
    const getResults = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/results");

        const alreadySubmitted = data.some(
          (r) => r.teamName?.toUpperCase() === team?.toUpperCase()
        );

        if (alreadySubmitted) {
          toast.error("Team has already submitted the quiz");
          nevigate("/end");
          return;
        }

        setResults(data);
      } catch {
        toast.error("Failed to fetch results");
      }
    };

    if (team) getResults();
  }, [team]);

  // api states
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!settings) return;

    const fetchQuestion = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/questions");

        const prepared = prepareQuestions(data, settings);

        setQuestions(prepared);
        setActiveQuestion(prepared[0]);
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

    fetchQuestion();
  }, [settings]);

  useEffect(() => {
    if (!team) {
      toast.error("Quiz Already Submitted !!!");
      nevigate("/end");
    }
  }, [team]);

  useEffect(() => {
    getSettings();
  }, []);

  // number of attempted questions (non-empty answers)
  const attempted = Object.values(answers).filter(
    (v) => v !== undefined && v !== null && String(v).trim() !== ""
  ).length;

  // called by SecureQuiz when user exits fullscreen
  const submitQuiz = () => {
    if (submitted) return; // already submitted
    setSubmitted(true);

    saveResult();
    // console.log("Auto-submitting quiz. Answers:", answers);
    // console.log("Final score:", score);
    // console.log(timeData);
  };

  const handleAnswer = (id, value) => {
    if (submitted) return;

    const correctAnswer = questions.find((q) => q._id === id)?.answer;

    setAnswers((prevAnswers) => {
      const prevValue = prevAnswers[id];
      const wasCorrect = prevValue === correctAnswer;
      const nowCorrect = value === correctAnswer;

      if (wasCorrect !== nowCorrect) {
        setScore((prevScore) => {
          const next = prevScore + (nowCorrect ? 1 : -1);
          return Math.min(questions.length, Math.max(0, next));
        });
      }

      return { ...prevAnswers, [id]: value };
    });
  };

  return (
    <Layout>
      {/* <SecureQuiz onAutoSubmit={submitQuiz} />  */}

      <Header />
      {/* Main Layout + one-time motion */}

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-x-hidden mt-10 scrollbar-hidden" 
      >
        {/* Rate limit state */}
        {rateLimited && <RateLimiting />}

        {/* Loading state  */}
        {loading ? <Loading />:

        <div className="w-screen px-4 md:px-16 h-[87%] mt-8 md:mt-16 grid grid-cols-12 grid-rows-12 gap-4 max-w-[2000px]">
          {/* Left Panel */}
          <div className="subDivs col-start-1 col-span-12 row-start-4 row-span-8 md:col-start-1 md:col-end-9 md:row-span-12">
            <div className="flex justify-between items-center">
              <img
                src="main_logo.gif"
                className="md:block md:w-9 md:ml-5 md:pt-2 hidden"
              />
              <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_8px_#FFCC00] mt-2 ml-5 md:ml-0">
                Team :{" "}
                <span className="text-white [text-shadow:_0_0_8px_#FFCC00]">
                  {team}
                </span>
              </h1>
              {/* import time in seconds from server : auto submit function add */}
              {settings && (
                <Countdown
                  startSeconds={settings.quizTime}
                  resetOnStart={false}
                  onComplete={submitQuiz}
                />
              )}
            </div>
            <hr className="horizontalLine mt-2" />

            <QuizQuestionView
              question={activeQuestion}
              onAnswer={handleAnswer}
              selectedAnswer={answers[activeQuestion?._id]}
              disabled={submitted}
            />
          </div>

          {/* Right Panel */}
          <div className="subDivs mt-4 md:mt-0 col-start-1 col-span-12 row-span-3 md:col-start-9 md:col-end-13 md:row-span-10">
            <div className="flex justify-between items-center">
              <h1 className="hidden md:block text-white [text-shadow:_0_0_12px_#FFFFFF] font-[Orbitron] ml-5 font-semibold">
                {attempted} / {questions.length}
              </h1>

              <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] text-left mt-2 ml-5 md:ml-0 pb-2">
                Questions
              </h1>
              <img
                src="main_logo.gif"
                className="hidden md:block md:w-9 md:mr-5 md:pt-2 pb-2"
              />
              <h1 className="text-white md:hidden [text-shadow:_0_0_12px_#FFFFFF] font-[Orbitron] mr-5 font-semibold">
                {attempted} / {questions.length}
              </h1>
            </div>
            <hr className="horizontalLine" />

            <QuizQuestionsList
              questions={questions}
              activeId={activeQuestion?._id}
              onSelect={setActiveQuestion}
              answers={answers}
              disabled={submitted}
            />
          </div>

          {/* Submit div  */}
          <div className="md:bg-[rgba(0,0,0,0.5)] md:rounded-xl col-start-1 col-span-12 md:col-start-9 md:col-end-13 md:row-span-2 mt-4 md:mt-0 flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="font-[Orbitron] text-[#001f1a] bg-[#16fa8f] 
                px-12 py-2 text-3xl sm:text-4xl rounded-2xl 
                my-8 [box-shadow:_0_0_15px_#00FF9E] hover:bg-[#0fbf6d]"
              // submit pop up
              onClick={() => {
                toast((t) => (
                  <span>
                    Are you sure to Submit?
                    <button
                      className="ml-2 hover:bg-[#16fa8f] hover:text-black/80 px-4 py-1 font-bold rounded-md border-rounded bg-[#da2525] text-white/90"
                      onClick={() => {
                        submitQuiz();
                        toast.dismiss(t.id);
                      }}
                    >
                      Yes
                    </button>
                  </span>
                ));
              }}
            >
              {submit ? "Submitting..." : "Submit"}
            </motion.button>
          </div>
        </div>}
      </motion.div>
    </Layout>
  );
}

export default Quiz;
