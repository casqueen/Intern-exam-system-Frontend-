import { Container, Card, Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["admin", "student"], "Invalid role").required("Role is required"),
  });

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/register", values);
      const { message } = response.data;
      toast.success(message);
      navigate("/login");
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
      <Card sx={{ p: 4, boxShadow: 3, width: '100%', maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          📝 Register
        </Typography>
        <Formik
          initialValues={{ name: "", email: "", password: "", role: "student" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, values, handleChange }) => (
            <FormikForm>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="normal"
                as={Field}
                helperText={<ErrorMessage name="name" component="div" />}
                error={Boolean(ErrorMessage.name === "name")}
                aria-label="Name"
              />
              <TextField
                label="Email"
                name="email"
                fullWidth
                margin="normal"
                as={Field}
                helperText={<ErrorMessage name="email" component="div" />}
                error={Boolean(ErrorMessage.name === "email")}
                aria-label="Email"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                as={Field}
                helperText={<ErrorMessage name="password" component="div" />}
                error={Boolean(ErrorMessage.name === "password")}
                aria-label="Password"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Field
                  as={Select}
                  name="role"
                  label="Role"
                  onChange={handleChange}
                  value={values.role}
                  aria-label="Role"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Field>
                <ErrorMessage name="role" component="div" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }} />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
                aria-label="Register"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default Register;