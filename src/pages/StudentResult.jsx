import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentResult = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const { studentemail } = useParams(); // Extract email from URL params

  const handleSubmit = async (values) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/student/exams?email=${values.email}`);
      setExams(response.data.exams);
    } catch (error) {
      // toast.error("Failed to fetch exams");
    }
  };

  // Automatically fetch results using the email from params
  useEffect(() => {
    if (studentemail) {
      handleSubmit({ email: studentemail });
    }
  }, [studentemail]);

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" color="primary" gutterBottom>
              📝 Student Exam Results
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/students")}
              aria-label="Back"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <TableContainer sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>#</TableCell>
                <TableCell sx={{ color: 'white' }}>Title</TableCell>
                <TableCell sx={{ color: 'white' }}>Score</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Exam Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam, index) => (
                  <TableRow key={exam.examId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{exam.title}</TableCell>
                    <TableCell>{exam.score}</TableCell>
                    <TableCell>{exam.passed ? "✅ Passed" : "❌ Failed"}</TableCell>
                    <TableCell>{exam.examDate}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/result/${exam.resultId}`}
                        variant="outlined"
                        color="info"
                        size="small"
                        aria-label="View Result"
                      >
                        📊 View Result
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No exam results found for this student.
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

export default StudentResult;