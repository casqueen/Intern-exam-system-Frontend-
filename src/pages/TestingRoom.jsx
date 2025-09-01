// import { useState, useEffect } from "react";
// import {
//   Container,
//   Card,
//   Button,
//   Typography,
//   List,
//   ListItem,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Checkbox,
//   Box,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   LinearProgress,
// } from "@mui/material";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";

// const TestingRoom = () => {
//   const { id: examId } = useParams(); // Get examId from URL
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [duration, setDuration] = useState(30);
//   const [numQuestions, setNumQuestions] = useState(10);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [personalInfo, setPersonalInfo] = useState({ name: "", email: "" });
//   const [maxQuestions, setMaxQuestions] = useState(0);

//   useEffect(() => {
//     if (examId) {
//       // Fetch specific exam if examId is provided
//       fetchExam();
//     } else {
//       // Fetch max questions for random exam
//       fetchQuestionCount();
//     }
//   }, [examId]);

//   useEffect(() => {
//     if (timeLeft > 0 && step === 3) {
//       const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearInterval(timer);
//     } else if (timeLeft === 0 && step === 3 && exam) {
//       handleSubmit();
//     }
//   }, [timeLeft, step, exam]);

//   const fetchQuestionCount = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/v1/questions/count");
//       setMaxQuestions(response.data.count);
//     } catch (error) {
//       toast.error("Failed to fetch question count");
//     }
//   };

//   const fetchExam = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/exams/${examId}`);
//       setExam(response.data);
//       setAnswers(response.data.questions.map((q) => ({ questionId: q._id, selectedOptions: [] })));
//       setDuration(30); // Default duration for specific exams
//       setTimeLeft(30 * 60); // Initialize timer
//       setStep(3); // Skip to question-answering step for specific exams
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch exam");
//       navigate("/exams");
//     }
//   };

//   const generateRandomExam = async () => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/v1/exams/random", { numQuestions });
//       setExam(response.data);
//       setAnswers(response.data.questions.map((q) => ({ questionId: q._id, selectedOptions: [] })));
//     } catch (error) {
//       toast.error("Failed to generate exam");
//     }
//   };

//   const handleAnswerChange = (questionId, value, type) => {
//     setAnswers((prev) =>
//       prev.map((a) => {
//         if (a.questionId !== questionId) return a;
//         if (type === "single") return { ...a, selectedOptions: [value] };
//         const newSelected = a.selectedOptions.includes(value)
//           ? a.selectedOptions.filter((v) => v !== value)
//           : [...a.selectedOptions, value];
//         return { ...a, selectedOptions: newSelected };
//       })
//     );
//   };

//   const handleSubmit = async () => {
//     if (answers.some((a) => a.selectedOptions.length === 0)) {
//       toast.error("Please answer all questions before submitting.");
//       return;
//     }
//     try {
//       const response = await axios.post(`http://localhost:8080/api/v1/student/exams/${exam._id}/submit`, {
//         name: personalInfo.name,
//         email: personalInfo.email,
//         answers,
//       });
//       toast.success(response.data.message);
//       navigate(`/result/${response.data.resultId}`);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to submit exam. Please try again.");
//     }
//   };

//   const personalValidation = Yup.object().shape({
//     name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//   });

//   const selectionValidation = Yup.object().shape({
//     numQuestions: Yup.number()
//       .required("Number of questions is required")
//       .min(1, "At least 1 question")
//       .max(maxQuestions, `Maximum ${maxQuestions} questions available`),
//   });

//   if (step === 1 && !examId) {
//     return (
//       <Container sx={{ mt: 5 }}>
//         <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//             <Typography variant="h5" color="primary" gutterBottom>
//               Enter Personal Information
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 2 }}>
//               Please provide your name and email to start the exam.
//             </Typography>
//             <Formik
//               initialValues={{ name: "", email: "" }}
//               validationSchema={personalValidation}
//               onSubmit={(values) => {
//                 setPersonalInfo(values);
//                 setStep(2);
//               }}
//             >
//               {({ isSubmitting }) => (
//                 <Form>
//                   <Field
//                     name="name"
//                     as={TextField}
//                     label="Name"
//                     fullWidth
//                     margin="normal"
//                     helperText={<ErrorMessage name="name" />}
//                     error={Boolean(<ErrorMessage name="name" />)}
//                     aria-label="Student Name"
//                   />
//                   <Field
//                     name="email"
//                     as={TextField}
//                     label="Email"
//                     fullWidth
//                     margin="normal"
//                     helperText={<ErrorMessage name="email" />}
//                     error={Boolean(<ErrorMessage name="email" />)}
//                     aria-label="Student Email"
//                   />
//                   <Box sx={{ mt: 2 }}>
//                     <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ mr: 2 }}>
//                       Next
//                     </Button>
//                     <Button variant="outlined" color="secondary" onClick={() => navigate("/exams")}>
//                       Cancel
//                     </Button>
//                   </Box>
//                 </Form>
//               )}
//             </Formik>
//           </Card>
//         </motion.div>
//       </Container>
//     );
//   }

