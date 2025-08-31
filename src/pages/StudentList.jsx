// import { useState, useEffect } from "react";
// import { Container, Card, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import useAuthStore from "../store/authStore";

// const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     if (!user || user?.student?.role !== "admin") {
//       toast.error("Access denied. Admins only.");
//       navigate("/dashboard");
//       return;
//     }
//     fetchStudents();
//   }, [user, navigate]);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/admin?search=${search}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setStudents(response.data.students);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Failed to fetch students");
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
//           const response = await axios.delete(`http://localhost:8080/api/v1/admin/student/${id}`, {
//             headers: { Authorization: `Bearer ${user.token}` },
//           });
//           setStudents(students.filter((student) => student._id !== id));
//           Swal.fire("Deleted!", response.data.message, "success");
//         } catch (error) {
//           Swal.fire("Error!", error.response?.data?.error || "Failed to delete student", "error");
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
//               📋 Student List
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
//         <TextField
//           label="Search students by name or email..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             fetchStudents();
//           }}
//           fullWidth
//           margin="normal"
//           aria-label="Search students"
//         />
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'primary.main' }}>
//                 <TableCell sx={{ color: 'white' }}>#</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Name</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Email</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Created At</TableCell>
//                 <TableCell sx={{ color: 'white' }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => (
//                 <TableRow key={student._id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.email}</TableCell>
//                   <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       color="warning"
//                       onClick={() => navigate(`/students/edit/${student._id}`)}
//                       sx={{ mr: 1 }}
//                       size="small"
//                       aria-label="Edit Student"
//                     >
//                       ✏️ Edit
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handleDelete(student._id)}
//                       size="small"
//                       aria-label="Delete Student"
//                     >
//                       ❌ Delete
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

// export default StudentList;





import { useState, useEffect } from "react";
import { Container, Card, Button, Typography, Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // Added for animations

/**
 * StudentList Component
 * @description Displays a list of students with search, pagination, and admin actions
 */
const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchStudents();
  }, [user, navigate, page, search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/admin?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudents(response.data.students);
      setTotal(response.data.pagination.total);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch students");
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
          const response = await axios.delete(`http://localhost:8080/api/v1/admin/student/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setStudents(students.filter((student) => student._id !== id));
          Swal.fire("Deleted!", response.data.message, "success");
        } catch (error) {
          Swal.fire("Error!", error.response?.data?.error || "Failed to delete student", "error");
        }
      }
    });
  };

  const columns = [
    { field: "index", headerName: "#", width: 70, renderCell: (params) => params.row.index + 1 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => navigate(`/students/edit/${params.row._id}`)}
            sx={{ mr: 1 }}
            size="small"
            aria-label={`Edit student ${params.row.name}`}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            size="small"
            aria-label={`Delete student ${params.row.name}`}
          >
            ❌ Delete
          </Button>
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
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="region" aria-label="Student List">
          <Typography variant="h5" color="primary" gutterBottom>
            📋 Student List
          </Typography>
          <TextField
            label="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2, maxWidth: 400 }}
            aria-label="Search students by name or email"
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={students.map((student, index) => ({ ...student, index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                pagination
                rowCount={total}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage + 1)}
                disableSelectionOnClick
                getRowId={(row) => row._id}
                aria-label="Student list table"
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

export default StudentList;