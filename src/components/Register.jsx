import { Container, Card, Button, TextField, Typography } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
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
    <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 5 }}>
      <Card sx={{ p: 4, boxShadow: 3, width: "100%", maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          📝 Register
        </Typography>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="name"
                as={TextField}
                label="Name"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="name" />}
                error={Boolean(<ErrorMessage name="name" />)}
              />
              <Field
                name="email"
                as={TextField}
                label="Email"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="email" />}
                error={Boolean(<ErrorMessage name="email" />)}
              />
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                fullWidth
                margin="normal"
                helperText={<ErrorMessage name="password" />}
                error={Boolean(<ErrorMessage name="password" />)}
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};
export default Register;