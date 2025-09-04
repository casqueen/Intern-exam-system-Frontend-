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
                    error={touched.question && Boolean(errors.questionIds)}
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