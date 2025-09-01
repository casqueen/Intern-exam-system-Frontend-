import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Pagination,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";
const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  useEffect(() => {
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/");
      return;
    }
    setPage(1); // Reset to page 1 when search or user changes
    fetchExams();
  }, [search, user]);
  useEffect(() => {
    fetchExams();
  }, [page]);
  const fetchExams = async () => {
    try {
      const url = `http://localhost:8080/api/v1/exams?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      const response = await axios.get(url, config);
      console.log("Fetched exams:", response.data); // Debug: Log API response
      setExams(response.data.exams || []);
      setTotalPages(Math.ceil(response.data.pagination.total / limit) || 1);
      // if (response.data.exams.length === 0) {
      // toast.info(user ? "No exams found. Try creating a new exam or clearing the search." : "No exams available to take. Please check back later.");
      // }
    } catch (error) {
      console.error("Error fetching exams:", error);
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
          await axios.delete(`http://localhost:8080/api/v1/exams/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          fetchExams();
          Swal.fire("Deleted!", "Exam deleted successfully", "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete exam", "error");
        }
      }
    });
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1 on search change
  };
  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" color="primary" gutterBottom>
              📝 Exam List
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
            {user && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/exams/create")}
                sx={{ mr: 2 }}
                aria-label="Create Exam"
              >
                ➕ Create Exam
              </Button>
            )}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(user ? "/dashboard" : "/")}
              aria-label="Back"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <TextField
          label="Search exams..."
          value={search}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
          aria-label="Search exams"
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white" }}>#</TableCell>
                <TableCell sx={{ color: "white" }}>Title</TableCell>
                <TableCell sx={{ color: "white" }}>Date</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam, index) => (
                  <TableRow key={exam._id}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>{new Date(exam.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user ? (
                        <>
                          <Button
                            component={Link}
                            to={`/exams/view/${exam._id}`}
                            variant="outlined"
                            color="info"
                            sx={{ mr: 1 }}
                            size="small"
                            aria-label={`View ${exam.title}`}
                          >
                            👁 View
                          </Button>
                          <Button
                            component={Link}
                            to={`/exams/edit/${exam._id}`}
                            variant="outlined"
                            color="warning"
                            sx={{ mr: 1 }}
                            size="small"
                            aria-label={`Edit ${exam.title}`}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(exam._id)}
                            sx={{ mr: 1 }}
                            size="small"
                            aria-label={`Delete ${exam.title}`}
                          >
                            ❌ Delete
                          </Button>
                          <Button
                            component={Link}
                            to={`/exams/results/${exam._id}`}
                            variant="outlined"
                            color="warning"
                            size="small"
                            aria-label={`View Results for ${exam.title}`}
                          >
                            📊 View Results
                          </Button>
                        </>
                      ) : (
                        <Button
                          component={Link}
                          to={`/exams/take/${exam._id}`}
                          variant="contained"
                          color="success"
                          size="small"
                          aria-label={`Take ${exam.title}`}
                        >
                          🎯 Start Exam
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {/* {user ? "No exams found. Try creating a new exam." : "No exams available to take. Please check back later."} */}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleSearchChange}
            sx={{ mt: 2, justifyContent: "center", display: "flex" }}
            aria-label="Pagination"
          />
        )}
      </Card>
    </Container>
  );
};
export default ExamList;