//   if (step === 2 && !examId) {
//     return (
//       <Container sx={{ mt: 5 }}>
//         <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//             <Typography variant="h5" color="primary" gutterBottom>
//               Select Exam Options
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 2 }}>
//               Choose duration and number of questions (max {maxQuestions}).
//             </Typography>
//             <Formik
//               initialValues={{ duration: 30, numQuestions: 10 }}
//               validationSchema={selectionValidation}
//               onSubmit={async (values) => {
//                 setDuration(values.duration);
//                 setNumQuestions(values.numQuestions);
//                 await generateRandomExam();
//                 setTimeLeft(values.duration * 60);
//                 setStep(3);
//               }}
//             >
//               {({ isSubmitting, setFieldValue }) => (
//                 <Form>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel>Duration (minutes)</InputLabel>
//                     <Field
//                       as={Select}
//                       name="duration"
//                       label="Duration (minutes)"
//                       onChange={(e) => setFieldValue("duration", e.target.value)}
//                     >
//                       <MenuItem value={30}>30</MenuItem>
//                       <MenuItem value={60}>60</MenuItem>
//                       <MenuItem value={90}>90</MenuItem>
//                     </Field>
//                   </FormControl>
//                   <Field
//                     name="numQuestions"
//                     as={TextField}
//                     type="number"
//                     label="Number of Questions"
//                     fullWidth
//                     margin="normal"
//                     inputProps={{ min: 1, max: maxQuestions }}
//                     helperText={<ErrorMessage name="numQuestions" />}
//                     error={Boolean(<ErrorMessage name="numQuestions" />)}
//                   />
//                   <Box sx={{ mt: 2 }}>
//                     <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ mr: 2 }}>
//                       Start Exam
//                     </Button>
//                     <Button variant="outlined" color="secondary" onClick={() => setStep(1)} sx={{ ml: 2 }}>
//                       Back
//                     </Button>
//                   </Box>
//                 </Form>
//               )}
//             </Formik>
//           </Card>
//         </motion.div>
//       </Container>
//     );
//   }

//   return (
//     <Container sx={{ mt: 5 }}>
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//         <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//           <Typography variant="h5" color="primary" gutterBottom>
//             🎯 Testing Room: {exam?.title || "Loading..."}
//           </Typography>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="h6" aria-live="polite">
//               Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}
//               {timeLeft % 60}
//             </Typography>
//             <LinearProgress variant="determinate" value={(timeLeft / (duration * 60)) * 100} color="secondary" />
//           </Box>
//           {exam ? (
//             <>
//               <List>
//                 {exam.questions.map((question, index) => (
//                   <motion.div key={question._id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
//                     <ListItem sx={{ flexDirection: "column", alignItems: "flex-start", mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
//                       <Typography variant="h6">
//                         Question {index + 1}: {question.question}
//                       </Typography>
//                       {question.type === "single" ? (
//                         <RadioGroup
//                           value={answers.find((a) => a.questionId === question._id)?.selectedOptions[0] || ""}
//                           onChange={(e) => handleAnswerChange(question._id, e.target.value, "single")}
//                           aria-label={`Question ${index + 1} options`}
//                         >
//                           {question.options.map((option, optIndex) => (
//                             <FormControlLabel key={optIndex} value={option} control={<Radio />} label={option} />
//                           ))}
//                         </RadioGroup>
//                       ) : (
//                         <Box>
//                           {question.options.map((option, optIndex) => (
//                             <FormControlLabel
//                               key={optIndex}
//                               control={
//                                 <Checkbox
//                                   checked={answers
//                                     .find((a) => a.questionId === question._id)
//                                     ?.selectedOptions.includes(option)}
//                                   onChange={() => handleAnswerChange(question._id, option, "multiple")}
//                                 />
//                               }
//                               label={option}
//                             />
//                           ))}
//                         </Box>
//                       )}
//                     </ListItem>
//                   </motion.div>
//                 ))}
//               </List>
//               <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mr: 2 }}>
//                   ✅ Submit Exam
//                 </Button>
//                 <Button variant="outlined" color="secondary" onClick={() => navigate("/exams")}>
//                   ⬅️ Cancel
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <Typography>Loading exam...</Typography>
//           )}
//         </Card>
//       </motion.div>
//     </Container>
//   );
// };

