import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Error from "./pages/Error";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTutor from "./pages/RegisterTutor";
import FindTutor from "./pages/FindTutor";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardTutor from "./pages/DashboardTutor";

function App() {
    // States
    const [userType, setUserType] = useState("");

    // User Type

    const renderDashboard = () => {
        switch (userType) {
            case "Tutor":
                return <DashboardTutor />;
            case "Student":
                return <DashboardStudent />;
            default:
                return <Navigate to="/login" />; // Redirect to login if userType is not set
        }
    };
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/register-tutor" element={<RegisterTutor />} />
                <Route path="/find-tutor" element={<FindTutor />} />
                <Route path="/dashboard" element={renderDashboard()} />
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
}

export default App;
