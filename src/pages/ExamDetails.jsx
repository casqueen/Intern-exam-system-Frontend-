import { useState, useEffect } from "react";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExam(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-primary mb-4">📋 Exam Details</h2>
        {exam ? (
          <>
            <h4>{exam.title}</h4>
            <p>Created: {new Date(exam.createdAt).toLocaleDateString()}</p>
            <h5>Questions:</h5>
            <ListGroup>
              {exam.questions.map((q, index) => (
                <ListGroup.Item key={q._id}>
                  <strong>Question {index + 1}:</strong> {q.question}
                  <br />
                  <strong>Options:</strong> {q.options.join(", ")}
                  <br />
                  <strong>Correct Answer:</strong> {q.correctAnswer}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="mt-4">
              <Button variant="primary" as={Link} to={`/exams/edit/${exam._id}`} className="me-2">
                ✏️ Edit Exam
              </Button>
              <Button variant="secondary" onClick={() => navigate("/exams")}>
                ⬅️ Back
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

export default ExamDetails;