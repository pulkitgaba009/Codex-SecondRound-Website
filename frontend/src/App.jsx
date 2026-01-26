import { Routes, Route } from "react-router-dom";
import TeamPage from "./Components/TeamPage";
import Rules from "./Components/Rules";
import AdminAuth from "./Components/Admin/AdminAuth";
import AdminRoute from "./AdminRoute";

// Admin Pannel
import QuizDashboard from "./Components/Admin/QuizDashboard";
import AdminLayout from "./Components/Admin/AdminLayout";
import AddQuestion from "./Components/Admin/AddQuestion";
import EditQuestion from "./Components/Admin/EditQuestion";
import Leadboard from "./Components/Admin/Leadboard";
import Quiz from "./Components/QuizPage/Quiz";
import End from "./End";
import DontExist from "./DontExist";
import Detailed from "./Components/Admin/Detailed";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TeamPage />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/end" element={<End />} />
        <Route path="/adminAuth" element={<AdminAuth />} />

        <Route
          path="/adminPannel"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<QuizDashboard />} />
          <Route path="addQuestion" element={<AddQuestion />} />
          <Route path="editQuestion" element={<EditQuestion />} />
          <Route path="leadboard" element={<Leadboard />}/>
          <Route path="view/:id" element={<Detailed/>}/>
        </Route>
          <Route path="*" element={<DontExist/>}/>
      </Routes>
    </>
  );
}

export default App;
