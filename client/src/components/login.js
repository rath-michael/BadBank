import React, { useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { UserContext } from "../usercontext";
import { auth } from "../firebaseconfig";
import Card from "./card";

function Login() {
    const navigate = useNavigate();
    const { setCurrentUser, setAuthenticated } = useContext(UserContext);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
            .min(6, "Must be at least 6 characters")
            .required("Required"),
    });

    async function verifyFirebase(values) {
        try {
            await auth.signInWithEmailAndPassword(
                values.email,
                values.password
            );
            console.log("Logged in as: " + values.email);
            return true;
        } catch (error) {
            console.log("Login error: " + error);
            return false;
        }
    }

    async function getUserProfile(values) {
        try {
            const res = await axios.get(`/user/find/${values.email}`);
            const profile = res.data;
            console.log("mongoDb:getUser success: " + profile.email);
            return profile;
        } catch (error) {
            console.log("mongoDb:getUser error: " + error);
            return null;
        }
    }

    function renderForm() {
        return (
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, { setErrors }) => {
                    // Verify email/password with firebase
                    const loginAttempt = await verifyFirebase(values);

                    // If firebase success
                    if (loginAttempt) {
                        // Get user profile from mongoDB
                        const profile = await getUserProfile(values);

                        // If profile found
                        if (profile) {
                            setCurrentUser(profile);
                            setAuthenticated(true);
                            navigate("/account");
                        }
                        // Eles, profile error
                        else {
                            setErrors({
                                login: "A login error occurred.",
                            });
                        }
                    }
                    // Else, firebase error
                    else {
                        setErrors({ login: "Incorrect email or password" });
                    }
                }}>
                {({ errors }) => (
                    <Form>
                        <div className="form-floating mb-3">
                            {errors.login ? (
                                <div className="text-danger">
                                    {errors.login}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-floating mb-3">
                            <Field
                                type="text"
                                for="email"
                                name="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Email"
                            />
                            <label className="form-label-text">Email</label>
                            {errors.email ? (
                                <div className="text-danger">
                                    {errors.email}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-floating mb-3">
                            <Field
                                type="password"
                                for="password"
                                name="password"
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                placeholder="Password"
                            />
                            <label className="form-label-text">Password</label>
                            {errors.password ? (
                                <div className="text-danger">
                                    {errors.password}
                                </div>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success form-control">
                            Log In
                        </button>
                        <span className="form-floating mb-3">
                            Not a member?&nbsp;
                            <Link to="/createaccount">Create an account</Link>
                        </span>
                    </Form>
                )}
            </Formik>
        );
    }
    return <Card header="ACCOUNT LOGIN" width="500px" body={renderForm()} />;
}
export default Login;
