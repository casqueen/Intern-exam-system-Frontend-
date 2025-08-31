// import { useState, useEffect } from "react";
// import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box } from "@mui/material";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "../store/authStore";

// const ExamDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [exam, setExam] = useState(null);

//   useEffect(() => {
//     if (!user || user?.student?.role !== "admin") {
//       toast.error("Access denied. Admins only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchExam();
//   }, [id, user, navigate]);

//   const fetchExam = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setExam(response.data);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch exam");
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" color="primary" gutterBottom>
//           📋 Exam Details
//         </Typography>
//         {exam ? (
//           <>
//             <Typography variant="h6">{exam.title}</Typography>
//             <Typography variant="body2" color="text.secondary">
//               Created: {new Date(exam.createdAt).toLocaleDateString()}
//             </Typography>
//             <Typography variant="h6" sx={{ mt: 2 }}>Questions:</Typography>
//             <List>
//               {exam.questions.map((q, index) => (
//                 <ListItem key={q._id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
//                   <ListItemText
//                     primary={`Question ${index + 1}: ${q.question}`}
//                     secondary={
//                       <>
//                         <Typography variant="body2">Options: {q.options.join(", ")}</Typography>
//                         <Typography variant="body2">Correct Answer: {q.correctAnswer}</Typography>
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//             <Box sx={{ mt: 4 }}>
//               <Button
//                 component={Link}
//                 to={`/exams/edit/${exam._id}`}
//                 variant="contained"
//                 color="primary"
//                 sx={{ mr: 2 }}
//                 aria-label="Edit Exam"
//               >
//                 ✏️ Edit Exam
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => navigate("/exams")}
//                 aria-label="Back"
//               >
//                 ⬅️ Back
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

// export default ExamDetails;


import { useState, useEffect } from "react";
import { Container, Card, List, ListItem, ListItemText, Button, Typography, Box, Divider, Chip } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * ExamDetails Component
 * @description Displays detailed information about an exam, including all question types
 */
const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchExam();
  }, [id, user, navigate]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExam(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exam");
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
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="article" aria-label="Exam Details">
          <Typography variant="h5" color="primary" gutterBottom>
            📋 Exam Details
          </Typography>
          {loading ? (
            <LoadingSpinner />
          ) : exam ? (
            <>
              <Typography variant="h6" aria-label="Exam Title">{exam.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(exam.createdAt).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Questions:</Typography>
              <List>
                {exam.questions.map((q, index) => (
                  <ListItem key={q._id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" fontWeight="bold">
                            Question {index + 1}: {q.text}
                          </Typography>
                          <Chip label={q.type} color="primary" size="small" sx={{ ml: 1 }} />
                        </>
                      }
                      secondary={
                        <>
                          {q.image && (
                            <Box>
                              <img
                                src={`http://localhost:8080${q.image}`}
                                alt={`Question ${index + 1} image`}
                                style={{ maxWidth: "200px", margin: "10px 0" }}
                              />
                            </Box>
                          )}
                          {q.options?.length > 0 && (
                            <Typography variant="body2">Options: {q.options.join(", ")}</Typography>
                          )}
                          {q.correctAnswers?.length > 0 && (
                            <Typography variant="body2">
                              Correct Answer{q.correctAnswers.length > 1 ? "s" : ""}: {q.correctAnswers.join(", ")}
                            </Typography>
                          )}
                          {q.blankAnswer && (
                            <Typography variant="body2">Correct Answer: {q.blankAnswer}</Typography>
                          )}
                          {q.keywords?.length > 0 && (
                            <Typography variant="body2">Keywords: {q.keywords.join(", ")}</Typography>
                          )}
                          {q.matchingLeft?.length > 0 && (
                            <>
                              <Typography variant="body2">Left: {q.matchingLeft.join(", ")}</Typography>
                              <Typography variant="body2">Right: {q.matchingRight.join(", ")}</Typography>
                              <Typography variant="body2">
                                Correct Matches: {q.correctMatches.map((m) => `${m.left} → ${m.right}`).join(", ")}
                              </Typography>
                            </>
                          )}
                          <Typography variant="body2">Points: {q.points}</Typography>
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
                  aria-label="Back to Exams"
                >
                  ⬅️ Back
                </Button>
              </Box>
            </>
          ) : (
            <Typography aria-label="Error message">Failed to load exam</Typography>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default ExamDetails;