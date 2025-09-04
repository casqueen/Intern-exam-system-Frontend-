import { Container, Card, Button, Grid, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <Container sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          🎉 Administrator: {user?.student?.name || "User"}!
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {user?.student?.role === "admin" ? "Welcome to your testing session. Enter your information, configure your exam." : "Student Dashboard"}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {user?.student?.role === "admin" ? (
            <>
              <Grid item xs={12} md={4}>
                <Button
                  component={Link}
                  to="/students"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  aria-label="Manage Students"
                  sx={{
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  📋 Manage Students
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  component={Link}
                  to="/exams"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  aria-label="Manage Exams"
                  sx={{
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  📝 Manage Exams
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  component={Link}
                  to="/questions"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  aria-label="Manage Questions"
                  sx={{
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  ❓ Manage Questions
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} md={4}>
              <Button
                component={Link}
                to="/testing-room"
                variant="contained"
                color="success"
                fullWidth
                size="large"
                aria-label="Take Exam"
                sx={{
                  '&:hover': {
                    color: 'black'
                  }
                }}
              >
                🎯 Take Exam
              </Button>
            </Grid>
          )}
        </Grid>
      </Card>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #42a5f5, #ab47bc, #26c6da)",
            opacity: 0.7,
          }}
        />
        <Typography
          sx={{
            mx: 2,
            fontSize: 32,
            animation: "spin 2s linear infinite",
            '@keyframes spin': {
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        >
          🎲
        </Typography>
        <Box
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #26c6da, #ab47bc, #42a5f5)",
            opacity: 0.7,
          }}
        />
      </Box>

      <Card sx={{ boxShadow: 2, p: 3, borderRadius: 2, mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Enter the Testing Room
        </Typography>
        <Button
          component={Link}
          to="/testing-room"
          variant="contained"
          color="secondary"
          size="large"
          aria-label="Enter Testing Room"
          sx={{
            '&:hover': {
              color: 'black'
            }
          }}
        >
          🚪 Go to Testing Room
        </Button>
      </Card>

    </Container>
  );
};

export default Dashboard;