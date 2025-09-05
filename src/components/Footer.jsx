import { AppBar, Box, Typography, Link, Divider, useTheme, useMediaQuery } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion"; // Added for animations

/**
 * Footer Component
 * @description Displays footer with links and responsive design
 */
const Footer = () => {
  const { user } = useAuthStore();
  const theme = useTheme(); // ...existing code...
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // ...existing code...
  const dividerOrientation = isSmall ? "horizontal" : "vertical"; // ...existing code...

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar
        position="static"
        sx={{ top: "auto", bottom: 0, py: 2, backgroundColor: "primary.dark", boxShadow: 3 }}
        role="contentinfo"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            mx: "auto",
          }}
        >
          <Typography variant="body2" color="white" sx={{ textAlign: { xs: "center", sm: "center" } }}>
            📘 Exam Management System – Your trusted partner in online learning & assessments.
          </Typography>

          <Divider
            sx={{
              my: { xs: 1, sm: 0 },
              mx: { xs: 0, sm: 2 },
              bgcolor: "white",
              width: { xs: "100%", sm: "2px" },
              height: { xs: "2px", sm: 32 },
              alignSelf: { sm: "center" },
              display: { xs: "block", sm: "inline-block" }
            }}
            orientation={dividerOrientation}
            flexItem
          />
          
          <Typography
            variant="body2"
            color="white"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
            aria-label="Copyright information"
          >
            &copy; {new Date().getFullYear()} Built by{" "}
            <Link
              href="https://mail.google.com/mail/u/0/#inbox"
              color="success.main"
              underline="none"
              sx={{ mx: 1 }}
              aria-label="Contact Magi"
            >
              @magi
            </Link>
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", sm: "flex-end" } }}>
            <Typography variant="body2" color="white"  sx={{ ml: 4 }}>
              <Link
                component={RouterLink}
                to="/about"
                color="warning.main"
                underline="none"
                sx={{ mr: 2 }}
                aria-label="About page"
              >
                About
              </Link>
            </Typography>
          </Box>
        </Box>
      </AppBar>
    </motion.div>
  );
};

export default Footer;
