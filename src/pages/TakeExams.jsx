import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const TakeExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/v1/exams");
      // backend returns { exams, pagination }
      if (response.data && response.data.exams) {
        setExams(response.data.exams);
      } else {
        setExams(response.data || []);
      }
    } catch (error) {
      // toast.error(error.response?.data?.error || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId);
    setOpenDialog(true);
  };

  const handleConfirmStart = async () => {
    if (!name || !email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid name and email address.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/v1/auth/signup", { name, email });
      navigate(`/testing-room/${selectedExamId}`);
      setOpenDialog(false);
      setName("");
      setEmail("");
      setSelectedExamId(null);
      toast.success("Exam started successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to start exam");
    }
  };

  const handleCancelStart = () => {
    setOpenDialog(false);
    setName("");
    setEmail("");
    setSelectedExamId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            📚 Select an Exam
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
            Choose from the list of available exams to start your test. You can also create a random exam.
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress aria-label="Loading exams" />
            </Box>
          ) : exams.length === 0 ? (
            <Typography variant="h6" align="center" color="text.secondary">
              No exams available. Create a random exam to get started.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <Table aria-label="Available exams table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Exam Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Questions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow
                      key={exam._id}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <TableCell>{exam.title}</TableCell>
                      <TableCell>{exam.questionIds?.length || 0}</TableCell>
                      <TableCell>{new Date(exam.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSelectExam(exam._id)}
                          sx={{ borderRadius: 2 }}
                          aria-label={`Start ${exam.title} exam`}
                        >
                          Start Exam
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/testing-room")}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Create random exam"
            >
              🎲 Create Random Exam
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              aria-label="Back to dashboard"
            >
              ⬅️ Back to Dashboard
            </Button>
          </Box>
        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelStart}
        PaperProps={{ sx: { bgcolor: "#333", color: "#fff" } }}
        aria-labelledby="start-exam-dialog-title"
        aria-describedby="start-exam-dialog-description"
      >
        <DialogTitle id="start-exam-dialog-title" sx={{ color: "#fff" }}>
          Start Exam
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="start-exam-dialog-description" sx={{ color: "#ccc" }}>
            To start this exam, please enter your name and email address here. We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name *"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ input: { color: "#fff" }, label: { color: "#ccc" }, "& .MuiInput-underline:before": { borderBottomColor: "#ccc" } }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address *"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ input: { color: "#fff" }, label: { color: "#ccc" }, "& .MuiInput-underline:before": { borderBottomColor: "#ccc" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStart} color="inherit" sx={{ color: "#77f" }} aria-label="Cancel exam start">
            CANCEL
          </Button>
          <Button onClick={handleConfirmStart} color="inherit" sx={{ color: "#77f" }} aria-label="Confirm exam start">
            SUBSCRIBE
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TakeExams;