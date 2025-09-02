import { Container, Card, Button, TextField, Typography, Grid, IconButton, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete } from "@mui/material";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    type: "single",
    question: "",
    options: ["", ""],
    correctAnswers: [],
    score: 1,
    // allowedTime: 60,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    if (id) {
      setIsEditMode(true);
      fetchQuestion();
    }
  }, [id, user, navigate]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/questions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const temp = {
        type: response.data.type,
        question: response.data.question,
        correctAnswers: response.data.correctAnswers,
        options: response.data.options,
        score: response.data.score,
        // allowedTime: response.data.allowedTime,
      };
      setInitialValues(temp);
    } catch (error) {
      toast.error("Failed to fetch question");
    }
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().oneOf(["single", "multiple"]).required("Type is required"),
    question: Yup.string().required("Question is required"),
    options: Yup.array().of(Yup.string().required("Option is required")).min(2, "At least two options required"),
    correctAnswers: Yup.array()
      .min(1, "At least one correct answer")
      .test("valid-correct", "Correct answers must be from options", 
      function (value) {
        const { options, type } = this.parent;
        if (type === "single" && value.length !== 1) return false;
        return value.every((v) => options.includes(v));
      }),
    score: Yup.number().min(1, "Score must be at least 1").required("Score is required"),
  //   allowedTime: Yup.number().min(10, "Allowed time must be at least 10 seconds").required("Allowed time is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEditMode ? `http://localhost:8080/api/v1/questions/${id}` : "http://localhost:8080/api/v1/questions";
      const method = isEditMode ? "put" : "post";
      const response = await axios[method](url, values, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success(response.data.message);
      navigate("/questions");
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${isEditMode ? "update" : "create"} question`);
    }
    setSubmitting(false);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" color="primary" align="center" gutterBottom>
          {isEditMode ? "✏️ Edit Question" : "➕ Create New Question"}
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
                  <MenuItem value="single">Single Correct</MenuItem>
                  <MenuItem value="multiple">Multiple Correct</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Question"
                name="question"
                fullWidth
                margin="normal"
                value={values.question}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.question && Boolean(errors.question)}
                helperText={touched.question && errors.question}
              />
              <FieldArray name="options">
                {({ push, remove }) => (
                  <>
                    {values.options.map((opt, index) => (
                      <Grid container spacing={2} key={index} alignItems="center">
                        <Grid item xs={10}>
                          <TextField
                            label={`Option ${index + 1}`}
                            name={`options.${index}`}
                            fullWidth
                            margin="normal"
                            value={opt}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.options?.[index] && Boolean(errors.options?.[index])}
                            helperText={touched.options?.[index] && errors.options?.[index]}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          {values.options.length > 2 && (
                            <IconButton color="error" onClick={() => remove(index)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => push("")}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Add Option
                    </Button>
                  </>
                )}
              </FieldArray>
              <Autocomplete
                multiple={values.type === "multiple"}
                options={values.options}
                value={values.type === "single" ? (values.correctAnswers[0] || "") : values.correctAnswers}
                onChange={(e, newValue) => setFieldValue("correctAnswers", values.type === "single" ? [newValue] : newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Correct Answers"
                    margin="normal"
                    error={touched.correctAnswers && Boolean(errors.correctAnswers)}
                    helperText={touched.correctAnswers && errors.correctAnswers}
                  />
                )}
              />
              <TextField
                label="Score"
                name="score"
                type="number"
                fullWidth
                margin="normal"
                value={values.score}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.score && Boolean(errors.score)}
                helperText={touched.score && errors.score}
                inputProps={{ min: 1 }}
              />
              {/* <TextField
                label="Allowed Time (seconds)"
                name="allowedTime"
                type="number"
                fullWidth
                margin="normal"
                value={values.allowedTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.allowedTime && Boolean(errors.allowedTime)}
                helperText={touched.allowedTime && errors.allowedTime}
                inputProps={{ min: 10 }}
              /> */}
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                >
                  {isSubmitting ? "Submitting..." : isEditMode ? "✅ Update Question" : "✅ Create Question"}
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/questions")}>
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

export default CreateQuestion;