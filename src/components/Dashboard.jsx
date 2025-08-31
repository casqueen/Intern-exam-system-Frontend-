// import { Container, Card, Button, Grid, Typography } from "@mui/material";
// import { Link } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const Dashboard = () => {
//   const { user } = useAuthStore();

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Typography variant="h4" color="primary" align="center" gutterBottom>
//           🎉 Welcome, {user?.student?.name}!
//         </Typography>
//         {user?.student?.role === "admin" ? (
//           <>
//             <Typography variant="h5" align="center" gutterBottom>
//               Admin Dashboard
//             </Typography>
//             <Grid container spacing={2} justifyContent="center">
//               <Grid item xs={12} md={6}>
//                 <Button
//                   component={Link}
//                   to="/students"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="large"
//                   aria-label="Manage Students"
//                 >
//                   📋 Manage Students
//                 </Button>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Button
//                   component={Link}
//                   to="/exams"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="large"
//                   aria-label="Manage Exams"
//                 >
//                   📝 Manage Exams
//                 </Button>
//               </Grid>
//             </Grid>
//           </>
//         ) : (
//           <>
//             <Typography variant="h5" align="center" gutterBottom>
//               Student Dashboard
//             </Typography>
//             <Grid container spacing={2} justifyContent="center">
//               <Grid item xs={12} md={6}>
//                 <Button
//                   component={Link}
//                   to="/exams"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="large"
//                   aria-label="Take Exams"
//                 >
//                   🎯 Take Exams
//                 </Button>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Button
//                   component={Link}
//                   to="/exam-list"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="large"
//                   aria-label="View My Results"
//                 >
//                   📊 View My Results
//                 </Button>
//               </Grid>
//             </Grid>
//           </>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default Dashboard;


import { Container, Card, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion"; // Added for animations

/**
 * Dashboard Component
 * @description Displays user-specific dashboard with role-based navigation
 */
const Dashboard = () => {
  const { user } = useAuthStore();
  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom aria-label="Welcome message">
            🎉 Welcome, {user?.student?.name}!
          </Typography>
          {user?.student?.role === "admin" ? (
            <>
              <Typography variant="h5" align="center" gutterBottom>
                Admin Dashboard
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    component={Link}
                    to="/students"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    aria-label="Manage Students"
                  >
                    📋 Manage Students
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    component={Link}
                    to="/exams"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    aria-label="Manage Exams"
                  >
                    📝 Manage Exams
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    component={Link}
                    to="/question-bank"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    aria-label="Manage Questions"
                  >
                    ❓ Manage Questions
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Typography variant="h5" align="center" gutterBottom>
                Student Dashboard
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/exams"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    aria-label="Take Exams"
                  >
                    🎯 Take Exams
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/exam-list"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    aria-label="View My Results"
                  >
                    📊 View My Results
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default Dashboard;