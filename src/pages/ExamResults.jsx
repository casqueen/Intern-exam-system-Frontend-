// import { useState, useEffect } from "react";
// import { Container, Card, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import useAuthStore from "../store/authStore";

// const ExamResults = () => {
//   const { examId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     if (!user || user?.student?.role !== "admin") {
//       toast.error("Access denied. Admins only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchResults();
//   }, [examId, user, navigate]);

//   const fetchResults = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/admin/exam-results/${examId}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setResults(response.data);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch results");
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Typography variant="h5" color="primary" gutterBottom>
//           📊 Exam Results
//         </Typography>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                 <TableCell sx={{ color: 'white' }}>#</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Student Name</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Email</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Exam Title</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Score</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Status</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Exam Date</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {results.map((result, index) => (
//                 <TableRow key={result.studentId}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{result.name}</TableCell>
//                   <TableCell>{result.email}</TableCell>
//                   <TableCell>{result.examTitle}</TableCell>
//                   <TableCell>{result.score}</TableCell>
//                   <TableCell>{result.passed}</TableCell>
//                   <TableCell>{result.examDate}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Box sx={{ mt: 4 }}>
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() => navigate("/exams")}
//             aria-label="Back"
//           >
//             ⬅️ Back
//           </Button>
//         </Box>
//       </Card>
//     </Container>
//   );
// };

// export default ExamResults;


import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * ExamResults Component
 * @description Displays results for a specific exam
 */
const ExamResults = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchResults();
  }, [examId, user, navigate]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/admin/exam-results/${examId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResults(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 70, renderCell: (params) => params.row.index + 1 },
    { field: "name", headerName: "Student Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "examTitle", headerName: "Exam Title", width: 200 },
    { field: "score", headerName: "Score", width: 100 },
    { field: "passed", headerName: "Status", width: 100 },
    {
      field: "examDate",
      headerName: "Exam Date",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="region" aria-label="Exam Results">
          <Typography variant="h5" color="primary" gutterBottom>
            📊 Exam Results
          </Typography>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={results.map((result, index) => ({ ...result, index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                getRowId={(row) => row.studentId}
                aria-label="Exam results table"
              />
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/exams")}
                  aria-label="Back to Exams"
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

export default ExamResults;