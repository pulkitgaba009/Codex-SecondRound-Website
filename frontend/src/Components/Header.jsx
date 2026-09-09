import { motion } from "framer-motion";

function Header() {
  return (
    <div>
      {/* Top Nav */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full h-16 sm:h-20
        bg-black/60 backdrop-blur-md 
        flex items-center justify-between 
        px-4 sm:px-8 z-50"
      >
        <div className="bg-white h-12 py-2 px-10 rounded-full flex items-center">
          <img src="/UUlogo.png" className="w-full h-full object-contain" />
        </div>

        <h1
          className="hidden sm:block font-[Orbitron] text-white font-bold 
          text-base sm:text-xl md:text-2xl lg:text-3xl 
          [text-shadow:_0_0_10px_#3eeb91] text-center"
        >
          UTTARANCHAL SCHOOL OF COMPUTING SCIENCES
        </h1>

        
      </motion.div>
    </div>
  );
}

export default Header;