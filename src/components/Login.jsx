import { Container, Card, Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import axios from "axios";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["admin", "student"], "Invalid role").required("Role is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", values);
      const { token, student } = response.data;
      login(token, student);
      toast.success(`${student.role.charAt(0).toUpperCase() + student.role.slice(1)} logged in successfully!`);
      navigate("/dashboard");
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
          🔑 Login
        </Typography>
        <Formik
          initialValues={{ email: "", password: "", role: "student" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, values, handleChange }) => (
            <FormikForm>
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
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
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
                aria-label="Login"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default Login;