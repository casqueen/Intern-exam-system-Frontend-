import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useAuthStore from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist
import { motion } from "framer-motion"; // For animations
import { form } from "framer-motion/client";

/**
 * QuestionBank Component
 * @description Allows admins to manage questions (create, edit, delete) with support for all question types and image uploads
 */
const QuestionBank = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    ques: "",
    options: ["", ""],
    correctAnswers: [],
    points: 1,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!user || user?.student?.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/dashboard");
      return;
    }
    fetchQuestions();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/v1/questions", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayInput = (e, index, field) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleAddArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleRemoveArrayItem = (index, field) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        console.log("form data, ", key, "data==>", formData[key]);
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
      const url = isEditMode
        ? `http://localhost:8080/api/v1/questions/${editId}`
        : "http://localhost:8080/api/v1/questions";
      const method = isEditMode ? "put" : "post";
      console.log('data-->', data);
      const response = await axios({
        method,
        url,
        data,
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      fetchQuestions();
      resetForm();
    } catch (error) {
      console.log("error details:", error);
      toast.error(error.response?.data?.error || `Failed to ${isEditMode ? "update" : "create"} question`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      ques: "",
      options: ["", ""],
      correctAnswers: [],
      blankAnswer: "",
      keywords: [],
      matchingLeft: [],
      matchingRight: [],
      correctMatches: [],
      points: 1,
      image: null,
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (question) => {
    setFormData({
      type: question.type,
      ques: question.ques,
      options: question.options || [],
      correctAnswers: question.correctAnswers || [],
      blankAnswer: question.blankAnswer || "",
      keywords: question.keywords || [],
      matchingLeft: question.matchingLeft || [],
      matchingRight: question.matchingRight || [],
      correctMatches: question.correctMatches || [],
      points: question.points,
      image: null,
    });
    setIsEditMode(true);
    setEditId(question._id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/questions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success(response.data.message);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete question");
    }
  };

  const columns = [
    { field: "index", headerName: "#", width: 70, renderCell: (params) => params.row.index + 1 },
    { field: "ques", headerName: "Question Text", width: 300 },
    { field: "type", headerName: "Type", width: 150, renderCell: (params) => <Chip label={params.value} color="primary" /> },
    { field: "points", headerName: "Points", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            aria-label={`Edit question ${params.row.ques}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            color="error"
            aria-label={`Delete question ${params.row.ques}`}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ boxShadow: 3, p: 4, borderRadius: 2 }} role="form" aria-label="Question Bank">
          <Typography variant="h5" color="primary" gutterBottom>
            ❓ Question Bank
          </Typography>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="type-label">Question Type</InputLabel>
                      <Select
                        labelId="type-label"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        label="Question Type"
                        aria-label="Select question type"
                      >
                        <MenuItem value="mcq-single">MCQ Single</MenuItem>
                        <MenuItem value="mcq-multiple">MCQ Multiple</MenuItem>
                        <MenuItem value="true-false">True/False</MenuItem>
                        <MenuItem value="fill-blank">Fill-in-the-Blank</MenuItem>
                        <MenuItem value="short-answer">Short Answer</MenuItem>
                        <MenuItem value="matching">Matching</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Points"
                      name="points"
                      type="number"
                      value={formData.points}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1 }}
                      aria-label="Question points"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Question Text"
                      name="ques"
                      value={formData.ques}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      aria-label="Question ques"
                    />
                  </Grid>
                  {(formData.type === "mcq-single" || formData.type === "mcq-multiple" || formData.type === "true-false") && (
                    <>
                      {formData.options.map((option, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            label={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleArrayInput(e, index, "options")}
                            fullWidth
                            margin="normal"
                            aria-label={`Option ${index + 1}`}
                          />
                          {formData.options.length > 2 && (
                            <Button
                              onClick={() => handleRemoveArrayItem(index, "options")}
                              color="error"
                              aria-label={`Remove option ${index + 1}`}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={() => handleAddArrayItem("options")}
                          variant="outlined"
                          aria-label="Add option"
                        >
                          Add Option
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="correct-answers-label">Correct Answer(s)</InputLabel>
                          <Select
                            labelId="correct-answers-label"
                            name="correctAnswers"
                            multiple={formData.type === "mcq-multiple"}
                            value={formData.correctAnswers}
                            onChange={handleInputChange}
                            label="Correct Answer(s)"
                            aria-label="Select correct answers"
                          >
                            {formData.options.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {formData.type === "fill-blank" && (
                    <Grid item xs={12}>
                      <TextField
                        label="Correct Answer"
                        name="blankAnswer"
                        value={formData.blankAnswer}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        aria-label="Correct answer for fill-in-the-blank"
                      />
                    </Grid>
                  )}
                  {formData.type === "short-answer" && (
                    <>
                      {formData.keywords.map((keyword, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            label={`Keyword ${index + 1}`}
                            value={keyword}
                            onChange={(e) => handleArrayInput(e, index, "keywords")}
                            fullWidth
                            margin="normal"
                            aria-label={`Keyword ${index + 1}`}
                          />
                          {formData.keywords.length > 1 && (
                            <Button
                              onClick={() => handleRemoveArrayItem(index, "keywords")}
                              color="error"
                              aria-label={`Remove keyword ${index + 1}`}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={() => handleAddArrayItem("keywords")}
                          variant="outlined"
                          aria-label="Add keyword"
                        >
                          Add Keyword
                        </Button>
                      </Grid>
                    </>
                  )}
                  {formData.type === "matching" && (
                    <>
                      {formData.matchingLeft.map((left, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            label={`Left Item ${index + 1}`}
                            value={left}
                            onChange={(e) => handleArrayInput(e, index, "matchingLeft")}
                            fullWidth
                            margin="normal"
                            aria-label={`Left item ${index + 1}`}
                          />
                          {formData.matchingLeft.length > 1 && (
                            <Button
                              onClick={() => handleRemoveArrayItem(index, "matchingLeft")}
                              color="error"
                              aria-label={`Remove left item ${index + 1}`}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={() => handleAddArrayItem("matchingLeft")}
                          variant="outlined"
                          aria-label="Add left item"
                        >
                          Add Left Item
                        </Button>
                      </Grid>
                      {formData.matchingRight.map((right, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <TextField
                            label={`Right Item ${index + 1}`}
                            value={right}
                            onChange={(e) => handleArrayInput(e, index, "matchingRight")}
                            fullWidth
                            margin="normal"
                            aria-label={`Right item ${index + 1}`}
                          />
                          {formData.matchingRight.length > 1 && (
                            <Button
                              onClick={() => handleRemoveArrayItem(index, "matchingRight")}
                              color="error"
                              aria-label={`Remove right item ${index + 1}`}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={() => handleAddArrayItem("matchingRight")}
                          variant="outlined"
                          aria-label="Add right item"
                        >
                          Add Right Item
                        </Button>
                      </Grid>
                      {formData.correctMatches.map((match, index) => (
                        <Grid container item xs={12} spacing={2} key={index}>
                          <Grid item xs={6}>
                            <TextField
                              label={`Match Left ${index + 1}`}
                              value={match.left}
                              onChange={(e) => handleMatchesInput(e, index, "left")}
                              fullWidth
                              margin="normal"
                              aria-label={`Match left ${index + 1}`}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label={`Match Right ${index + 1}`}
                              value={match.right}
                              onChange={(e) => handleMatchesInput(e, index, "right")}
                              fullWidth
                              margin="normal"
                              aria-label={`Match right ${index + 1}`}
                            />
                          </Grid>
                          {formData.correctMatches.length > 1 && (
                            <Grid item xs={12}>
                              <Button
                                onClick={() => handleRemoveArrayItem(index, "correctMatches")}
                                color="error"
                                aria-label={`Remove match ${index + 1}`}
                              >
                                Remove Match
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          onClick={handleAddMatch}
                          variant="outlined"
                          aria-label="Add match"
                        >
                          Add Match
                        </Button>
                      </Grid>
                    </>
                  )}
                  {/* <Grid item xs={12}>
                    <DropzoneArea
                      acceptedFiles={["image/*"]}
                      filesLimit={1}
                      onChange={handleImageDrop}
                      showPreviewsInDropzone={true}
                      dropzoneText="Drag and drop an image here or click"
                      maxFileSize={5000000} // 5MB
                      aria-label="Upload question image"
                    />
                  </Grid> */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={loading}
                      sx={{ mr: 2 }}
                      aria-label={isEditMode ? "Update Question" : "Create Question"}
                    >
                      {loading ? <CircularProgress size={24} /> : isEditMode ? "✅ Update" : "✅ Create"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={resetForm}
                      aria-label="Cancel"
                    >
                      ⬅️ Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Box sx={{ mt: 4, height: 400, width: "100%" }}>
                <DataGrid
                  rows={questions.map((q, index) => ({ ...q, index }))}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  getRowId={(row) => row._id}
                  aria-label="Question list table"
                />
              </Box>
            </>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};

export default QuestionBank;