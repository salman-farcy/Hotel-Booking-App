import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import RoomDetails from "../components/Rooms/RoomDetails/RoomDetails";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Statistice from "../pages/Dashboard/Common/Statistice";
import AddRoom from "../pages/Dashboard/Host/AddRoom";
import MyListings from "../pages/Dashboard/Host/MyListings";
import Profile from "../pages/Dashboard/Common/Profile";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/room/:id", element: <PrivateRoute><RoomDetails /></PrivateRoute> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: '/dashboard', 
    element: <DashboardLayout />,
    children: [
      {
        // path: '/dashboard',
        index: true,
        element: <Statistice />
      },
      {
        path: 'add-room',
        element: <AddRoom />
      },
      {
        path: 'my-listings',
        element: <MyListings />
      },
      {
        path: '/dashboard/profile',
        element: <Profile />
      },
      {
        path: 'my-bookings',
        element: <p>My Bookings</p>
      },
      {
        path: 'manage-bookings',
        element: <p>Manage Bookings</p>
      },
      {
        path: 'manage-users',
        element: <ManageUsers />
      },
      
          
    ]
  }
]);
 