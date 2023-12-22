import React from "react";
import Spinner from "react-bootstrap/Spinner";

const CustomSpinner = () => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default CustomSpinner;
