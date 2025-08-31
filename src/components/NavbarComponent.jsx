import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import useAuthStore from "../store/authStore";
import { useState } from "react";

const NavbarComponent = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Exam Management
      </Typography>
      <List>
        {user ? (
          <>
            {user?.student?.role === "admin" && (
              <>
                <ListItem button component={Link} to="/students">
                  <ListItemText primary="Students" />
                </ListItem>
                <ListItem button component={Link} to="/exams">
                  <ListItemText primary="Exams" />
                </ListItem>
              </>
            )}
            {user?.student?.role === "student" && (
              <>
                <ListItem button component={Link} to="/exams">
                  <ListItemText primary="Available Exams" />
                </ListItem>
                <ListItem button component={Link} to="/exam-list">
                  <ListItemText primary="My Exams" />
                </ListItem>
              </>
            )}
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Exam Management
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {user ? (
              <>
                {user?.student?.role === "admin" && (
                  <>
                    <Button color="inherit" component={Link} to="/students">Students</Button>
                    <Button color="inherit" component={Link} to="/exams">Exams</Button>
                  </>
                )}
                {user?.student?.role === "student" && (
                  <>
                    <Button color="inherit" component={Link} to="/exams">Available Exams</Button>
                    <Button color="inherit" component={Link} to="/exam-list">My Exams</Button>
                  </>
                )}
                <Button color="warning" component={Link} to="/dashboard">Dashboard</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="warning" component={Link} to="/login">Login</Button>
                <Button color="warning" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavbarComponent;