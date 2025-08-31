// import { Container, Button, Card, Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const Home = () => {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   return (
//     <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
//       <Card sx={{ p: 4, boxShadow: 3, maxWidth: 600, width: '100%', borderRadius: 2, textAlign: 'center' }}>
//         <Typography variant="h4" color="primary" gutterBottom>
//           Welcome to Exam Management System
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 4 }}>
//           Manage and take exams with ease. Admins can create exams and manage students, while students can take exams and view results.
//         </Typography>
//         {user ? (
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => navigate("/dashboard")}
//             aria-label="Go to Dashboard"
//           >
//             Go to Dashboard
//           </Button>
//         ) : (
//           <Box>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => navigate("/login")}
//               sx={{ mr: 2 }}
//               aria-label="Login"
//             >
//               Login
//             </Button>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => navigate("/register")}
//               aria-label="Register"
//             >
//               Register
//             </Button>
//           </Box>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default Home;



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
            Go to Dashboard
          </Button>
        ) : (
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/exams")}
              sx={{ mr: 2 }}
              aria-label="Take Exams"
            >
              Take Exams
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/my-exams")}
              sx={{ mr: 2 }}
              aria-label="View My Results"
            >
              View My Results
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/login")}
              aria-label="Admin Login"
            >
              Admin Login
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
};
export default Home;