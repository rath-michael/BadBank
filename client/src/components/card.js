import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../usercontext";

function Card(props) {
    /* const ctx = useContext(UserContext);
    const { authenticated } = ctx; */
    const { authenticated, setCurrentUser, setAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <div
            className="card mt-4 mb-3 d-flex m-auto"
            style={{ width: props.width, maxWidth: "70%" }}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5 className="mb-3">{props.header}</h5>
                    {props.auth && (
                        <>
                            {authenticated && (
                                <button
                                    type="submit"
                                    className="btn btn-sm bg-danger"
                                    style={{ color: "white" }}
                                    onClick={() => {
                                        navigate("/login");
                                        setAuthenticated(false);
                                        setCurrentUser(null);
                                    }}>
                                    Logout
                                </button>
                            )}
                        </>
                    )}
                </div>
                {props.title && <h5 className="card-title">{props.title}</h5>}
                {props.text && <p className="card-text">{props.text}</p>}
                {props.body}
            </div>
        </div>
    );
}

export default Card;
