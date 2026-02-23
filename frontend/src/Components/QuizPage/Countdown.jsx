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

  // Share time via context
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

  // Timer logic
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

  // ---- TIME CALCULATION ----
  const safeTime = Math.max(0, time);
  const hours = Math.floor(safeTime / 3600);
  const minutes = Math.floor((safeTime % 3600) / 60);
  const seconds = safeTime % 60;

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="font-bold text-red-700 bg-black/60 border border-red-700 mr-5 px-3 rounded-md font-[Orbitron]">
        {String(hours).padStart(2, "0")} : &nbsp;
        {String(minutes).padStart(2, "0")} :&nbsp;
        {String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
}