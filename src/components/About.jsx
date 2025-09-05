import React from "react";
import { Container, Typography, Box } from "@mui/material";

const About = () => {
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
    </Container>
  );
};

export default About;