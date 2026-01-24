import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TeamContextProvider from "./Contexts/TeamContextProvider.jsx";
import { Toaster } from "react-hot-toast";
import TimeContextProvider from "./Contexts/TimeContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TeamContextProvider>
      <TimeContextProvider>
        <App />
        <Toaster />
      </TimeContextProvider>
    </TeamContextProvider>
  </BrowserRouter>
);
