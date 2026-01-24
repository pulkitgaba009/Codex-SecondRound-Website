import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loading, RateLimiting } from "../../Helper";

const convertToSeconds = ({ hrs = 0, min = 0, sec = 0 }) => {
  return Number(hrs || 0) * 3600 + Number(min || 0) * 60 + Number(sec || 0);
};

function QuizDashboard() {
  const [isOn, setIsOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);

  const [formData, setFormData] = useState({
    num: 10,
    hrs: "",
    min: "",
    sec: "",
  });

  // api states
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [update,setUpdate] = useState(false);

  const getSettings = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/settings");
    
        const hours = Math.floor(data[0].quizTime / 3600);
        const minuts = Math.floor((data[0].quizTime % 3600) / 60);
        const seconds = data[0].quizTime % 60;
        
        setIsOn(data[0].quizStatus);
        setFormData({
          num: data[0].questionNumbers,
          hrs: hours,
          min: minuts,
          sec: seconds,
        });
        setIsShuffleOn(data[0].shuffleStatus);
        console.log();
      } catch (error) {
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to load setting");
        }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getSettings();
  }, []);

  const toggleHandler = () => setIsOn((prev) => !prev);
  const toggleShuffleHandler = () => setIsShuffleOn((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalSeconds = convertToSeconds(formData);

    if (formData.num <= 0) {
      alert("Number of questions must be greater than 0");
      return;
    }

    if (totalSeconds <= 0) {
      alert("Quiz time must be greater than 0");
      return;
    }

    const payload = {
      questionNumbers: formData.num,
      quizTime: totalSeconds,
      quizStatus: isOn,
      shuffleStatus: isShuffleOn,
    };

    const putSettings = async()=>{
      try{
        setUpdate(true);
        await axios.put("http://localhost:3000/api/settings/6962af0a6027944aebae060c",payload);
        getSettings();
        toast.success("Settings Updated Successfully !!!");
      }catch(error){
        if (error.response?.status === 429) {
          setRateLimited(true);
        } else {
          toast.error("Failed to update settings");
        }
      }finally{
         setUpdate(false);
      }
    }

    putSettings();

    console.log("Quiz Settings Payload:", payload);
  };

  // Loading state
  if (loading) return <Loading />;

  // Rate limit state
  if (rateLimited) return <RateLimiting />;

  return (
    <div className="box flex justify-center items-center">
      <div className="subDivs h-[65%] rounded-lg">
        <h1 className="authHeading">Quiz Control Panel</h1>
        <hr className="horizontalLine mt-2" />
        <br />

        <form onSubmit={handleSubmit}>
          <div className="w-full px-4">
            {/* Number of Questions */}
            <label className="label">Number of Questions:</label>
            <input
              type="number"
              className="input w-[145px] text-center"
              name="num"
              value={formData.num}
              onChange={handleChange}
              min={1}
            />

            <br />
            <br />

            {/* Quiz Time */}
            <label className="label">Quiz Time:</label>
            <input
              type="number"
              className="input w-[80px] text-center"
              name="hrs"
              placeholder="hrs"
              value={formData.hrs}
              onChange={handleChange}
              min={0}
            />
            <input
              type="number"
              className="input w-[80px] text-center"
              name="min"
              placeholder="min"
              value={formData.min}
              onChange={handleChange}
              min={0}
              max={59}
            />
            <input
              type="number"
              className="input w-[80px] text-center"
              name="sec"
              placeholder="sec"
              value={formData.sec}
              onChange={handleChange}
              min={0}
              max={59}
            />

            <br />
            <br />

            {/* Quiz Status */}
            <label className="label">Quiz Active Status:</label>
            <button
              type="button"
              onClick={toggleHandler}
              className={`ml-23 px-6 py-2 text-xl rounded-2xl font-[Orbitron] transition-all font-semibold ${
                isOn ? "bg-[#16fa8f] text-[#001f1a]" : "bg-[#fa1616] text-white"
              }`}
            >
              {isOn ? "ON" : "OFF"}
            </button>

            <br />
            <br />

            {/* Shuffle Status */}
            <label className="label">Shuffle Quiz Questions:</label>
            <button
              type="button"
              onClick={toggleShuffleHandler}
              className={`ml-10 px-6 py-2 text-xl rounded-2xl font-[Orbitron] transition-all font-medium ${
                isShuffleOn
                  ? "bg-[#16fa8f] text-[#001f1a]"
                  : "bg-[#fa1616] text-white"
              }`}
            >
              {isShuffleOn ? "ON" : "OFF"}
            </button>

            <br />
            <br />

            {/* Submit */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="font-[Orbitron] font-semibold text-white bg-[#fa1616] w-[80%] py-2 text-xl rounded-2xl hover:bg-[#16fa8f]"
              >
                {update?"Updating Settings...":"Save Quiz Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizDashboard;
