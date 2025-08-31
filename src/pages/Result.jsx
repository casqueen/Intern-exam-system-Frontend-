// import { useState, useEffect } from "react";
// import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "../store/authStore";

// const Result = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     if (!user || user?.student?.role !== "student") {
//       toast.error("Access denied. Students only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchResult();
//   }, [id, user, navigate]);

//   const fetchResult = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/student/results/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setResult(response.data.examResult);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch result");
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" color="primary" gutterBottom>
//           📊 Exam Result
//         </Typography>
//         {result ? (
//           <>
//             <Typography variant="h6">{result.exam.title}</Typography>
//             <Typography variant="body1">{result.message}</Typography>
//             <Typography variant="body1"><strong>Score:</strong> {result.exam.score}</Typography>
//             <Typography variant="body1"><strong>Status:</strong> {result.exam.status}</Typography>
//             <Typography variant="body1"><strong>Exam Date:</strong> {result.examDate}</Typography>
//             <Typography variant="h6" sx={{ mt: 2 }}>Answers:</Typography>
//             <List>
//               {result.answers.map((answer, index) => (
//                 <ListItem key={answer.questionId} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
//                   <ListItemText
//                     primary={`Question ${index + 1}: ${answer.question}`}
//                     secondary={
//                       <>
//                         <Typography variant="body2">Your Answer: {answer.selectedOption} {answer.isCorrect ? "✅" : "❌"}</Typography>
//                         <Typography variant="body2">Correct Answer: {answer.correctAnswer}</Typography>
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//             <Box sx={{ mt: 4 }}>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => navigate("/exam-list")}
//                 aria-label="Back to Exams"
//               >
//                 ⬅️ Back to Exams
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Typography>Loading...</Typography>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default Result;



import { useState, useEffect } from "react";
import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box, Chip } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * Result Component
 * @description Displays exam results with detailed feedback for all question types
 */
const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.student?.role !== "student") {
      toast.error("Access denied. Students only.");
      navigate("/dashboard");
      return;
    }
    fetchResult();
  }, [id, user, navigate]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/student/results/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResult(response.data.examResult);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="region" aria-label="Exam Result">
          <Typography variant="h5" color="primary" gutterBottom>
            📊 Exam Result
          </Typography>
          {loading ? (
            <LoadingSpinner />
          ) : result ? (
            <>
              <Typography variant="h6" aria-label="Exam Title">{result.exam.title}</Typography>
              <Typography variant="body1">{result.message}</Typography>
              <Typography variant="body1">
                <strong>Score:</strong> {result.exam.totalScore} / {result.exam.maxScore}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {result.exam.status}
              </Typography>
              <Typography variant="body1">
                <strong>Exam Date:</strong> {result.examDate}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Answers:</Typography>
              <List>
                {result.answers.map((answer, index) => {
                  const question = result.exam.questions?.find((q) => q._id === answer.questionId);
                  return (
                    <ListItem key={answer.questionId} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                      <ListItemText
                        primary={
                          <>
                            <Typography component="span" fontWeight="bold">
                              Question {index + 1}: {answer.question}
                            </Typography>
                            <Chip
                              label={answer.isCorrect ? "Correct ✅" : "Incorrect ❌"}
                              color={answer.isCorrect ? "success" : "error"}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </>
                        }
                        secondary={
                          <>
                            {question?.image && (
                              <Box>
                                <img
                                  src={`http://localhost:8080${question.image}`}
                                  alt={`Question ${index + 1} image`}
                                  style={{ maxWidth: "200px", margin: "10px 0" }}
                                  aria-label={`Image for question ${index + 1}`}
                                />
                              </Box>
                            )}
                            <Typography variant="body2">
                              <strong>Your Answer:</strong>{" "}
                              {Array.isArray(answer.selected)
                                ? answer.selected.join(", ")
                                : typeof answer.selected === "object"
                                ? answer.selected.map((m) => `${m.left} → ${m.right}`).join(", ")
                                : answer.selected}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Correct Answer:</strong>{" "}
                              {question?.correctAnswers?.length > 0
                                ? question.correctAnswers.join(", ")
                                : question?.blankAnswer || question?.correctMatches?.map((m) => `${m.left} → ${m.right}`).join(", ")}
                            </Typography>
                            <Typography variant="body2">Points: {answer.score}</Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/exam-list")}
                  aria-label="Back to Exams"
                >
                  ⬅️ Back
                </Button>
              </Box>
            </>
          ) : (
            <Typography aria-label="Error message">Failed to load result</Typography>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default Result;