import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
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
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/login");
      return;
    }
    fetchResults();
  }, [examId, user, navigate]);
  const fetchResults = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/admin/exam-results/${examId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResults(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam results");
    }
  };
  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" color="primary" gutterBottom>
              📊 Exam Results
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/exams")}
              aria-label="Back to Exams"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white" }}>#</TableCell>
                <TableCell sx={{ color: "white" }}>Student Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white" }}>Exam Title</TableCell>
                <TableCell sx={{ color: "white" }}>Score</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Exam Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <TableRow key={result.studentId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.email}</TableCell>
                    <TableCell>{result.examTitle}</TableCell>
                    <TableCell>{result.score} / {result.answersLength} ({Math.round((result.score / result.answersLength) * 100)}%)</TableCell>
                    <TableCell>{result.passed}</TableCell>
                    <TableCell>{result.examDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No results found for this exam.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};
export default ExamResults;