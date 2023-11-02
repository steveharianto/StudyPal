import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Error from "./pages/Error";
function App() {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                {/* <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} /> */}
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    );
}

export default App;
