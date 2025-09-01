import { useState, useEffect } from "react";
import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  useEffect(() => {
    fetchResult();
  }, [id]);
  const fetchResult = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/student/results/${id}`);
      setResult(response.data.examResult);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch result");
    }
  };
  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          📊 Exam Result
        </Typography>
        {result ? (
          <>
            <Typography variant="h6">{result.exam.title}</Typography>
            <Typography variant="body1">{result.message}</Typography>
            <Typography variant="body1"><strong>Score:</strong> {result.exam.score}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {result.exam.status}</Typography>
            <Typography variant="body1"><strong>Exam Date:</strong> {result.examDate}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Answers:</Typography>
            <List>
              {result.answers.map((answer, index) => (
                <ListItem key={answer.questionId} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={`Question ${index + 1}: ${answer.question}`}
                    secondary={
                      <>
                        <Typography variant="body2">Your Answer: {answer.selectedOptions.join(", ")} {answer.isCorrect ? "✅" : "❌"}</Typography>
                        <Typography variant="body2">Correct Answer: {answer.correctAnswer.join(", ")}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/")}
                aria-label="Back to Home"
              >
                ⬅️ Back to Home
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
export default Result;