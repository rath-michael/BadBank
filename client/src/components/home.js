import { Link } from "react-router-dom";
import Card from "./card";
import BankIcon from "../bank.png";

function Home() {
    return (
        <Card
            header="HOME"
            width="750px"
            title="Welcome to my MIT Bad Bank"
            body={
                <div className="row">
                    <div className="col d-flex mt-auto">
                        <Link
                            to="/createaccount"
                            className="btn btn-lg btn-outline-info rounded-pill mx-auto mb-3">
                            Sign Up
                        </Link>
                        <Link
                            to="/alldata"
                            className="btn btn-lg btn-outline-info rounded-pill mx-auto mb-3">
                            View Data
                        </Link>
                    </div>
                    <div className="col text-center">
                        <img
                            src={BankIcon}
                            width="250px"
                            className="img-fluid"
                            alt="Homepage Image"
                        />
                    </div>
                </div>
            }
        />
    );
}

export default Home;
