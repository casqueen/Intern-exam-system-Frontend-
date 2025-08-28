import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "600px" }}>
        <h1 className="text-primary mb-4">Welcome to Exam Management System</h1>
        <p className="mb-4">
          Manage and take exams with ease. Admins can create exams and manage students, while students can take exams and view results.
        </p>
        {user ? (
          <Button variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        ) : (
          <div>
            <Button variant="success" className="me-2" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="success" onClick={() => navigate("/register")}>Register</Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Home;