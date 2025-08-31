import { CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion"; // Added for subtle animation

/**
 * LoadingSpinner Component
 * @description Displays a centered loading spinner using MUI components with accessibility
 */
const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
      role="status"
      aria-label="Loading"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CircularProgress color="primary" size={60} aria-label="Loading spinner" />
      </motion.div>
    </Box>
  );
};

export default LoadingSpinner;