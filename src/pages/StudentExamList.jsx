// import { useState, useEffect } from "react";
// import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "../store/authStore";

// const StudentExamList = () => {
//   const [exams, setExams] = useState([]);
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     if (!user || user?.student?.role !== "student") {
//       toast.error("Access denied. Students only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchExams();
//   }, [user, navigate]);

//   const fetchExams = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/student/${user?.student?._id}/exams`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setExams(response.data.exams);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch exams");
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={8}>
//             <Typography variant="h5" color="primary" gutterBottom>
//               📝 My Exams
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => navigate("/dashboard")}
//               aria-label="Back"
//             >
//               ⬅️ Back
//             </Button>
//           </Grid>
//         </Grid>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                 <TableCell sx={{ color: 'white' }}>#</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Title</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Score</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Status</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Exam Date</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {exams.map((exam, index) => (
//                 <TableRow key={exam.examId}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{exam.title}</TableCell>
//                   <TableCell>{exam.score}</TableCell>
//                   <TableCell>{exam.passed ? "✅ Passed" : "❌ Failed"}</TableCell>
//                   <TableCell>{exam.examDate}</TableCell>
//                   <TableCell>
//                     <Button
//                       component={Link}
//                       to={`/result/${exam.examId}`}
//                       variant="outlined"
//                       color="info"
//                       size="small"
//                       aria-label="View Result"
//                     >
//                       📊 View Result
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </Container>
//   );
// };

// export default StudentExamList;


import { useState } from "react";
import { Container, Card, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentExamList = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/student/exams?email=${values.email}`);
      setExams(response.data.exams);
    } catch (error) {
      toast.error("Failed to fetch exams");
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" color="primary" gutterBottom>
              📝 My Exams
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              aria-label="Back"
            >
              ⬅️ Back
            </Button>
          </Grid>
        </Grid>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="email"
                as={TextField}
                label="Enter your email"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="email" />}
                error={Boolean(<ErrorMessage name="email" />)}
              />
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                Fetch My Exams
              </Button>
            </Form>
          )}
        </Formik>
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
              {exams.map((exam, index) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};
export default StudentExamList;