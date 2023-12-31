import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import Error from "./pages/Error";
import Home from "./pages/Home";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTutor from "./pages/RegisterTutor";
import Login from "./pages/Login";
import FindTutor from "./pages/FindTutor";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardTutor from "./pages/DashboardTutor";
import DashboardStudentMyLessons from "./pages/DashboardStudentMyLessons";
import DashboardStudentMessages from "./pages/DashboardStudentsMessages";
import DashboardStudentHome from "./pages/DashboardStudentHome";
import DashboardStudentProfile from "./pages/DashboardStudentProfile";
import DashboardTutorHome from "./pages/DashboardTutorHome";
import DashboardTutorMessages from "./pages/DashboardTutorMessages";
import DashboardTutorMyLessons from "./pages/DashboardTutorMyLessons";
import DashboardTutorProfile from "./pages/DashboardTutorProfile";
import UserProfile from "./pages/UserProfile";
import { BalanceProvider } from "./BalanceContext";
import DashboardAdmin from "./pages/DashboardAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register-student",
    element: <RegisterStudent />,
    errorElement: <Error />,
  },
  {
    path: "/register-tutor",
    element: <RegisterTutor />,
    errorElement: <Error />,
  },
  {
    path: "/find-tutor",
    element: <FindTutor />,
    errorElement: <Error />,
  },
  {
    path: "/dashboard-student",
    element: <DashboardStudent />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <DashboardStudentHome />,
      },
      {
        path: "messages",
        element: <DashboardStudentMessages />,
      },
      {
        path: "my-lessons",
        element: <DashboardStudentMyLessons />,
      },
      {
        path: "profile",
        element: <DashboardStudentProfile />,
      },
    ],
  },
  {
    path: "/dashboard-tutor",
    element: <DashboardTutor />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <DashboardTutorHome />,
      },
      {
        path: "messages",
        element: <DashboardTutorMessages />,
      },
      {
        path: "my-lessons",
        element: <DashboardTutorMyLessons />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/admin",
    element: <DashboardAdmin />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
