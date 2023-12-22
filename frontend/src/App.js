import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import CustomNavbar from "./components/Common/StaticComponents/Navbar";
import UnprotectedRoutes from "./Routes/Unprotected";
import ProtectedRoutes from "./Routes/Protected";
// import ForgotPassword from "./components/ForgotPassword";
// import UpdateProfile from "./components/User/UpdateProfile";
// import ListOfRestaurants from "./components/User/ListOfRestaurants";
// import AddTable from "./components/User/AddTable.js";
// import AddAvability from "./components/User/AddAvability.js";

function App() {
  console.log(ProtectedRoutes, "PR");
  return (
    <>
      <Router>
        <AuthProvider>
          <CustomNavbar />
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              {ProtectedRoutes.map((routes, key) => (
                <Route {...routes} key={key} />
              ))}
            </Route>

            {UnprotectedRoutes.map((routes, key) => (
              <Route {...routes} key={key} />
            ))}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
