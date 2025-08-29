import { useState, useEffect } from "react";
import { Container, Table, Button, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const StudentExamList = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // useEffect(() => {
  //   if (!user || user?.student?.role !== "student") {
  //     toast.error("Access denied. Students only.");
  //     navigate("/dashboard");
  //     return;
  //   }
  //   fetchExams();
  // }, []);

  const fetchExams = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:8080/api/v1/student/${user?.student?._id}/exams`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExams(response.data.exams);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exams");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <Row>
          <Col sm={8}>
            <h2 className="text-primary mb-4">📝 My Exams</h2>
          </Col>
          <Col sm={4} className="text-end">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              ⬅️ Back
            </Button>
          </Col>
        </Row>
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Score</th>
              <th>Status</th>
              <th>Exam Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={exam.examId}>
                <td>{index + 1}</td>
                <td>{exam.title}</td>
                <td>{exam.score}</td>
                <td>{exam.passed ? "✅ Passed" : "❌ Failed"}</td>
                <td>{exam.examDate}</td>
                <td>
                  <Button as={Link} to={`/result/${exam.examId}`} variant="info" size="sm">
                    📊 View Result
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default StudentExamList;