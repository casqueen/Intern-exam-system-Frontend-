import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-primary text-center mb-4">🎉 Welcome, {user?.student?.name}!</h2>
        {user?.student?.role === "admin" ? (
          <>
            <h3 className="text-center mb-4">Admin Dashboard</h3>
            <Row className="text-center">
              <Col md={6} className="mb-3">
                <Button as={Link} to="/students" variant="primary" size="lg" className="w-100">
                  📋 Manage Students
                </Button>
              </Col>
              <Col md={6} className="mb-3">
                <Button as={Link} to="/exams" variant="primary" size="lg" className="w-100">
                  📝 Manage Exams
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <h3 className="text-center mb-4">Student Dashboard</h3>
            <Row className="text-center">
              <Col md={6} className="mb-3">
                <Button as={Link} to="/exams" variant="primary" size="lg" className="w-100">
                  🎯 Take Exams
                </Button>
              </Col>
              <Col md={6} className="mb-3">
                <Button as={Link} to="/exam-list" variant="primary" size="lg" className="w-100">
                  📊 View My Results
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Dashboard;