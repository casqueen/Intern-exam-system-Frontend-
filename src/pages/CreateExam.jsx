import { Container, Card, Button, TextField, Typography, Grid, IconButton } from "@mui/material";
import { Formik, Field, Form as FormikForm, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    title: "",
    questions: [{ question: "", options: ["", ""], correctAnswer: "" }],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    if (id) {
      setIsEditMode(true);
      const fetchExam = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/exams/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setInitialValues(response.data);
        } catch (error) {
          toast.error(error.response?.data?.error || "Failed to fetch exam");
        }
      };
      fetchExam();
    }
  }, [id, user, navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Exam title is required"),
    questions: Yup.array()
      .of(
        Yup.object().shape({
          question: Yup.string().required("Question is required"),
          options: Yup.array()
            .of(Yup.string().required("Option is required"))
            .min(2, "At least two options required"),
          correctAnswer: Yup.string().required("Correct answer is required").test(
            "valid-correct-answer",
            "Correct answer must be one of the provided options.",
            function (value) {
              const { options } = this.parent;
              return options.includes(value);
            }
          ),
        })
      )
      .min(1, "At least one question is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEditMode
        ? `http://localhost:8080/api/v1/exams/${id}`
        : `http://localhost:8080/api/v1/exams`;
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
          {({ values, setFieldValue, isSubmitting }) => (
            <FormikForm>
              <TextField
                label="Exam Title"
                name="title"
                fullWidth
                margin="normal"
                as={Field}
                helperText={<ErrorMessage name="title" component="div" />}
                error={Boolean(ErrorMessage.name === "title")}
                aria-label="Exam Title"
              />
              <FieldArray name="questions">
                {({ push, remove }) => (
                  <>
                    {values.questions.map((q, qIndex) => (
                      <Card key={qIndex} sx={{ mb: 4, p: 3, boxShadow: 1, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              label={`Question ${qIndex + 1}`}
                              name={`questions.${qIndex}.question`}
                              fullWidth
                              margin="normal"
                              as={Field}
                              helperText={<ErrorMessage name={`questions.${qIndex}.question`} component="div" />}
                              error={Boolean(ErrorMessage.name === `questions.${qIndex}.question`)}
                              aria-label={`Question ${qIndex + 1}`}
                            />
                          </Grid>
                        </Grid>
                        <FieldArray name={`questions.${qIndex}.options`}>
                          {({ push: pushOption, remove: removeOption }) => (
                            <>
                              {values.questions[qIndex].options.map((opt, optIndex) => (
                                <Grid container spacing={2} key={optIndex} alignItems="center" sx={{ mt: 1 }}>
                                  <Grid item xs={10}>
                                    <TextField
                                      label={`Option ${optIndex + 1}`}
                                      name={`questions.${qIndex}.options.${optIndex}`}
                                      fullWidth
                                      margin="normal"
                                      as={Field}
                                      helperText={<ErrorMessage name={`questions.${qIndex}.options.${optIndex}`} component="div" />}
                                      error={Boolean(ErrorMessage.name === `questions.${qIndex}.options.${optIndex}`)}
                                      aria-label={`Option ${optIndex + 1}`}
                                    />
                                  </Grid>
                                  {values.questions[qIndex].options.length > 2 && (
                                    <Grid item xs={2}>
                                      <IconButton
                                        color="error"
                                        onClick={() => removeOption(optIndex)}
                                        aria-label="Remove Option"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  )}
                                </Grid>
                              ))}
                              <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() => pushOption("")}
                                  startIcon={<AddCircleOutlineIcon />}
                                  aria-label="Add Option"
                                >
                                  Add Option
                                </Button>
                              </Grid>
                            </>
                          )}
                        </FieldArray>
                        <TextField
                          label="Correct Answer"
                          name={`questions.${qIndex}.correctAnswer`}
                          fullWidth
                          margin="normal"
                          as={Field}
                          helperText={<ErrorMessage name={`questions.${qIndex}.correctAnswer`} component="div" />}
                          error={Boolean(ErrorMessage.name === `questions.${qIndex}.correctAnswer`)}
                          aria-label="Correct Answer"
                          sx={{ mt: 3 }}
                        />
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => remove(qIndex)}
                            disabled={values.questions.length === 1}
                            aria-label="Remove Question"
                          >
                            Remove Question
                          </Button>
                        </Grid>
                      </Card>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => push({ question: "", options: ["", ""], correctAnswer: "" })}
                      startIcon={<AddCircleOutlineIcon />}
                      aria-label="Add Question"
                    >
                      Add Question
                    </Button>
                  </>
                )}
              </FieldArray>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                  aria-label={isEditMode ? "Update Exam" : "Create Exam"}
                >
                  {isSubmitting ? "Submitting..." : isEditMode ? "✅ Update Exam" : "✅ Create Exam"}
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
            </FormikForm>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default CreateExam;