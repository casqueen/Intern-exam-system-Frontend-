import { useState, useEffect } from "react";
import { Container, Form, Button, Card, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!user || user.student.role !== "student") {
      toast.error("Access denied. Students only.");
      navigate("/dashboard");
      return;
    }
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      // UPDATED: Use /api/v2 endpoint
      const response = await axios.get(`http://localhost:6000/api/v2/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExam(response.data);
      setAnswers(response.data.questions.map((q) => ({
        questionId: q._id,
        selectedOption: "",
      })));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId ? { ...answer, selectedOption } : answer
      )
    );
  };

  const handleSubmit = async () => {
    if (answers.some((answer) => !answer.selectedOption)) {
      toast.error("Please answer all questions");
      return;
    }
    try {
      // UPDATED: Use /api/v2 endpoint
      const response = await axios.post(
        `http://localhost:6000/api/v2/student/exams/${id}/submit`,
        { studentId: user.student._id, answers },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(response.data.message);
      navigate(`/result/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit exam");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-primary mb-4">🎯 Take Exam: {exam?.title}</h2>
        {exam ? (
          <>
            <ListGroup>
              {exam.questions.map((question, index) => (
                <ListGroup.Item key={question._id}>
                  <h5>Question {index + 1}: {question.question}</h5>
                  <Form>
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="radio"
                        label={option}
                        name={`question-${question._id}`}
                        value={option}
                        checked={answers.find((a) => a.questionId === question._id)?.selectedOption === option}
                        onChange={() => handleAnswerChange(question._id, option)}
                      />
                    ))}
                  </Form>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="mt-4 text-center">
              <Button variant="success" onClick={handleSubmit}>
                ✅ Submit Exam
              </Button>
              <Button variant="secondary" className="ms-3" onClick={() => navigate("/exams")}>
                ⬅️ Cancel
              </Button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Card>
    </Container>
  );
};

export default TakeExam;