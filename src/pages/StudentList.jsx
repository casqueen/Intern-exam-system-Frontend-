import { useState, useEffect } from "react";
import { Container, Card, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Pagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      // toast.error("Access denied. Admins only.");
      navigate("/login");
      return;
    }
    fetchStudents();
  }, [page, search, user, navigate]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin?search=${search}&page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setStudents(response.data.students);
      setTotalPages(Math.ceil(response.data.pagination.total / limit));
    } catch (error) {
      toast.error(error.response?.data?.error);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/v1/admin/student/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          fetchStudents();
          Swal.fire("Deleted!", "Student deleted successfully", "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete student", "error");
        }
      }
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" color="primary" gutterBottom>
              📋 Student List
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/dashboard")}
              aria-label="Back to Dashboard"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <TextField
          label="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          margin="normal"
          aria-label="Search students"
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white" }}>#</TableCell>
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Registered</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {/* <Button
                      component={Link}
                      to={`/students/edit/${student._id}`}
                      variant="outlined"
                      color="warning"
                      sx={{ mr: 1 }}
                      size="small"
                      aria-label={`Edit ${student.name}`}
                    >
                      ✏️ Edit
                    </Button> */}
                    <Button
                      component={Link}
                      to={`/results/${student.email}`}
                      variant="outlined"
                      color="info"
                      sx={{ mr: 3 }}
                      size="small"
                      aria-label="View Result"
                    >
                      📊 View Result
                    </Button>        
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(student._id)}
                      size="small"
                      aria-label={`Delete ${student.name}`}
                    >
                      ❌ Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 2, justifyContent: "center", display: "flex" }}
          aria-label="Pagination"
        />
      </Card>
    </Container>
  );
};

export default StudentList;