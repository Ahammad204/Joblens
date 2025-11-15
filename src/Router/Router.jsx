import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Main/MainLayout";

import Login from "../componet/Shared/Login/login";
import Register from "../componet/Shared/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard/Dashboard";
import PrivateRoute from "./privateRoute";
import DashboardDetails from "../Pages/Dashboard/DashboardDetails/DashboardDetails";
import UserProfile from "../Pages/Dashboard/UserProfile/UserProfile";
import AllJobs from "../Pages/AllJobs/AllJobs";
import AllJobsDetails from "../Pages/AllJobsDetails/AllJobsDetails";
import AllResources from "../Pages/AllResources/AllResources";
import Home from "../Pages/Home/Home/Home";
import CVAutoAnalysis from "../Pages/Dashboard/ProfileAnysis/CVAutoAnalysis";
import Roadmap from "../Pages/Dashboard/Roadmap/Roadmap";
import Chatbot from "../componet/chatbot/Chatbot";
import ManageJobs from "../Pages/Dashboard/ManageJobs/ManageJobs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/allJobs",
        element: (
          <PrivateRoute>
            <AllJobs></AllJobs>
          </PrivateRoute>
        ),
      },
      {
        path: "/jobs/:id",
        element: (
          <PrivateRoute>
            <AllJobsDetails></AllJobsDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/allResources",
        element: (
          <PrivateRoute>
            <AllResources></AllResources>
          </PrivateRoute>
        ),
      },{
        path:"/chat",
        element:<Chatbot></Chatbot>
      }
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardDetails></DashboardDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/userprofile",
        element: (
          <PrivateRoute>
            <UserProfile></UserProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: <CVAutoAnalysis />,
      },{
        path:"/dashboard/roadmap",
        element: <Roadmap></Roadmap>
      },{
        path:"/dashboard/manageJobs",
        element: <PrivateRoute><ManageJobs></ManageJobs></PrivateRoute>
      }
    ],
  },
]);
