import { useEffect, useState } from "react";
import Layout from "../Layout";
import { motion } from "framer-motion";
import axios from "axios";
import { Loading, RateLimiting } from "../../Helper";
import toast from "react-hot-toast";

/* ---------- TIME FORMATTER ---------- */
const formatTime = (seconds = 0) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    String(hrs).padStart(2, "0"),
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");
};

/* ---------- SORT FUNCTION ---------- */
const sortByScoreAndTime = (results) => {
  return [...results].sort((a, b) => {
    // 1️⃣ Higher score first
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // 2️⃣ Higher remaining time first (faster submission)
    return b.timeRemaining - a.timeRemaining;
  });
};


function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [results, setResults] = useState([]);

  const getResults = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/results");
      setResults(data);
    } catch (error) {
      if (error.response?.status === 429) {
        setRateLimited(true);
      } else {
        toast.error("Failed to load leaderboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/results/${id}`);
      setResults((prev) => prev.filter((item) => item._id !== id));
      toast.success("Result deleted");
    } catch {
      toast.error("Failed to delete result");
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  if (loading) return <Loading />;
  if (rateLimited) return <RateLimiting />;

  const sortedResults = sortByScoreAndTime(results);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center box"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-7xl bg-black/50 backdrop-blur-xl
          rounded-2xl"
        >
          {/* SCROLL CONTAINER */}
          <div className="mt-4 max-h-[82vh] overflow-y-auto scrollbar-hidden">
            <table className="w-full text-white border-collapse">
              <thead className="authHeading sticky top-0 bg-black/70 backdrop-blur-xl z-10">
                <tr>
                  <th className="py-4 px-4 font-[Orbitron] text-xl text-center">#</th>
                  <th className="py-4 px-4 font-[Orbitron] text-xl text-left">Team Name</th>
                  <th className="py-4 px-4 font-[Orbitron] text-xl text-center">Score</th>
                  <th className="py-4 px-4 font-[Orbitron] text-xl text-center">
                    Time Remaining
                  </th>
                  <th className="py-4 px-4 font-[Orbitron] text-xl text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {sortedResults.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="py-3 px-4 text-center  text-white/80  [text-shadow:_0_0_20px_#ffffff] font-[Orbitron] font-bold">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4 font-[Orbitron] text-white/80  [text-shadow:_0_0_20px_#ffffff] ">
                      {item.teamName}
                    </td>

                    <td className="py-3 px-4 font-[Orbitron] text-center text-[#16fa8f] font-bold [text-shadow:_0_0_20px_#16fa8f]">
                      {item.score}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[#34e47b] [text-shadow:_0_0_20px_#16fa8f]">
                      {formatTime(item.timeRemaining)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteResult(item._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-1
                        rounded-lg font-semibold transition-all font-[Orbitron]"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {sortedResults.length === 0 && (
              <div className="text-center font-[Orbitron] py-10 text-gray-400 [text-shadow:_0_0_20px_#ffffff]">
                No results available
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
