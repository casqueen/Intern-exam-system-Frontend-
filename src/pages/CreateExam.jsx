// import { Container, Card, Button, TextField, Typography, Grid, IconButton, Box } from "@mui/material";
// import { Formik, Form, Field, FieldArray } from "formik";
// import * as Yup from "yup";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";
// import useAuthStore from "../store/authStore";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";

// const CreateExam = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [initialValues, setInitialValues] = useState({
//     title: "",
//     questions: [{ question: "", options: ["", ""], correctAnswer: "" }],
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const { user } = useAuthStore();

//   useEffect(() => {
//     if (!user || user?.student?.role !== "admin") {
//       toast.error("Access denied. Admins only.");
//       navigate("/dashboard");
//       return;
//     }
//     if (id) {
//       setIsEditMode(true);
//       const fetchExam = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:8080/api/v1/exams/${id}`,
//             { headers: { Authorization: `Bearer ${user.token}` } }
//           );
//           setInitialValues(response.data);
//         } catch (error) {
//           toast.error(error.response?.data?.error || "Failed to fetch exam");
//         }
//       };
//       fetchExam();
//     }
//   }, [id, user, navigate]);

//   const validationSchema = Yup.object().shape({
//     title: Yup.string().required("Exam title is required"),
//     questions: Yup.array()
//       .of(
//         Yup.object().shape({
//           question: Yup.string().required("Question is required"),
//           options: Yup.array()
//             .of(Yup.string().required("Option is required"))
//             .min(2, "At least two options required"),
//           correctAnswer: Yup.string()
//             .required("Correct answer is required")
//             .test(
//               "valid-correct-answer",
//               "Correct answer must be one of the provided options.",
//               function (value) {
//                 const { options } = this.parent;
//                 return options.includes(value);
//               }
//             ),
//         })
//       )
//       .min(1, "At least one question is required"),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const url = isEditMode
//         ? `http://localhost:8080/api/v1/exams/${id}`
//         : `http://localhost:8080/api/v1/exams`;
//       const method = isEditMode ? "put" : "post";
//       const response = await axios[method](url, values, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       toast.success(response.data.message);
//       navigate("/exams");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.error ||
//           `Failed to ${isEditMode ? "update" : "create"} exam`
//       );
//     }
//     setSubmitting(false);
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" color="primary" align="center" gutterBottom>
//           {isEditMode ? "✏️ Edit Exam" : "➕ Create New Exam"}
//         </Typography>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
//             <Form>
//               {/* Exam Title */}
//               <TextField
//                 label="Exam Title"
//                 name="title"
//                 fullWidth
//                 margin="normal"
//                 value={values.title}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.title && Boolean(errors.title)}
//                 helperText={touched.title && errors.title}
//               />

//               {/* Questions */}
//               <FieldArray name="questions">
//                 {({ push, remove }) => (
//                   <>
//                     {values.questions.map((q, qIndex) => (
//                       <Card
//                         key={qIndex}
//                         sx={{ mb: 4, p: 3, boxShadow: 1, borderRadius: 2 }}
//                       >
//                         {/* Question */}
//                         <TextField
//                           label={`Question ${qIndex + 1}`}
//                           name={`questions.${qIndex}.question`}
//                           fullWidth
//                           margin="normal"
//                           value={q.question}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           error={
//                             touched.questions?.[qIndex]?.question &&
//                             Boolean(errors.questions?.[qIndex]?.question)
//                           }
//                           helperText={
//                             touched.questions?.[qIndex]?.question &&
//                             errors.questions?.[qIndex]?.question
//                           }
//                         />

//                         {/* Options */}
//                         <FieldArray name={`questions.${qIndex}.options`}>
//                           {({ push: pushOption, remove: removeOption }) => (
//                             <>
//                               {q.options.map((opt, optIndex) => (
//                                 <Grid
//                                   container
//                                   spacing={2}
//                                   key={optIndex}
//                                   alignItems="center"
//                                   sx={{ mt: 1 }}
//                                 >
//                                   <Grid item xs={10}>
//                                     <TextField
//                                       label={`Option ${optIndex + 1}`}
//                                       name={`questions.${qIndex}.options.${optIndex}`}
//                                       fullWidth
//                                       margin="normal"
//                                       value={opt}
//                                       onChange={handleChange}
//                                       onBlur={handleBlur}
//                                       error={
//                                         touched.questions?.[qIndex]?.options?.[optIndex] &&
//                                         Boolean(errors.questions?.[qIndex]?.options?.[optIndex])
//                                       }
//                                       helperText={
//                                         touched.questions?.[qIndex]?.options?.[optIndex] &&
//                                         errors.questions?.[qIndex]?.options?.[optIndex]
//                                       }
//                                     />
//                                   </Grid>
//                                   {q.options.length > 2 && (
//                                     <Grid item xs={2}>
//                                       <IconButton
//                                         color="error"
//                                         onClick={() => removeOption(optIndex)}
//                                         aria-label="Remove Option"
//                                       >
//                                         <DeleteIcon />
//                                       </IconButton>
//                                     </Grid>
//                                   )}
//                                 </Grid>
//                               ))}
//                               <Grid item xs={12} sx={{ mt: 2 }}>
//                                 <Button
//                                   variant="outlined"
//                                   color="success"
//                                   onClick={() => pushOption("")}
//                                   startIcon={<AddCircleOutlineIcon />}
//                                 >
//                                   Add Option
//                                 </Button>
//                               </Grid>
//                             </>
//                           )}
//                         </FieldArray>

