import { Container, Navbar } from "react-bootstrap";
import useAuthStore from "../store/authStore";

const Footer = () => {
  const { user } = useAuthStore();

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom" className="py-2">
      <Container>
        <Navbar.Text className="text-white">
          &copy; {new Date().getFullYear()} Exam Management System
          {user && ` | Logged in as: ${user.student.name} (${user.student.role})`}
        </Navbar.Text>
        <Navbar.Text className="text-white">
          <a href="/about" className="text-white me-3">About</a>
          <a href="/contact" className="text-white">Contact</a>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;