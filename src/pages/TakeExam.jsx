import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, List, ListItem, FormControlLabel, Radio, RadioGroup, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!user || user?.student?.role !== "student") {
      toast.error("Access denied. Students only.");
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
      setAnswers(response.data.questions.map((q) => ({
        questionId: q._id,
        selectedOption: "",
      })));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId ? { ...answer, selectedOption } : answer
      )
    );
  };

  const handleSubmit = async () => {
    if (answers.some((answer) => !answer.selectedOption)) {
      toast.error("Please answer all questions");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/student/exams/${id}/submit`,
        { studentId: user?.student?._id, answers },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(response.data.message);
      navigate(`/result/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit exam");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          🎯 Take Exam: {exam?.title}
        </Typography>
        {exam ? (
          <>
            <List>
              {exam.questions.map((question, index) => (
                <ListItem key={question._id}>
                  <Box>
                    <Typography variant="h6">Question {index + 1}: {question.question}</Typography>
                    <RadioGroup
                      name={`question-${question._id}`}
                      value={answers.find((a) => a.questionId === question._id)?.selectedOption || ""}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    >
                      {question.options.map((option, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                          aria-label={`Option ${optIndex + 1}`}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ mr: 2 }}
                aria-label="Submit Exam"
              >
                ✅ Submit Exam
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/exams")}
                aria-label="Cancel"
              >
                ⬅️ Cancel
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

export default TakeExam;