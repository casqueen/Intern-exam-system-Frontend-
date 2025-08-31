import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
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
      toast.error(error.response?.data?.error || "Failed to fetch results");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          📊 Exam Results
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>#</TableCell>
                <TableCell sx={{ color: 'white' }}>Student Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Exam Title</TableCell>
                <TableCell sx={{ color: 'white' }}>Score</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Exam Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={result.studentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.email}</TableCell>
                  <TableCell>{result.examTitle}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>{result.passed}</TableCell>
                  <TableCell>{result.examDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/exams")}
            aria-label="Back"
          >
            ⬅️ Back
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ExamResults;