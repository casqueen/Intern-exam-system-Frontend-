import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const TakeExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/v1/exams");
      console.log("Fetched exams:", response.data); // Debug: Log fetched exams
      setExams(response.data.exams);
    } catch (error) {
      // toast.error(error.response?.data?.error || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = (examId) => {
    navigate(`/testing-room/${examId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            📚 Select an Exam
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
            Choose from the list of available exams to start your test. You can also create a random exam.
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress aria-label="Loading exams" />
            </Box>
          ) : exams.length === 0 ? (
            <Typography variant="h6" align="center" color="text.secondary">
              No exams available. Create a random exam to get started.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <Table aria-label="Available exams table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Exam Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Questions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow
                      key={exam._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <TableCell>{exam.title}</TableCell>
                      {/* <TableCell>{exam.questionIds.length}</TableCell> */}
                      <TableCell>{new Date(exam.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSelectExam(exam._id)}
                          sx={{ borderRadius: 2 }}
                          aria-label={`Start ${exam.title} exam`}
                        >
                          Start Exam
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/testing-room")}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Create random exam"
            >
              🎲 Create Random Exam
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Back to dashboard"
            >
              ⬅️ Back to Dashboard
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Container>
  );
};

export default TakeExams;