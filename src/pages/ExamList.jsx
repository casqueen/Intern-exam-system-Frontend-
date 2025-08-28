import { useState, useEffect } from "react";
import { Container, Table, Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view exams");
      navigate("/login");
      return;
    }
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:5000/api/v1/exams`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExams(response.data.exams);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exams");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5000/api/v1/exams/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setExams(exams.filter((exam) => exam._id !== id));
          Swal.fire("Deleted!", response.data.message, "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete exam", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <Row>
          <Col sm={8}>
            <h2 className="text-primary mb-4">📝 Exam List</h2>
          </Col>
          <Col sm={4} className="text-end">
            {user?.student.role === "admin" && (
              <Button variant="primary" onClick={() => navigate("/exams/create")} className="me-3">
                ➕ Create Exam
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              ⬅️ Back
            </Button>
          </Col>
        </Row>
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams
              .filter((exam) => exam.title.toLowerCase().includes(search.toLowerCase()))
              .map((exam, index) => (
                <tr key={exam._id}>
                  <td>{index + 1}</td>
                  <td>{exam.title}</td>
                  <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user?.student.role === "admin" ? (
                      <>
                        <Button as={Link} to={`/exams/view/${exam._id}`} variant="info" className="me-2" size="sm">
                          👁 View
                        </Button>
                        <Button as={Link} to={`/exams/edit/${exam._id}`} variant="warning" className="me-2" size="sm">
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="me-2"
                          size="sm"
                          onClick={() => handleDelete(exam._id)}
                        >
                          ❌ Delete
                        </Button>
                        <Button as={Link} to={`/exams/results/${exam._id}`} variant="warning" className="me-2" size="sm">
                          📊 View Results
                        </Button>
                      </>
                    ) : (
                      <Button as={Link} to={`/exams/take/${exam._id}`} variant="success" className="me-2" size="sm">
                        🎯 Take Exam
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default ExamList;