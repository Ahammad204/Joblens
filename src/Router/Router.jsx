import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Main/MainLayout";
import Home from "../Pages/Home/Home/Home";
import Login from "../componet/Shared/Login/login";
import Register from "../componet/Shared/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import PrivateRoute from "./privateRoute";
import DashboardDetails from "../Pages/Dashboard/DashboardDetails/DashboardDetails";
import UserProfile from "../Pages/Dashboard/UserProfile/UserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children:[
      {
        path:"/",
        element:<Home></Home>
      }
    ]
  },
    {
      path:"/login",
      element: <Login></Login>
    }
  ,
    {
      path:"/register",
      element: <Register></Register>
    }
  ,
    {
      path:"/dashboard",
      element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
      children:[
        {
          path:"/dashboard",
          element:<PrivateRoute><DashboardDetails></DashboardDetails></PrivateRoute>
        },{
          path:"/dashboard/userprofile",
          element:<PrivateRoute><UserProfile></UserProfile></PrivateRoute>
        }
      ]
    }
]);
 