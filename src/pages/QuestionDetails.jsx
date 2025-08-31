import { useState, useEffect } from "react";
import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchQuestion();
  }, [id, user, navigate]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/questions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestion(response.data);
    } catch (error) {
      toast.error("Failed to fetch question");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          ❓ Question Details
        </Typography>
        {question ? (
          <>
            <Typography variant="h6">{question.question}</Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {question.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(question.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Options:</Typography>
            <List>
              {question.options.map((opt, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}: ${opt}`} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 2 }}>Correct Answers:</Typography>
            <List>
              {question.correctAnswers.map((ans, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ans} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                to={`/questions/edit/${question._id}`}
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                ✏️ Edit Question
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/questions")}
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
export default QuestionDetails;