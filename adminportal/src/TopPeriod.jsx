import React from "react";

const TopPeriod = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <h1>The top 10 periods when the food is most ordered</h1>
      <iframe width="600" height="450" src="https://lookerstudio.google.com/embed/reporting/e48183bf-fcd7-418e-be62-f882cdb4d386/page/fS5jD" frameborder="0" allowfullscreen></iframe>
    </div>
  );
};

export default TopPeriod;
