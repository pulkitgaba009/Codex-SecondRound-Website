import { useState, useContext, useEffect } from "react";
import Layout from "../Layout";
import QuizQuestionsList from "./QuizQuestionList";
import QuizQuestionView from "./QuizQuestionView";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";
import Header from "../Header";
import TeamContext from "../../Contexts/teamContext";
import TimeContext from "../../Contexts/timeContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Loading } from "../../Helper";
import SecureQuiz from "./SecureQuiz";
import LanguageSelector from "./LanguageSelector";
import { LanguageConfig } from "../../data/languageConfig.js";
import CodeEditor from "./CodeEditor.jsx";

function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [language, setLanguage] = useState("javascript");

  const [codeMap, setCodeMap] = useState({});
  const [editorValue, setEditorValue] = useState("");

  const getInitialCode = (question, language, codeMap) => {
    if (!question) return "";

    if (codeMap?.[question._id]?.[language]) {
      return codeMap[question._id][language];
    }

    return question.starterCode?.[language] || "";
  };

  useEffect(() => {
    if (!activeQuestion || !language) return;

    const code = getInitialCode(activeQuestion, language, codeMap);
    setEditorValue(code);
  }, [activeQuestion, language]);

  const handleCodeChange = (value) => {
    setEditorValue(value);

    if (!activeQuestion) return;

    setCodeMap((prev) => ({
      ...prev,
      [activeQuestion._id]: {
        ...prev[activeQuestion._id],
        [language]: value,
      },
    }));
  };

  const navigate = useNavigate();
  const { team } = useContext(TeamContext);
  const { timeData } = useContext(TimeContext);

  /* ---------------- SETTINGS ---------------- */
  useEffect(() => {
    const getSettings = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/settings");
        setSettings(data[0]);
      } catch {
        toast.error("Failed to load quiz settings");
      }
    };
    getSettings();
  }, []);

  /* ---------------- QUESTIONS ---------------- */
  useEffect(() => {
    if (!settings) return;

    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/question");

        let final = [...data];
        if (settings.shuffleStatus) {
          final.sort(() => Math.random() - 0.5);
        }

        final = final.slice(0, settings.questionNumbers);

        setQuestions(final);
        setActiveQuestion(final[0] || null);
      } catch {
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [settings]);

  /* ---------------- SUBMIT ---------------- */
  const submitQuiz = () => {
    if (submitted) return;
    setSubmitted(true);
    toast.success("Quiz submitted");
    navigate("/end");
  };

  if (!team) {
    navigate("/end");
    return null;
  }

  return (
    <Layout>
      {/* <SecureQuiz onAutoSubmit={submitQuiz} />  */}

      <Header />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="h-[85vh] w-full overflow-hidden mt-20"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="h-full w-full flex justify-center">
            <div className="h-full w-full max-w-[1800px] px-16">
              <div className="h-full w-full grid grid-cols-12 gap-6">
                <div className="subDivs col-span-7 h-full flex flex-col min-h-0">
                  <div className="flex justify-between items-center px-5 pt-3">
                    <QuizQuestionsList
                      questions={questions}
                      activeId={activeQuestion?._id}
                      onSelect={setActiveQuestion}
                      disabled={submitted}
                    />
                    <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00]">
                      Team : <span className="text-white">{team}</span>
                    </h1>

                    {settings && (
                      <Countdown
                        startSeconds={settings.quizTime}
                        resetOnStart={false}
                        onComplete={submitQuiz}
                      />
                    )}
                  </div>

                  <hr className="horizontalLine mt-4" />

                  {/* QUESTION CONTENT — SCROLLS ONLY HERE */}
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <QuizQuestionView
                      question={activeQuestion}
                      disabled={submitted}
                    />
                  </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="subDivs col-span-5 h-full flex flex-col min-h-0">
                  {/* HEADER */}
                  <div className="flex justify-between items-center px-5 pt-3">
                    <LanguageSelector
                      languages={LanguageConfig}
                      value={language}
                      onChange={setLanguage}
                    />

                    <button
                      className="bg-[#16fa8f] font-[Orbitron] px-6 py-1 rounded-lg font-semibold mb-3"
                      onClick={() => {
                        toast((t) => (
                          <span>
                            Submit quiz?
                            <button
                              className="ml-2 px-4 py-1 bg-red-600 text-white rounded-md"
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
                      Submit
                    </button>
                  </div>

                  <hr className="horizontalLine mt-1" />
                  <CodeEditor
                    language={language}
                    value={editorValue}
                    onChange={handleCodeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}

export default Quiz;
