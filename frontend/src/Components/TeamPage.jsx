import { useState, useContext, useEffect } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import TeamContext from "../Contexts/teamContext";
import axios from "axios";
import toast from "react-hot-toast";

function TeamPage() {
  const [teamname, setTeamname] = useState("");
  const navigate = useNavigate();

  const { setTeam } = useContext(TeamContext);

  const [results, setResults] = useState([]);

  useEffect(() => {
    const getResults = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/results");
        setResults(data);
      } catch (error) {
        toast.error("Failed to data");
      }
    };

    getResults();
  }, []);

  const handleTeam = (event) => {
    setTeamname(event.target.value.toUpperCase());
  };

  const handleForm = (e) => {
    e.preventDefault();

    const trimmedName = teamname.trim().toUpperCase();
    if (!trimmedName) return;

    const alreadySubmitted = results.some(
      (r) => r.teamName?.toUpperCase() === trimmedName
    );

    if (alreadySubmitted) {
      toast.error("Team has already submitted the quiz");
      return;
    }
    setTeam(trimmedName);
    navigate("/rules");
  };

  return (
    <Layout>
      <Header />
      {/* MAIN CONTENT */}
      <div className="pt-24 w-full min-h-screen bg-black/30 flex flex-col justify-center items-center px-4 py-10">
        {/* TITLE */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-[Orbitron] text-center text-[#34e47b] font-extrabold 
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
          [text-shadow:_0_0_10px_#3eeb91]"
        >
          CODE KE BOSS <br /> 2025
        </motion.h1>

        {/* SUBTITLE */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-[Montserrat] font-semibold text-center 
          text-2xl sm:text-3xl md:text-4xl 
          text-[#fcf53a] mt-4 
          [text-shadow:_0_0_12px_#FFCC00]"
        >
          THE ULTIMATE CODING BATTLE IS BACK!
        </motion.h2>

        {/* FORM */}
        <form
          className="flex flex-col items-center mt-8 w-full max-w-sm"
          onSubmit={handleForm}
        >
          {/* INPUT FIELD */}
          <motion.input
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileFocus={{ scale: 1.05 }}
            className="font-[Orbitron] text-center text-2xl sm:text-3xl 
          text-[#67dfbb] bg-black/30 border-2 border-[#67dfbb] 
            py-3 w-full
            [text-shadow:_0_0_.5px_#67dfbb,_0_0_1px_#67dfbb,_0_0_9px_#67dfbb]"
            type="text"
            onChange={handleTeam}
            placeholder="Team Name"
            value={teamname}
          />

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="font-[Orbitron] mt-5 w-40 sm:w-56 py-3 
            text-2xl sm:text-3xl rounded-2xl 
            bg-[#16fa8f] text-[#001f1a] 
            [box-shadow:_0_0_20px_#00FF9E]
            hover:bg-[#0fbf6d]"
            type="submit"
          >
            Start
          </motion.button>
        </form>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[#53edc3] text-xl sm:text-2xl md:text-3xl mt-6 text-center
          [text-shadow:_0_0_.5px_#67dfbb,_0_0_1px_#67dfbb,_0_0_9px_#67dfbb]"
        >
          Gear up, code hard, and rule the console.
        </motion.p>

        {/* ADMIN BUTTON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6"
        >
          <motion.button
            onClick={() => navigate("/adminAuth")}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            className="font-[Orbitron] bg-[#fa1616] text-white font-semibold 
            px-4 py-2 text-lg sm:text-xl rounded-2xl 
            [box-shadow:_0_0_15px_#fa1616] 
            hover:bg-[#8d1111]"
          >
            <i className="fa-solid fa-circle-user"></i> &nbsp; Admin
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}

export default TeamPage;