// export default TestingRoom;



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
  LinearProgress,
  Paper,
  Divider,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const TestingRoom = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [duration, setDuration] = useState(30);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "" });
  const [maxQuestions, setMaxQuestions] = useState(0);

  useEffect(() => {
    if (!examId) {
      fetchQuestionCount();
    } else {
      fetchExam();
    }
  }, [examId]);

  useEffect(() => {
    if (timeLeft > 0 && step === 3) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, step]);

  const fetchQuestionCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/questions/count");
      setMaxQuestions(response.data.count);
    } catch (error) {
      toast.error("Failed to fetch question count");
    }
  };

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${examId}`);
      setExam(response.data);
      setAnswers(response.data.questions.map((q) => ({ questionId: q._id, selectedOptions: [] })));
      setTimeLeft(response.data.duration || 30 * 60);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
      navigate("/exams");
    }
  };

  const generateRandomExam = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/exams/random", { numQuestions, duration });
      setExam(response.data);
      setAnswers(response.data.questions.map((q) => ({ questionId: q._id, selectedOptions: [] })));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate exam");
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
      const response = await axios.post(`http://localhost:8080/api/v1/student/exams/${exam._id}/submit`, {
        name: personalInfo.name,
        email: personalInfo.email,
        answers,
      });
      toast.success(response.data.message);
      navigate(`/result/${response.data.resultId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit exam. Please try again.");
    }
  };

  const personalValidation = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const selectionValidation = Yup.object().shape({
    numQuestions: Yup.number()
      .required("Number of questions is required")
      .min(1, "At least 1 question")
      .max(maxQuestions, `Maximum ${maxQuestions} questions available`),
    duration: Yup.number()
      .required("Duration is required")
      .min(10, "Minimum duration is 10 minutes")
      .max(180, "Maximum duration is 180 minutes"),
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (step === 1 && !examId) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <Typography variant="h4" color="primary" align="center" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome to the Testing Room
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 3, color: "text.secondary" }}>
              Please provide your details to begin the exam.
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
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={<ErrorMessage name="name" />}
                    error={Boolean(<ErrorMessage name="name" />)}
                    aria-label="Student Name"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    name="email"
                    as={TextField}
                    label="Email Address"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                    error={Boolean(<ErrorMessage name="email" />)}
                    aria-label="Student Email"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate("/")}
                      sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Card>
        </motion.div>
      </Container>
    );
  }

  if (step === 2 && !examId) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <Typography variant="h4" color="primary" align="center" gutterBottom sx={{ fontWeight: 600 }}>
              Configure Your Exam
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 3, color: "text.secondary" }}>
              Select the number of questions and duration for your exam.
            </Typography>
            <Formik
              initialValues={{ duration: 30, numQuestions: 10 }}
              validationSchema={selectionValidation}
              onSubmit={async (values) => {
                setDuration(values.duration);
                setNumQuestions(values.numQuestions);
                await generateRandomExam();
                setTimeLeft(values.duration * 60);
                setStep(3);
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                    <InputLabel>Duration (minutes)</InputLabel>
                    <Field
                      as={Select}
                      name="duration"
                      label="Duration (minutes)"
                      onChange={(e) => setFieldValue("duration", e.target.value)}
                    >
                      <MenuItem value={10}>10 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>60 minutes</MenuItem>
                      <MenuItem value={90}>90 minutes</MenuItem>
                      <MenuItem value={120}>120 minutes</MenuItem>
                      <MenuItem value={180}>180 minutes</MenuItem>
                    </Field>
                  </FormControl>
                  <Field
                    name="numQuestions"
                    as={TextField}
                    type="number"
                    label={`Number of Questions (max ${maxQuestions})`}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    inputProps={{ min: 1, max: maxQuestions }}
                    helperText={<ErrorMessage name="numQuestions" />}
                    error={Boolean(<ErrorMessage name="numQuestions" />)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                      Start Exam
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setStep(1)}
                      sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                      Back
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", backgroundColor: "#fafafa" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              🎯 Testing Room: {exam?.title || "Loading..."}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" color="text.secondary" aria-live="polite">
                Time Left: {formatTime(timeLeft)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(timeLeft / (duration * 60)) * 100}
                color="secondary"
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {exam ? (
            <>
              <List>
                {exam.questions.map((question, index) => (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        mb: 3,
                        p: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          Question {index + 1}: {question.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {question.score} point{question.score !== 1 ? "s" : ""} | {question.allowedTime} seconds
                        </Typography>
                      </Box>
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
                              control={<Radio color="primary" />}
                              label={option}
                              sx={{
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                "&:hover": { backgroundColor: "#f5f5f5" },
                              }}
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
                                  color="primary"
                                  checked={answers
                                    .find((a) => a.questionId === question._id)
                                    ?.selectedOptions.includes(option)}
                                  onChange={() => handleAnswerChange(question._id, option, "multiple")}
                                />
                              }
                              label={option}
                              sx={{
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                "&:hover": { backgroundColor: "#f5f5f5" },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </ListItem>
                  </motion.div>
                ))}
              </List>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  ✅ Submit Exam
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/")}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  ⬅️ Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Loading exam...</Typography>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default TestingRoom;