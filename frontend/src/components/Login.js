import React, { useRef, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isResturant = pathname.includes("resturant");
  window.localStorage.setItem("isResturant", isResturant);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const userCredential = await login(emailRef.current.value, passwordRef.current.value);
      const userId = userCredential.user.uid;
      sessionStorage.setItem('userId', userId);
      navigate("/listOfRestaurant");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/listOfRestaurant");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">
                {isResturant ? "Resturant Login" : "Log In"}
              </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {search.split("?")[1] == "notResturantOwner" && (
                <Alert variant="danger">User is not resturant admin.</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    required
                  ></Form.Control>
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100 text-center mt-2"
                  disabled={loading}
                >
                  Log In
                </Button>
              </Form>
              <Button
                onClick={handleGoogleSignIn}
                type="submit"
                className="w-100 text-center mt-2"
                disabled={loading}
              >
                Sign In with Google
              </Button>
              <div className="w-100 text-center mt-2">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </Card.Body>
          </Card>
          {!isResturant && (
            <div className="w-100 text-center mt-2">
              Need have an account? <Link to="/signup">Sign Up</Link>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
