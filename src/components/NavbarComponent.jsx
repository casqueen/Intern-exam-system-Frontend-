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
//             <ListItem button component={Link} to="/students">
//               <ListItemText primary="Students" />
//             </ListItem>
//             <ListItem button component={Link} to="/exams">
//               <ListItemText primary="Exams" />
//             </ListItem>
//             <ListItem button component={Link} to="/questions">
//               <ListItemText primary="Questions" />
//             </ListItem>
//             <ListItem button component={Link} to="/dashboard">
//               <ListItemText primary="Dashboard" />
//             </ListItem>
//             <ListItem button onClick={handleLogout}>
//               <ListItemText primary="Logout" />
//             </ListItem>
//           </>
//         ) : (
//           <>
//             <ListItem button component={Link} to="/exams">
//               <ListItemText primary="Take Exams" />
//             </ListItem>
//             <ListItem button component={Link} to="/my-exams">
//               <ListItemText primary="My Results" />
//             </ListItem>
//             <ListItem button component={Link} to="/login">
//               <ListItemText primary="Admin Login" />
//             </ListItem>
//             <ListItem button component={Link} to="/register">
//               <ListItemText primary="Admin Register" />
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
//                 <Button color="inherit" component={Link} to="/students">Students</Button>
//                 <Button color="inherit" component={Link} to="/exams">Exams</Button>
//                 <Button color="inherit" component={Link} to="/questions">Questions</Button>
//                 <Button color="warning" component={Link} to="/dashboard">Dashboard</Button>
//                 <Button color="inherit" onClick={handleLogout}>Logout</Button>
//               </>
//             ) : (
//               <>
//                 <Button color="inherit" component={Link} to="/exams">Take Exams</Button>
//                 <Button color="inherit" component={Link} to="/my-exams">My Results</Button>
//                 <Button color="warning" component={Link} to="/login">Admin Login</Button>
//                 <Button color="warning" component={Link} to="/register">Admin Register</Button>
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
            <ListItem button component={Link} to="/students">
              <ListItemText primary="Students" />
            </ListItem>
            <ListItem button component={Link} to="/exams">
              <ListItemText primary="Exams" />
            </ListItem>
            <ListItem button component={Link} to="/questions">
              <ListItemText primary="Questions" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/testing-room">
              <ListItemText primary="Start Test" />
            </ListItem>
            <ListItem button component={Link} to="/my-exams">
              <ListItemText primary="My Results" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Admin Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Admin Register" />
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
                <Button color="inherit" component={Link} to="/students">Students</Button>
                <Button color="inherit" component={Link} to="/exams">Exams</Button>
                <Button color="inherit" component={Link} to="/questions">Questions</Button>
                <Button color="warning" component={Link} to="/dashboard">Dashboard</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                {/* <Button color="inherit" component={Link} to="/testing-room">Start Test</Button>
                <Button color="inherit" component={Link} to="/my-exams">My Results</Button> */}
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