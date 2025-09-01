import { useState, useEffect } from "react";
import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchExam();
  }, [id, user, navigate]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExam(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          📋 Exam Details
        </Typography>
        {exam ? (
          <>
            <Typography variant="h6">{exam.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(exam.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Questions:</Typography>
            <List>
              {exam.questions.map((q, index) => (
                <ListItem key={q._id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={`Question ${index + 1}: ${q.question}`}
                    secondary={
                      <>
                        <Typography variant="body2">Type: {q.type}</Typography>
                        <Typography variant="body2">Options: {q.options.join(", ")}</Typography>
                        <Typography variant="body2">Correct Answers: {q.correctAnswers.join(", ")}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                to={`/exams/edit/${exam._id}`}
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                aria-label="Edit Exam"
              >
                ✏️ Edit Exam
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/exams")}
                aria-label="Back"
              >
                ⬅️ Back
              </Button>
            </Box>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Card>
    </Container>
  );
};
export default ExamDetails;