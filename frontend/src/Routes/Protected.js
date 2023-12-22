import Dashboard from "../components/User/Dashboard";
import FoodMenuComponent from "../components/User/Food-menu/FoodMenuComponent";
import RestaurantBooking from "../components/User/RestaurantBooking";
import ListOfRestaurants from "../components/User/ListOfRestaurants";
import UpdateProfile from "../components/User/UpdateProfile";
import ResturantDashboard from "../components/Resturant/Dashboard";

import ReservationPage from "../components/Reservation/ReservationPage";
import ShowReservations from "../components/Reservation/ShowReservations";
import ReviewFoodOrderComponent from "../components/Orders/ReviewFoodOrder";
import Test from "../components/Resturant/Test";
import AddTable from "../components/Resturant/AddTable";
import AddAvability from "../components/Resturant/AddAvability";
import ListMenuComponent from "../components/Resturant/ListMenuComponent";
import HolisticView from "../components/Resturant/HolisticView";

const buildResturantRoutes = (path) => {
  return `/resturant${path}`;
};

const UserAppRoutes = [
  { path: "/", element: <Dashboard /> },
  { path: "/listOfRestaurant", element: <ListOfRestaurants /> },
  { path: "/update-profile", element: <UpdateProfile /> },
  {
    path: "/food-menu/:restaurant_id",
    element: <FoodMenuComponent />,
  },
  {
    path: "/book-restaurant/:restaurant_id",
    //element: <RestaurantBooking />,
    element: <ReservationPage />,
  },
  {
    path: "/editReservation/:reservation_id",
    element: <RestaurantBooking />,
  },
  { path: "/ShowReservations", element: <ShowReservations /> },
  { path: "/addtabledetails", element: <AddTable /> },
  { path: "/addtimingdetails", element: <AddAvability /> },
  { path: "/review-food-order", element: <ReviewFoodOrderComponent /> },
];

const ResturantAppRoutes = [
  { path: buildResturantRoutes("/"), element: <ResturantDashboard /> },
  { path: buildResturantRoutes("/addtabledetails"), element: <AddTable /> },
  { path: buildResturantRoutes("/addtimingdetails"), element: <AddAvability /> },
  { path: buildResturantRoutes("/list-menu"), element: <ListMenuComponent /> },
  { path: buildResturantRoutes("/test"), element: <Test /> },
  { path: buildResturantRoutes("/holisticview"), element: <HolisticView /> },
  { path: buildResturantRoutes("/editReservation/:reservation_id"),element: <RestaurantBooking />},
];

const ProtectedRoute = [...UserAppRoutes, ...ResturantAppRoutes];

export default ProtectedRoute;
