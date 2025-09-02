import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Home from "./pages/Home";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import QuestionList from "./pages/QuestionList";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionDetails from "./pages/QuestionDetails";
import TestingRoom from "./pages/TestingRoom";
import TakeExams from "./pages/TakeExams";
import Footer from "./components/Footer";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavbarComponent />
          <main style={{ flexGrow: 1 }}>
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
              <Route path="/take-exams" element={<TakeExams />} />
              <Route path="/testing-room" element={<TestingRoom />} />
              <Route path="/testing-room/:id" element={<TestingRoom />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/exams/results/:examId" element={<ExamResults />} />
              <Route path="/my-exams" element={<StudentExamList />} />
              <Route path="/questions" element={<QuestionList />} />
              <Route path="/questions/create" element={<CreateQuestion />} />
              <Route path="/questions/edit/:id" element={<CreateQuestion />} />
              <Route path="/questions/view/:id" element={<QuestionDetails />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;