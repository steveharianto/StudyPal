import { createContext, useState, Dispatch, SetStateAction } from "react";
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

interface MyContextType {
    value1: string;
    updateValue1: Dispatch<SetStateAction<string>>;
    value2: string;
    updateValue2: Dispatch<SetStateAction<string>>;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

function App() {
    // Context
    const [value1, setValue1] = useState("Initial Value 1");
    const [value2, setValue2] = useState("Initial Value 2");
    const updateValue1: MyContextType["updateValue1"] = (newValue) => {
        setValue1(newValue);
    };
    const updateValue2: MyContextType["updateValue2"] = (newValue) => {
        setValue2(newValue);
    };

    // States
    const [userType, setUserType] = useState("");

    // User Type

    const renderDashboard = () => {
        switch (userType) {
          case 'Tutor':
            return <DashboardTutor />;
          case 'Student':
            return <DashboardStudent />;
          default:
            return <Navigate to="/login" />; // Redirect to login if userType is not set
        }
      };
    return (
        <MyContext.Provider value={{ value1, updateValue1, value2, updateValue2 }}>
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
        </MyContext.Provider>
    );
}

export default App;
