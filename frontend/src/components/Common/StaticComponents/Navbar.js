import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";

function CustomNavbar() {
  const { currentUser, logout } = useAuth();

  console.log(currentUser);
  const { pathname } = useLocation();
  const navigation = useNavigate();
  const isResturant = pathname.includes("resturant");

  const handleLogout = () => {
    window.sessionStorage.clear();
    logout();
    window.location.href = isResturant ? "/resturant/login" : "/login";
  };

  const toggleLogin = () => {
    if (isResturant) {
      navigation("/login");
    } else navigation("/resturant/login");
  };
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand style={{ fontSize: "150%" }}>Reservify</Navbar.Brand>
        <Nav>
          {currentUser && (
            <>
              {!isResturant && (
                <Nav.Link href="/" style={{ float: "right" }}>
                  <Button
                    variant="light"
                    className="rounded-pill px-4 me-4"
                    size="sm"
                  >
                    Orders
                  </Button>
                </Nav.Link>
              )}
              <Nav.Item className="d-flex align-items-center justify-content-center m-2">
                <div className="text-light ">{currentUser?.email}</div>
              </Nav.Item>

              <div className="d-flex align-items-center">
                <Button
                  variant="light"
                  className="rounded-pill px-4"
                  size="sm"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
          {!currentUser && (
            <div className="d-flex align-items-center">
              <Button
                variant="light"
                className="rounded-pill px-4"
                size="sm"
                onClick={() => toggleLogin()}
              >
                {isResturant ? "User Login" : "Resturant Login"}
              </Button>
            </div>
          )}
        </Nav>{" "}
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
