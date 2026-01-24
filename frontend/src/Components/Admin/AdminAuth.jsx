import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../Layout";
import axios from "axios";

export default function AdminAuth() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth", {
        password,
      });

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/adminPannel");
      }
    } catch (err) {
      alert("Invalid password");
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="w-[100%] bg-[rgba(0,0,0,0.2)] h-[100%] flex flex-col justify-center items-center">
        <form
          onSubmit={handleForm}
          className="flex flex-col mx-auto bg-[rgba(0,0,0,0.2)] p-8"
        >
          <h1 className="font-[Orbitron] text-[#34e47b] [text-shadow:_0_0_.5px_#3eeb91,_0_0_1px_#3eeb91,_0_0_10px_#3eeb91] text-3xl text-center">
            Enter verification password :
          </h1>

          <input
            type="password"
            className="font-[Orbitron] py-2 text-center text-2xl text-[#67dfbb] [text-shadow:_0_0_.5px_#67dfbb,_0_0_1px_#67dfbb,_0_0_9px_#67dfbb] mt-5 w-[450px] border-2 bg-[rgba(0,0,0,0.3)]"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="font-[Orbitron] text-[#001f1a] bg-[#ff3838f4] [box-shadow:_0_0_15px_#fa5716f4] mt-5 w-[14rem] mx-auto py-2 text-2xl rounded-2xl hover:[box-shadow:_0_0_15px_#00FF9E] hover:bg-[#16fa8f] cursor-pointer"
          >
            Authenticate
          </button>
        </form>
      </div>
    </Layout>
  );
}
