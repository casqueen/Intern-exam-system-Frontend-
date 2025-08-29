import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const NavbarComponent = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Exam Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                {user?.student?.role === "admin" && (
                  <>
                    <Nav.Link as={Link} to="/students">Students</Nav.Link>
                    <Nav.Link as={Link} to="/exams">Exams</Nav.Link>
                  </>
                )}
                {user?.student?.role === "student" && (
                  <>
                    <Nav.Link as={Link} to="/exams">Available Exams</Nav.Link>
                    <Nav.Link as={Link} to="/exam-list">My Exams</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/dashboard" className="text-warning">Dashboard</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-warning">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-warning">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
