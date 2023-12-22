import ForgotPassword from "../components/ForgotPassword";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default [
  { path: "/signup", element: <Signup /> },
  { path: "/resturant/login", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
];
