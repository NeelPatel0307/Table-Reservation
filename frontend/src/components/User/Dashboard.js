import React, { useState } from "react";
import { Alert, Card, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  var myState = { table_reservation_id: 2 };

  return (
    <>
      {/* <CustomNavbar></CustomNavbar> */}
      {/* <Link
        to={{
          pathname: "/food-menu/Downtown Halifax/R1/6",
          state: myState,
        }}
      >
        Food Menu
      </Link> */}
      <br/>
      <Link
        to={{
          pathname: "/book-restaurant/R1",
          state: myState,
        }}
      >
        Book Restaurant
      </Link>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
