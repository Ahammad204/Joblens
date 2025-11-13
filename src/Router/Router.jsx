import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Main/MainLayout";
import Home from "../Pages/Home/Home/Home";
import Login from "../componet/Shared/Login/login";
import Register from "../componet/Shared/Register/Register";

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
]);
 