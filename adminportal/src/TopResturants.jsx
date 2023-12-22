import React from "react";

const TopResturants = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <h3>Top 10 Resturants</h3>
      <iframe
        width="800"
        height="900"
        src="https://lookerstudio.google.com/embed/reporting/43ad8f8d-320b-4300-84e6-8c5b06f391b6/page/YG5jD"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  );
};

export default TopResturants;
