import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function Detailed() {
  const [data, setData] = useState();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/result/${id}`,
        );
        setData(result.data);
      } catch (error) {
        toast.error("Error in loading data");
      }
    };

    getData();
  }, [id]);

    const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const timeTaken =
    data?.totalTime && data?.timeRemaining
      ? data.totalTime - data.timeRemaining
      : null;

  return (
    <div className="w-screen h-[90vh] flex justify-center items-center">
      <div className="subDivs w-[90%] h-[90%] max-w-[1000px] ">
        {/* Top */}
        <div className="flex justify-evenly mx-4">
        <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2 ">
          Team :
          <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
            {data?.teamName}
          </span>
        </h1>
        <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2">
          Score :
          <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
            {data?.score}
          </span>
        </h1>
        <h1 className="font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00] mt-2">
          Time :
          <span className="text-white [text-shadow:_0_0_8px_#FFCC00] ml-2">
            {timeTaken !== null ? formatTime(timeTaken) : "--"}
          </span>
        </h1>
        </div>
        
        <hr className="horizontalLine mt-2" />
        <div className="h-[90%] m-2 overflow-auto scrollbar-hidden"></div>
      </div>
    </div>
  );
}

export default Detailed;
