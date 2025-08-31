import { AppBar, Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Footer = () => {
  const { user } = useAuthStore();

  return (
    <AppBar position="static" sx={{ top: "auto", bottom: 0, py: 2, backgroundColor: "primary.dark", boxShadow: 3}}>
      <Box sx={{  display: "flex", justifyContent: "space-between", alignItems: "center", px: { xs: 2, sm: 4 },
          flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 0 }, maxWidth: 1400,  width: "100%", mx: "auto",}}>
        <Typography variant="body2" color="white" sx={{ textAlign: { xs: "center", sm: "left" } }}>
          &copy; {new Date().getFullYear()} Built by{" "}
          <Link href="https://mail.google.com/mail/u/0/#inbox" color="success.main" underline="none" sx={{ mx: 1 }} aria-label="Contact Magi">@magi</Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2,  justifyContent: { xs: "center", sm: "flex-end" }}}>
          <Typography variant="body2" color="white">
            <Link component={RouterLink} to="/about" color="info.main" underline="none" sx={{ mr: 3 }} aria-label="About">About</Link>
            <Link component={RouterLink} to="/contact" color="info.main" underline="none" aria-label="Contact">Contact</Link>
          </Typography>
        </Box>

      </Box>
    </AppBar>
  );
};

export default Footer;
