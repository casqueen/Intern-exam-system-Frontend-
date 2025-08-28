import { useState, useEffect } from "react";
import { Container, Table, Button, Form, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // UPDATED: Added for delete confirmation
import useAuthStore from "../store/authStore";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.student.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // UPDATED: Use /api/v1 endpoint
      const response = await axios.get(`http://localhost:5000/api/v1/admin?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudents(response.data.students);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch students");
    }
  };

  // UPDATED: Added delete student function
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
          const response = await axios.delete(`http://localhost:5000/api/v1/admin/student/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setStudents(students.filter((student) => student._id !== id));
          Swal.fire("Deleted!", response.data.message, "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete student", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <Row>
          <Col sm={8}>
            <h2 className="text-primary mb-4">📋 Student List</h2>
          </Col>
          <Col sm={4} className="text-end">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              ⬅️ Back
            </Button>
          </Col>
        </Row>
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchStudents();
            }}
          />
        </Form>
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    size="sm"
                    onClick={() => navigate(`/students/edit/${student._id}`)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(student._id)}
                  >
                    ❌ Delete
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

export default StudentList;