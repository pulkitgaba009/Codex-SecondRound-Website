import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Loading } from "../../Helper";
import Layout from "../Layout";

function Detailed() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getResult = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/result/${id}`,
        );
        setData(data);
      } catch (error) {
        toast.error("Error in loading result data");
      }
    };

    getResult();
  }, [id]);

  useEffect(() => {
    const getSettings = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/settings");
        setSettings(data?.[0]);
      } catch (error) {
        toast.error("Error in loading settings");
      } finally {
        setLoading(false);
      }
    };

    getSettings();
  }, []);

  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const totalTime = settings?.quizTime ?? data?.totalTime ?? 0;

  const timeTaken =
    data?.timeRemaining != null
      ? Math.max(totalTime - data.timeRemaining, 0)
      : 0;
  if (loading || !data) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="bg-[rgba(0,0,0,0.5)] w-screen absolute top-0 flex justify-between items-center">
        <img
          src="/Codex-logo.png"
          alt="Codex Logo"
          className="p-[0.5rem] ml-[4rem] h-[4rem]"
        />

        <button
          onClick={() => {
            navigate(`/adminPannel/leadboard`);
          }}
          className="bg-[#34e47b] hover:bg-[#27c064] px-4 py-1 mr-[4rem] rounded-2xl font-semibold transition-all font-[Orbitron] text-blue-950"
        >
          Leadboard
        </button>
      </div>
      <div className="w-screen h-[90vh] flex justify-center items-center mt-8">
        <div className="subDivs w-[90%] h-[90%] max-w-[1100px]">
          {/* Top Section */}
          <div className="flex justify-evenly mx-4">
            <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2">
              Team :
              <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
                {data.teamName}
              </span>
            </h1>

            <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2">
              Score :
              <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
                {data.score}
              </span>
            </h1>

            <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2">
              Time :
              <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
                {formatTime(timeTaken)}
              </span>
            </h1>
          </div>

          <hr className="horizontalLine mt-2" />

          {/* Content Area */}
          <div className="h-[90%] m-2 overflow-auto scrollbar-hidden space-y-6">
            {data?.results?.map((item, index) => (
              <div
                key={item.questionId}
                className="bg-[#0b0b0f] rounded-2xl border border-[#1f1f2e]"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-[#1f1f2e]">
                  <h2 className="question text-[#fcf53a] [text-shadow:_0_0_10px_#FFCC00]">
                    Question {index + 1}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide font-[Orbitron]  ${
                      item.verdict === "Accepted"
                        ? "bg-[#1f7a1f] text-white"
                        : "bg-[#7a1f1f] text-white"
                    }`}
                  >
                    {item.verdict}
                  </span>
                </div>

                {/* Language */}
                <p className="text-sm text-[#34e47b] [text-shadow:_0_0_20px_#16fa8f] px-4 mt-2 font-[Orbitron] font-bold">
                  Language:
                  <span className="ml-2 text-white font-medium uppercase code">
                    {item.language}
                  </span>
                </p>

                {/* Code */}
                <div className="p-3">
                  <SyntaxHighlighter
                    language={item.language?.toLowerCase()}
                    style={atomDark}
                    customStyle={{
                      borderRadius: "8px",
                      padding: "1rem",
                      fontSize: "0.9rem",
                      backgroundColor: "oklch(12.9% 0.042 264.695)",
                    }}
                  >
                    {item.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {(!data?.results || data.results.length === 0) && (
              <div className="text-center text-gray-400 mt-10">
                No submissions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Detailed;
