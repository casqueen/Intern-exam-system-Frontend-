import { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user || user.student.role !== "student") {
      toast.error("Access denied. Students only.");
      navigate("/dashboard");
      return;
    }
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:6000/api/v1/student/results/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResult(response.data.examResult);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch result");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-primary mb-4">📊 Exam Result</h2>
        {result ? (
          <>
            <h4>{result.exam.title}</h4>
            <p>{result.message}</p>
            <p><strong>Score:</strong> {result.exam.score}</p>
            <p><strong>Status:</strong> {result.exam.status}</p>
            <p><strong>Exam Date:</strong> {result.examDate}</p>
            <h5>Answers:</h5>
            <ListGroup>
              {result.answers.map((answer, index) => (
                <ListGroup.Item key={answer.questionId}>
                  <strong>Question {index + 1}:</strong> {answer.question}
                  <br />
                  <strong>Your Answer:</strong> {answer.selectedOption} {answer.isCorrect ? "✅" : "❌"}
                  <br />
                  <strong>Correct Answer:</strong> {answer.correctAnswer}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => navigate("/exam-list")}>
                ⬅️ Back to Exams
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

export default Result;