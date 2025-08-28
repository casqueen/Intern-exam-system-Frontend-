import { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const ExamResults = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!user || user.student.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchResults();
  }, [examId]);

  const fetchResults = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:5000/api/v1/admin/exam-results/${examId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResults(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch results");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-primary mb-4">📊 Exam Results</h2>
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Exam Title</th>
              <th>Score</th>
              <th>Status</th>
              <th>Exam Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.studentId}>
                <td>{index + 1}</td>
                <td>{result.name}</td>
                <td>{result.email}</td>
                <td>{result.examTitle}</td>
                <td>{result.score}</td>
                <td>{result.passed}</td>
                <td>{result.examDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/exams")}>
            ⬅️ Back
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default ExamResults;