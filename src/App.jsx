import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import StudentList from "./pages/StudentList";
import ExamList from "./pages/ExamList";
import ExamDetails from "./pages/ExamDetails";
import CreateExam from "./pages/CreateExam";
import TakeExam from "./pages/TakeExam";
import Result from "./pages/Result";
import ExamResults from "./pages/ExamResults";
import StudentExamList from "./pages/StudentExamList";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100"> 
        <NavbarComponent />
        <main className="flex-grow-1"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/view/:id" element={<ExamDetails />} />
            <Route path="/exams/create" element={<CreateExam />} />
            <Route path="/exams/edit/:id" element={<CreateExam />} />
            <Route path="/exams/take/:id" element={<TakeExam />} />
            <Route path="/result/:id" element={<Result />} />
            <Route path="/exams/results/:examId" element={<ExamResults />} />
            <Route path="/exam-list" element={<StudentExamList />} />
          </Routes>
        </main>
        <Footer /> 
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;