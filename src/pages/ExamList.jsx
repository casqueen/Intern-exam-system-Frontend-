// import { useState, useEffect } from "react";
// import { Container, Card, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import useAuthStore from "../store/authStore";

// const ExamList = () => {
//   const [exams, setExams] = useState([]);
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     if (!user) {
//       toast.error("Please login to view exams");
//       navigate("/login");
//       return;
//     }
//     fetchExams();
//   }, [user, navigate]);

//   const fetchExams = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/exams`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       setExams(response.data.exams);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch exams");
//     }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.delete(`http://localhost:8080/api/v1/exams/${id}`, {
//             headers: { Authorization: `Bearer ${user?.token}` },
//           });
//           setExams(exams.filter((exam) => exam._id !== id));
//           Swal.fire("Deleted!", response.data.message, "success");
//         } catch (error) {
//           Swal.fire("Error!", error.response?.data?.error || "Failed to delete exam", "error");
//         }
//       }
//     });
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={8}>
//             <Typography variant="h5" color="primary" gutterBottom>
//               📝 Exam List
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
//             {user?.student?.role === "admin" && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => navigate("/exams/create")}
//                 sx={{ mr: 2 }}
//                 aria-label="Create Exam"
//               >
//                 ➕ Create Exam
//               </Button>
//             )}
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
//         <TextField
//           label="Search exams..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           fullWidth
//           margin="normal"
//           aria-label="Search exams"
//         />
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                 <TableCell sx={{ color: 'white' }}>#</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Title</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Date</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {exams
//                 .filter((exam) => exam.title.toLowerCase().includes(search.toLowerCase()))
//                 .map((exam, index) => (
//                   <TableRow key={exam._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{exam.title}</TableCell>
//                     <TableCell>{new Date(exam.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell>
//                       {user?.student?.role === "admin" ? (
//                         <>
//                           <Button
//                             component={Link}
//                             to={`/exams/view/${exam._id}`}
//                             variant="outlined"
//                             color="info"
//                             sx={{ mr: 1 }}
//                             size="small"
//                             aria-label="View Exam"
//                           >
//                             👁 View
//                           </Button>
//                           <Button
//                             component={Link}
//                             to={`/exams/edit/${exam._id}`}
//                             variant="outlined"
//                             color="warning"
//                             sx={{ mr: 1 }}
//                             size="small"
//                             aria-label="Edit Exam"
//                           >
//                             ✏️ Edit
//                           </Button>
//                           <Button
//                             variant="outlined"
//                             color="error"
//                             onClick={() => handleDelete(exam._id)}
//                             sx={{ mr: 1 }}
//                             size="small"
//                             aria-label="Delete Exam"
//                           >
//                             ❌ Delete
//                           </Button>
//                           <Button
//                             component={Link}
//                             to={`/exams/results/${exam._id}`}
//                             variant="outlined"
//                             color="warning"
//                             size="small"
//                             aria-label="View Results"
//                           >
//                             📊 View Results
//                           </Button>
//                         </>
//                       ) : (
//                         <Button
//                           component={Link}
//                           to={`/exams/take/${exam._id}`}
//                           variant="contained"
//                           color="success"
//                           size="small"
//                           aria-label="Take Exam"
//                         >
//                           🎯 Take Exam
//                         </Button>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </Container>
//   );
// };

// export default ExamList;



import { useState, useEffect } from "react";
import { Container, Card, Button, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * ExamList Component
 * @description Displays a list of exams with filtering and pagination
 */
const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view exams");
      navigate("/login");
      return;
    }
    fetchExams();
  }, [user, navigate, page, search, questionType]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/exams?page=${page}&limit=10&search=${search}&type=${questionType}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setExams(response.data.exams);
      setTotal(response.data.pagination.total);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:8080/api/v1/exams/${id}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          });
          setExams(exams.filter((exam) => exam._id !== id));
          Swal.fire("Deleted!", response.data.message, "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete exam", "error");
        }
      }
    });
  };

  const columns = [
    { field: "index", headerName: "#", width: 70, renderCell: (params) => params.row.index + 1 },
    { field: "title", headerName: "Title", width: 300 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <>
          {user?.student?.role === "admin" ? (
            <>
              <Button
                component={Link}
                to={`/exams/view/${params.row._id}`}
                variant="outlined"
                color="info"
                sx={{ mr: 1 }}
                size="small"
                aria-label="View Exam"
              >
                👁 View
              </Button>
              <Button
                component={Link}
                to={`/exams/edit/${params.row._id}`}
                variant="outlined"
                color="warning"
                sx={{ mr: 1 }}
                size="small"
                aria-label="Edit Exam"
              >
                ✏️ Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(params.row._id)}
                sx={{ mr: 1 }}
                size="small"
                aria-label="Delete Exam"
              >
                ❌ Delete
              </Button>
              <Button
                component={Link}
                to={`/exams/results/${params.row._id}`}
                variant="outlined"
                color="warning"
                size="small"
                aria-label="View Results"
              >
                📊 View Results
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to={`/exams/take/${params.row._id}`}
              variant="contained"
              color="success"
              size="small"
              aria-label="Take Exam"
            >
              🎯 Take Exam
            </Button>
          )}
        </>
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
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="region" aria-label="Exam List">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" color="primary" gutterBottom>
                📝 Exam List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "center", sm: "right" } }}>
              {user?.student?.role === "admin" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/exams/create")}
                  sx={{ mr: 2 }}
                  aria-label="Create Exam"
                >
                  ➕ Create Exam
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/dashboard")}
                aria-label="Back to Dashboard"
              >
                ⬅️ Back
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                margin="normal"
                aria-label="Search exams by title"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  label="Question Type"
                  aria-label="Filter by question type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="mcq-single">MCQ Single</MenuItem>
                  <MenuItem value="mcq-multiple">MCQ Multiple</MenuItem>
                  <MenuItem value="true-false">True/False</MenuItem>
                  <MenuItem value="fill-blank">Fill-in-the-Blank</MenuItem>
                  <MenuItem value="short-answer">Short Answer</MenuItem>
                  <MenuItem value="matching">Matching</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={exams.map((exam, index) => ({ ...exam, index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                pagination
                rowCount={total}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage + 1)}
                disableSelectionOnClick
                getRowId={(row) => row._id}
                aria-label="Exam list table"
              />
            </Box>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default ExamList;