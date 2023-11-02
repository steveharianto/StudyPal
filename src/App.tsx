import { createContext, useState, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Error from "./pages/Error";
import Home from "./pages/Home";
import Header from "./components/Header";

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
    return (
        <MyContext.Provider value={{ value1, updateValue1, value2, updateValue2 }}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} /> */}
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
        </MyContext.Provider>
    );
}

export default App;