//                         {/* Correct Answer */}
//                         <TextField
//                           label="Correct Answer"
//                           name={`questions.${qIndex}.correctAnswer`}
//                           fullWidth
//                           margin="normal"
//                           value={q.correctAnswer}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           error={
//                             touched.questions?.[qIndex]?.correctAnswer &&
//                             Boolean(errors.questions?.[qIndex]?.correctAnswer)
//                           }
//                           helperText={
//                             touched.questions?.[qIndex]?.correctAnswer &&
//                             errors.questions?.[qIndex]?.correctAnswer
//                           }
//                           sx={{ mt: 3 }}
//                         />

//                         {/* Remove Question */}
//                         <Grid item xs={12} sx={{ mt: 2 }}>
//                           <Button
//                             variant="outlined"
//                             color="error"
//                             onClick={() => remove(qIndex)}
//                             disabled={values.questions.length === 1}
//                           >
//                             Remove Question
//                           </Button>
//                         </Grid>
//                       </Card>
//                     ))}
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() =>
//                         push({ question: "", options: ["", ""], correctAnswer: "" })
//                       }
//                       startIcon={<AddCircleOutlineIcon />}
//                     >
//                       Add Question
//                     </Button>
//                   </>
//                 )}
//               </FieldArray>

//               {/* Submit & Cancel */}
//               <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="success"
//                   disabled={isSubmitting}
//                   sx={{ mr: 2 }}
//                 >
//                   {isSubmitting
//                     ? "Submitting..."
//                     : isEditMode
//                     ? "✅ Update Exam"
//                     : "✅ Create Exam"}
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => navigate("/exams")}
//                 >
//                   ⬅️ Cancel
//                 </Button>
//               </Box>
//             </Form>
//           )}
//         </Formik>
//       </Card>
//     </Container>
//   );
// };

// export default CreateExam;


import { Container, Card, Button, TextField, Typography, Box, Autocomplete } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({ title: "", questionIds: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchQuestions();
    if (id) {
      setIsEditMode(true);
      fetchExam();
    }
  }, [id, user, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/questions", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      // toast.error("Failed to fetch questions");
    }
  };

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInitialValues({ title: response.data.title, questionIds: response.data.questions.map(q => q._id) });
    } catch (error) {
      toast.error("Failed to fetch exam");
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Exam title is required"),
    questionIds: Yup.array().min(1, "At least one question is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEditMode ? `http://localhost:8080/api/v1/exams/${id}` : "http://localhost:8080/api/v1/exams";
      const method = isEditMode ? "put" : "post";
      const response = await axios[method](url, values, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success(response.data.message);
      navigate("/exams");
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${isEditMode ? "update" : "create"} exam`);
    }
    setSubmitting(false);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" align="center" gutterBottom>
          {isEditMode ? "✏️ Edit Exam" : "➕ Create New Exam"}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <TextField
                label="Exam Title"
                name="title"
                fullWidth
                margin="normal"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
              <Autocomplete
                multiple
                options={questions}
                getOptionLabel={(option) => option.question}
                value={questions.filter(q => values.questionIds.includes(q._id))}
                onChange={(e, newValue) => setFieldValue("questionIds", newValue.map(v => v._id))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Questions"
                    margin="normal"
                    error={touched.questionIds && Boolean(errors.questionIds)}
                    helperText={touched.questionIds && errors.questionIds}
                  />
                )}
              />
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                >
                  {isSubmitting ? "Submitting..." : isEditMode ? "✅ Update Exam" : "✅ Create Exam"}
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/exams")}>
                  ⬅️ Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};
export default CreateExam;