// import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import MenuIcon from '@mui/icons-material/Menu';
// import useAuthStore from "../store/authStore";
// import { useState } from "react";

// const NavbarComponent = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const drawer = (
//     <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
//       <Typography variant="h6" sx={{ my: 2 }}>
//         Exam Management
//       </Typography>
//       <List>
//         {user ? (
//           <>
//             {user?.student?.role === "admin" && (
//               <>
//                 <ListItem button component={Link} to="/students">
//                   <ListItemText primary="Students" />
//                 </ListItem>
//                 <ListItem button component={Link} to="/exams">
//                   <ListItemText primary="Exams" />
//                 </ListItem>
//               </>
//             )}
//             {user?.student?.role === "student" && (
//               <>
//                 <ListItem button component={Link} to="/exams">
//                   <ListItemText primary="Available Exams" />
//                 </ListItem>
//                 <ListItem button component={Link} to="/exam-list">
//                   <ListItemText primary="My Exams" />
//                 </ListItem>
//               </>
//             )}
//             <ListItem button component={Link} to="/dashboard">
//               <ListItemText primary="Dashboard" />
//             </ListItem>
//             <ListItem button onClick={handleLogout}>
//               <ListItemText primary="Logout" />
//             </ListItem>
//           </>
//         ) : (
//           <>
//             <ListItem button component={Link} to="/login">
//               <ListItemText primary="Login" />
//             </ListItem>
//             <ListItem button component={Link} to="/register">
//               <ListItemText primary="Register" />
//             </ListItem>
//           </>
//         )}
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
//             Exam Management
//           </Typography>
//           <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//             {user ? (
//               <>
//                 {user?.student?.role === "admin" && (
//                   <>
//                     <Button color="inherit" component={Link} to="/students">Students</Button>
//                     <Button color="inherit" component={Link} to="/exams">Exams</Button>
//                   </>
//                 )}
//                 {user?.student?.role === "student" && (
//                   <>
//                     <Button color="inherit" component={Link} to="/exams">Available Exams</Button>
//                     <Button color="inherit" component={Link} to="/exam-list">My Exams</Button>
//                   </>
//                 )}
//                 <Button color="warning" component={Link} to="/dashboard">Dashboard</Button>
//                 <Button color="inherit" onClick={handleLogout}>Logout</Button>
//               </>
//             ) : (
//               <>
//                 <Button color="warning" component={Link} to="/login">Login</Button>
//                 <Button color="warning" component={Link} to="/register">Register</Button>
//               </>
//             )}
//           </Box>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="end"
//             onClick={handleDrawerToggle}
//             sx={{ display: { md: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         sx={{ display: { xs: 'block', md: 'none' } }}
//       >
//         {drawer}
//       </Drawer>
//     </>
//   );
// };

// export default NavbarComponent;




import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useAuthStore from "../store/authStore";
import { useState } from "react";
import { motion } from "framer-motion"; // Added for animations

/**
 * Navbar Component
 * @description Navigation bar with role-based links and responsive drawer
 */
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
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }} aria-label="Exam Management">
        Exam Management
      </Typography>
      <List>
        {user ? (
          <>
            {user?.student?.role === "admin" && (
              <>
                <ListItem button component={Link} to="/students" aria-label="Students">
                  <ListItemText primary="Students" />
                </ListItem>
                <ListItem button component={Link} to="/exams" aria-label="Exams">
                  <ListItemText primary="Exams" />
                </ListItem>
                <ListItem button component={Link} to="/question-bank" aria-label="Question Bank">
                  <ListItemText primary="Question Bank" />
                </ListItem>
              </>
            )}
            {user?.student?.role === "student" && (
              <>
                <ListItem button component={Link} to="/exams" aria-label="Available Exams">
                  <ListItemText primary="Available Exams" />
                </ListItem>
                <ListItem button component={Link} to="/exam-list" aria-label="My Exams">
                  <ListItemText primary="My Exams" />
                </ListItem>
              </>
            )}
            <ListItem button component={Link} to="/dashboard" aria-label="Dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout} aria-label="Logout">
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" aria-label="Login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register" aria-label="Register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
      <AppBar position="static" color="primary" role="navigation">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            aria-label="Exam Management Home"
          >
            Exam Management
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {user ? (
              <>
                {user?.student?.role === "admin" && (
                  <>
                    <Button color="inherit" component={Link} to="/students" aria-label="Students">
                      Students
                    </Button>
                    <Button color="inherit" component={Link} to="/exams" aria-label="Exams">
                      Exams
                    </Button>
                    <Button color="inherit" component={Link} to="/question-bank" aria-label="Question Bank">
                      Question Bank
                    </Button>
                  </>
                )}
                {user?.student?.role === "student" && (
                  <>
                    <Button color="inherit" component={Link} to="/exams" aria-label="Available Exams">
                      Available Exams
                    </Button>
                    <Button color="inherit" component={Link} to="/exam-list" aria-label="My Exams">
                      My Exams
                    </Button>
                  </>
                )}
                <Button color="warning" component={Link} to="/dashboard" aria-label="Dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout} aria-label="Logout">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="warning" component={Link} to="/login" aria-label="Login">
                  Login
                </Button>
                <Button color="warning" component={Link} to="/register" aria-label="Register">
                  Register
                </Button>
              </>
            )}
          </Box>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }}
        aria-label="Mobile navigation menu"
      >
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default NavbarComponent;