import { useState, useEffect } from "react";
import { Container, Card, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Pagination } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchQuestions();
  }, [page, search, user]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/questions?search=${search}&page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(response.data.questions);
      setTotalPages(Math.ceil(response.data.pagination.total / limit));
    } catch (error) {
    //   toast.error("Failed to fetch questions");
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
          await axios.delete(`http://localhost:8080/api/v1/questions/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          fetchQuestions();
          Swal.fire("Deleted!", "Question deleted successfully", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete question", "error");
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
              ❓ Question List
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/questions/create")}
              sx={{ mr: 2 }}
              aria-label="Create Question"
            >
              ➕ Create Question
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/dashboard")}
              aria-label="Back"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <TextField
          label="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          margin="normal"
          aria-label="Search questions"
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>#</TableCell>
                <TableCell sx={{ color: 'white' }}>Question</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={question._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>{question.type}</TableCell>
                  <TableCell>{new Date(question.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/questions/view/${question._id}`}
                      variant="outlined"
                      color="info"
                      sx={{ mr: 1 }}
                      size="small"
                    >
                      👁 View
                    </Button>
                    <Button
                      component={Link}
                      to={`/questions/edit/${question._id}`}
                      variant="outlined"
                      color="warning"
                      sx={{ mr: 1 }}
                      size="small"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(question._id)}
                      size="small"
                    >
                      ❌ Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ mt: 2, justifyContent: "center", display: "flex" }} />
      </Card>
    </Container>
  );
};
export default QuestionList;