import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About Exam Management System
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Exam Management System — a lightweight platform designed to simplify
          creating, delivering, and grading online exams for educators and institutions.
        </Typography>

        <Typography variant="body1" paragraph>
          Our goal is to provide a reliable and secure environment for assessments, with features
          such as user management, timed exams, automatic scoring, and analytics to help you make
          data-driven decisions.
        </Typography>

        <Typography variant="body1" paragraph>
          Whether you’re an instructor managing large classes or a small training provider, this
          system aims to make the assessment process smoother and more efficient.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "left", gap: 2, mt: 4 }}>   
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ px: 2, py: 1, borderRadius: 2 }}
          aria-label="Back to dashboard"
        >
          ⬅️ Back to Dashboard
        </Button>
      </Box>
    </Container>

    
  );
};

export default About;