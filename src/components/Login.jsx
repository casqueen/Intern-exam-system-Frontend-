import { Container, Form, Button, Card } from "react-bootstrap";
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
    // UPDATED: Added role validation
    role: Yup.string().oneOf(["admin", "student"], "Invalid role").required("Role is required"),
  });
  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("http://localhost:6000/api/v2/auth/login", values);
      const { token, student } = response.data; // UPDATED: Removed unused 'admin' from destructuring
      login({ student, token });
      toast.success(`${student.role.charAt(0).toUpperCase() + student.role.slice(1)} logged in successfully!`); // UPDATED: Unified toast message based on role
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
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "", role: "student" }} // UPDATED: Added initial role value
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  as={Form.Control}
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  as={Form.Control}
                />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </Form.Group>
              {/* UPDATED: Added role selection dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Field as="select" name="role" className="form-control">
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-danger" />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100" disabled={isSubmitting}>
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