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
      const response = await axios.post("http://localhost:8080/api/v1/auth/login", values);
      const { token, student } = response.data; // UPDATED: Removed unused 'admin' from destructuring
      login(token, student);
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
        <h2 className="text-center mb-4">🔑 Login</h2>
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
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
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



// import { Container, Form, Button, Card } from "react-bootstrap";
// import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string().required("Password is required"),
//     role: Yup.string().oneOf(["admin", "student"], "Invalid role").required("Role is required"),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/v1/auth/login", values);
//       login(response.data.token, response.data.user);
//       toast.success("Login successful!");
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Login failed");
//     }
//     setSubmitting(false);
//   };

//   return (
//     <Container className="d-flex justify-content-center mt-5">
//       <Card className="p-4 shadow-lg" style={{ maxWidth: "400px" }}>
//         <h2 className="text-primary text-center mb-4">🔑 Login</h2>
//         <Formik
//           initialValues={{ email: "", password: "", role: "student" }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <FormikForm>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Field name="email" type="email" as={Form.Control} placeholder="Enter email" />
//                 <ErrorMessage name="email" component="div" className="text-danger" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Field name="password" type="password" as={Form.Control} placeholder="Enter password" />
//                 <ErrorMessage name="password" component="div" className="text-danger" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Field name="role" as={Form.Select}>
//                   <option value="student">Student</option>
//                   <option value="admin">Admin</option>
//                 </Field>
//                 <ErrorMessage name="role" component="div" className="text-danger" />
//               </Form.Group>
//               <div className="text-center">
//                 <Button type="submit" variant="primary" disabled={isSubmitting}>
//                   {isSubmitting ? "Logging in..." : "Login"}
//                 </Button>
//               </div>
//             </FormikForm>
//           )}
//         </Formik>
//       </Card>
//     </Container>
//   );
// };

// export default Login;