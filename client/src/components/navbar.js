import React, { useContext } from "react";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";

function Navbar() {
    const { currentUser, authenticated } = useContext(UserContext);

    return (
        <nav className="navbar navbar-expand-lg" role="navigation">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    BadBank
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav d-flex flex-row-reverse w-100">
                        <li className="nav-item">
                            <Link to="/alldata" className="nav-link">
                                All Data
                            </Link>
                        </li>
                        <li className="nav-item">
                            {authenticated ? (
                                <Link to="/account" className="nav-link">
                                    {currentUser.email}
                                </Link>
                            ) : (
                                <Link to="/login" className="nav-link">
                                    Account
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
