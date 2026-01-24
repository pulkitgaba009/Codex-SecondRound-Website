import Layout from "./Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  let nevigate = useNavigate();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-screen bg-[rgba(0,0,0,0.5)] flex flex-col items-center px-4 py-10"
      >
        {/* MAIN TITLE */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-[Orbitron] font-bold text-4xl sm:text-5xl md:text-6xl 
          text-[#fcf53a] text-center
          [text-shadow:_0_0_12px_#FFCC00]"
        >
          Rules Of Conduct
        </motion.h1>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] 
          bg-[rgba(255,0,0,0.05)] mt-8 p-6 sm:p-10 rounded-xl 
          backdrop-blur-lg shadow-[0_0_25px_rgba(0,255,170,0.25)]
          overflow-hidden"
        >
          {/* INTRO TITLES */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-[Orbitron] text-[#34e47b] text-xl sm:text-2xl 
            text-center [text-shadow:_0_0_10px_#3eeb91]"
          >
            Welcome to the first challenge of Code Ke Boss 2025!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-[Montserrat] mt-2 text-[#ffffff] text-center 
            text-sm sm:text-base md:text-lg 
            [text-shadow:_0_0_10px_#3eeb91]"
          >
            Before you dive into coding mayhem, it’s time to prove that your
            brain is as sharp as your code.
          </motion.p>

          {/* SCROLLABLE CONTENT */}
          <div className="w-full mt-6 max-h-[60vh] overflow-y-auto scrollbar-hidden px-2 sm:px-4 pb-10">
            {/* 🔥 Format */}
            <motion.h3
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="ruleHeadings"
            >
              Format
            </motion.h3>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="rulePara list-disc ml-5"
            >
              <li>Type: Multiple Choice Questions (MCQ) + Rapid Fire</li>
              <li>Number of Questions: 15 MCQs + 5 Rapid Fire</li>
              <li>Time Limit: 20 minutes</li>
              <li>Mode: Online interface / on-paper (as per setup)</li>
            </motion.ul>

            <br />

            {/* 🔥 Topics Covered */}
            <motion.h3
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="ruleHeadings"
            >
              Topics Covered
            </motion.h3>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="rulePara list-disc ml-5"
            >
              <li>Programming Basics – syntax, debugging, concepts</li>
              <li>Algorithms & Data Structures – logic and implementation</li>
              <li>Tech Trivia – inventions, programming history, fun facts</li>
              <li>Problem-Solving – logical puzzles & output predictions</li>
            </motion.ul>

            <br />

            {/* 🔥 Rules */}
            <motion.h3
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="ruleHeadings"
            >
              Rules
            </motion.h3>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="rulePara list-disc ml-5"
            >
              <li>Each correct answer = +4 points</li>
              <li>Wrong answer = –1 point (negative marking)</li>
              <li>No external resources allowed.</li>
              <li>Rapid Fire: 30 seconds per question. No going back.</li>
              <li>Top 5 teams qualify for Round 2.</li>
            </motion.ul>

            <br />

            {/* Divider */}
            <motion.hr
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="h-[2px] border-0 rounded bg-white shadow-[0_0_20px_#FFD700]"
            />

            <br />

            {/* BOTTOM TAGLINES */}
            <motion.h4
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="font-[Orbitron] text-center text-xl sm:text-2xl 
              text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]"
            >
              Gear up, code boss. The console awaits.
            </motion.h4>

            <motion.h4
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="font-[Montserrat] mt-2 text-center text-sm sm:text-base text-[#e6dede] 
              [text-shadow:_0_0_5px_#ffffff]"
            >
              Speed + accuracy = victory. Don’t get stuck — move fast and trust your instincts.
            </motion.h4>

            {/* BUTTON */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full flex justify-center mt-6"
            >
              <motion.button
                // start or not start : diable button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="font-[Orbitron] text-[#001f1a] bg-[#16fa8f] 
                px-8 py-2 text-3xl sm:text-4xl rounded-2xl 
                my-8 [box-shadow:_0_0_15px_#00FF9E] hover:bg-[#0fbf6d]" 
                onClick={()=>nevigate('/quiz')}
              >
                Start
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
