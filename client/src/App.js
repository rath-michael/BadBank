import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./usercontext";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Login from "./components/login";
import Account from "./components/account";
import CreateAccount from "./components/createaccount";
import AllData from "./components/alldata";
import Error from "./components/error";
import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    return (
        <Router>
            <UserContext.Provider
                value={{
                    currentUser: currentUser,
                    setCurrentUser: setCurrentUser,
                    authenticated: authenticated,
                    setAuthenticated: setAuthenticated
                }}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/createaccount" element={<CreateAccount />} />
                    <Route path="/alldata" element={<AllData />} />
                    <Route path="/error" element={<Error />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </UserContext.Provider>
        </Router>
    );
}
export default App;
