import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./pages/Error";
import Home from "./pages/Home";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTutor from "./pages/RegisterTutor";
import Login from "./pages/Login";
import FindTutor from "./pages/FindTutor";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardTutor from "./pages/DashboardTutor";

const router = createBrowserRouter([
    {
      path: "/", 
      element: <Home />,
      errorElement: <Error/>,
    },
    {
      path: "/login", 
      element: <Login />,
      errorElement: <Error/>,
    },
    {
      path: "/register-student", 
      element: <RegisterStudent />,
      errorElement: <Error/>,
    },
    {
      path: "/register-tutor", 
      element: <RegisterTutor />,
      errorElement: <Error/>,
    },
    {
      path: "/find-tutor", 
      element: <FindTutor />,
      errorElement: <Error/>,
    },
    {
      path: "/dashboard-student", 
      element: <DashboardStudent />,
      errorElement: <Error/>,
    },
    {
      path: "/dashboard-tutor", 
      element: <DashboardTutor />,
      errorElement: <Error/>,
    },
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
