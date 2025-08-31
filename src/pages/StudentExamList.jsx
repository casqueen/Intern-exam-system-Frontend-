// import { useState, useEffect } from "react";
// import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "../store/authStore";

// const StudentExamList = () => {
//   const [exams, setExams] = useState([]);
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     if (!user || user?.student?.role !== "student") {
//       toast.error("Access denied. Students only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchExams();
//   }, [user, navigate]);

//   const fetchExams = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/student/${user?.student?._id}/exams`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setExams(response.data.exams);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch exams");
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={8}>
//             <Typography variant="h5" color="primary" gutterBottom>
//               📝 My Exams
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={() => navigate("/dashboard")}
//               aria-label="Back"
//             >
//               ⬅️ Back
//             </Button>
//           </Grid>
//         </Grid>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                 <TableCell sx={{ color: 'white' }}>#</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Title</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Score</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Status</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Exam Date</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {exams.map((exam, index) => (
//                 <TableRow key={exam.examId}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{exam.title}</TableCell>
//                   <TableCell>{exam.score}</TableCell>
//                   <TableCell>{exam.passed ? "✅ Passed" : "❌ Failed"}</TableCell>
//                   <TableCell>{exam.examDate}</TableCell>
//                   <TableCell>
//                     <Button
//                       component={Link}
//                       to={`/result/${exam.examId}`}
//                       variant="outlined"
//                       color="info"
//                       size="small"
//                       aria-label="View Result"
//                     >
//                       📊 View Result
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </Container>
//   );
// };

// export default StudentExamList;


import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * StudentExamList Component
 * @description Displays exams taken by the student with filtering and responsive UI
 */
const StudentExamList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.student?.role !== "student") {
      toast.error("Access denied. Students only.");
      navigate("/dashboard");
      return;
    }
    fetchExams();
  }, [user, navigate, search]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/student/${user.student._id}/exams`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExams(
        response.data.exams.filter((exam) =>
          exam.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 70, renderCell: (params) => params.row.index + 1 },
    { field: "title", headerName: "Exam Title", width: 300 },
    { field: "totalScore", headerName: "Score", width: 100 },
    { field: "passed", headerName: "Status", width: 100, renderCell: (params) => params.value ? "Passed ✅" : "Failed ❌" },
    {
      field: "examDate",
      headerName: "Exam Date",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/results/${params.row.examId}`}
          variant="outlined"
          color="info"
          size="small"
          aria-label={`View result for ${params.row.title}`}
        >
          👁 View Result
        </Button>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="region" aria-label="Student Exam List">
          <Typography variant="h5" color="primary" gutterBottom>
            📝 My Exams
          </Typography>
          <TextField
            label="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2, maxWidth: 400 }}
            aria-label="Search exams by title"
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={exams.map((exam, index) => ({ ...exam, index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                getRowId={(row) => row.examId}
                aria-label="Student exam list table"
              />
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/dashboard")}
                  aria-label="Back to Dashboard"
                >
                  ⬅️ Back
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default StudentExamList;