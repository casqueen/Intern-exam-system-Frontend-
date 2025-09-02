import { Container, Button, Card, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
      <Card sx={{ p: 4, boxShadow: 3, maxWidth: 600, width: '100%', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome to Exam Management System
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Manage and take exams with ease. Admins can create exams and manage students, while students can take exams and view results.
        </Typography>
        {user ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to Dashboard"
          >
            Go to Administrator
          </Button>
        ) : (
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/take-exams")}
              sx={{ mr: 3 }}
              aria-label="Take Exam"
            >
              Take Exam
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/my-exams")}
              aria-label="View My Results"
              sx={{ mr: 3 }}
            >
              View My Results
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/login")}
              aria-label="Login"
            >
              Login
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
};
export default Home;