import React from "react";

const TopCustomer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <h1>The top 10 customers who have ordered the most</h1>
      <iframe 
      width="600" 
      height="450" 
      src="https://lookerstudio.google.com/embed/reporting/1fee8bea-ec17-4b6c-8def-76907d210cb8/page/UQ5jD" frameborder="0" allowfullscreen></iframe>
    </div>
  );
};

export default TopCustomer;
