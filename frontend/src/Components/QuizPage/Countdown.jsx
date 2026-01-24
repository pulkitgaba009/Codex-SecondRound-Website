import { useEffect, useState, useRef, useContext } from "react";
import TimeContext from "../../Contexts/timeContext";

export default function Countdown({
  startSeconds = 120,
  onComplete,
  resetOnStart = false,
}) {
  const completedRef = useRef(false);
  const [time, setTime] = useState(startSeconds);

  const { setTimeData } = useContext(TimeContext);

  useEffect(() => {
  setTimeData(time); 
}, [time, setTimeData]);


  // Reset logic
  useEffect(() => {
    if (resetOnStart) {
      setTime(startSeconds);
      completedRef.current = false;
    }
  }, [startSeconds, resetOnStart]);

  // Timer effect
  useEffect(() => {
    if (time <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onComplete]);

  const minutes = Math.floor(Math.max(0, time) / 60);
  const seconds = Math.max(0, time) % 60;

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="font-bold text-red-700 bg-black/60 border border-red-700 mr-5 px-3 rounded-md font-[Orbitron]">
        {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
}
