import React from "react";
import { useNavigate } from "react-router-dom";

const links = [
  { name: "Top 10 Resturants with most Orders", link: "/topresturants" },
  { name: "Top 10 Food items across resturants", link: "/toporders" },
  { name: "Top 10 time period ", link: "/topperiod" },
  { name: "Top 10 Customers", link: "/topcustomers" },
  { name: "Reviews", link: "/reviews" },
];

const Home = () => {
  const navigate = useNavigate();
  const handleClick = (link) => {
    navigate(link);
  };
  return (
    <div
      style={{
        margin: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Admin Portal </h1>
      <div style={{ width: "400px" }}>
        {links.map((d, i) => (
          <button
            class="btn btn-primary"
            style={{ margin: "10px", width: "100%" }}
            key={i}
            onClick={() => handleClick(d.link)}
          >
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
