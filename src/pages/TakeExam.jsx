import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && step === 3) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === 3 && exam) {
      handleSubmit();
    }
  }, [timeLeft, step, exam]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`);
      console.log("Fetched exam:", response.data); // Debug: Log exam data
      setExam(response.data);
      setAnswers(response.data.questions.map((q) => ({ questionId: q._id, selectedOptions: [] })));
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error(error.response?.data?.error || "Failed to fetch exam. Please check if the exam exists.");
      navigate("/exams");
    }
  };

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers((prev) =>
      prev.map((a) => {
        if (a.questionId !== questionId) return a;
        if (type === "single") return { ...a, selectedOptions: [value] };
        const newSelected = a.selectedOptions.includes(value)
          ? a.selectedOptions.filter((v) => v !== value)
          : [...a.selectedOptions, value];
        return { ...a, selectedOptions: newSelected };
      })
    );
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a.selectedOptions.length === 0)) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/student/exams/${id}/submit`, {
        name: personalInfo.name,
        email: personalInfo.email,
        answers,
      });
      toast.success(response.data.message);
      navigate(`/result/${response.data.resultId}`);
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error(error.response?.data?.error || "Failed to submit exam. Please try again.");
    }
  };

  const personalValidation = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  if (step === 1) {
    return (
      <Container sx={{ mt: 5 }}>
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Enter Personal Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide your name and email to start the exam.
          </Typography>
          <Formik
            initialValues={{ name: "", email: "" }}
            validationSchema={personalValidation}
            onSubmit={(values) => {
              setPersonalInfo(values);
              setStep(2);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="name"
                  as={TextField}
                  label="Name"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="name" />}
                  error={Boolean(<ErrorMessage name="name" />)}
                  aria-label="Student Name"
                />
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  fullWidth
                  margin="normal"
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(<ErrorMessage name="email" />)}
                  aria-label="Student Email"
                />
                <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ mr: 2 }}>
                    Next
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/exams")}>
                    Cancel
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Card>
      </Container>
    );
  }

  if (step === 2) {
    return (
      <Container sx={{ mt: 5 }}>
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Select Exam Duration
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Choose how much time you need for the exam.
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Duration (minutes)</InputLabel>
            <Select value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Exam Duration">
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={60}>60</MenuItem>
              <MenuItem value={90}>90</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setTimeLeft(duration * 60);
                setStep(3);
              }}
            >
              Start Exam
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setStep(1)} sx={{ ml: 2 }}>
              Back
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          🎯 Take Exam: {exam?.title || "Loading..."}
        </Typography>
        <Typography variant="h6" aria-live="polite">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </Typography>
        {exam ? (
          <>
            <List>
              {exam.questions.map((question, index) => (
                <ListItem key={question._id}>
                  <Box>
                    <Typography variant="h6">
                      Question {index + 1}: {question.question}
                    </Typography>
                    {question.type === "single" ? (
                      <RadioGroup
                        value={answers.find((a) => a.questionId === question._id)?.selectedOptions[0] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value, "single")}
                        aria-label={`Question ${index + 1} options`}
                      >
                        {question.options.map((option, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <Box>
                        {question.options.map((option, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            control={
                              <Checkbox
                                checked={answers
                                  .find((a) => a.questionId === question._id)
                                  ?.selectedOptions.includes(option)}
                                onChange={() => handleAnswerChange(question._id, option, "multiple")}
                              />
                            }
                            label={option}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mr: 2 }}>
                ✅ Submit Exam
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate("/exams")}>
                ⬅️ Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Typography>Loading exam...</Typography>
        )}
      </Card>
    </Container>
  );
};

export default TakeExam;