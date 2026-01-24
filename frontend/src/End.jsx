import Layout from "./Components/Layout";
import { motion } from "framer-motion";

function End() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center items-center min-h-[80vh]"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative bg-[rgba(0,0,0,0.6)] py-16 px-8 md:px-32 rounded-4xl 
                     border border-text-[#34e47b]
                     [box-shadow:_0_0_40px_rgba(252,245,58,0.35)]"
        >
          {/* Glow Ring */}
          <div className="absolute inset-0 rounded-4xl 
                          [box-shadow:_0_0_80px_#34e47b] 
                          pointer-events-none" />

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-[Orbitron] font-bold text-4xl md:text-5xl 
                       text-[#fcf53a] text-center 
                       [text-shadow:_0_0_20px_#FFCC00]"
          >
            Thank You For Participation !!!
          </motion.h1>

          {/* Sub text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center font-[Orbitron] text-xl [text-shadow:_0_0_20px_#34e47b] text-[#34e47b] font-medium"
          >
            NEXT ROUND WILL BE STARTING SOON !!!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center font-[Orbitron] text-xl text-white/90  [text-shadow:_0_0_20px_#ffffff] font-medium"
          >
            FUTHER UPDATES WILL BE PROVIDED ON WATSAPP GROUP
          </motion.p>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export default End;
