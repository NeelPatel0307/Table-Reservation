import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Reviews from "./Reviews";
import TopResturants from "./TopResturants";
import TopOrders from "./TopOrders";
import TopPeriod from "./TopPeriod";
import TopCustomer from "./TopCustomer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/topresturants" element={<TopResturants />} />
      <Route path="/toporders" element={<TopOrders />} />
      <Route path="/topperiod" element={<TopPeriod />} />
      <Route path="/topcustomers" element={<TopCustomer />} />
      <Route path="/reviews" element={<Reviews />} />
    </Routes>
  );
}
export default App;
