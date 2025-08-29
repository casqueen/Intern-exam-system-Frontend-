import { Container, Navbar } from "react-bootstrap";
import useAuthStore from "../store/authStore";

const Footer = () => {
  const { user } = useAuthStore();

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom" className="py-2">
      <Container>
        <Navbar.Text className="text-white">
          &copy; {new Date().getFullYear()} Built by <a href="https://mail.google.com/mail/u/0/#inbox" className="text-success mx-1 text-decoration-none">@magi</a>  
          {user && ` | Logged in as: ${user?.student?.name} (${user?.student?.role})`}
        </Navbar.Text>
        <Navbar.Text className="text-white">
          <a href="/about" className="text-primary me-3 text-decoration-none">About</a>
          <a href="/contact" className="text-primary text-decoration-none">Contact</a>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;