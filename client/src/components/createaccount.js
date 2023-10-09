import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../usercontext";
import { auth } from "../firebaseconfig";
import Card from "./card";

function CreateAccount() {
    const { setCurrentUser, setAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    const NewUserSchema = Yup.object().shape({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
            .min(6, "Must be at least 6 characters")
            .required("Required"),
    });

    async function generateAcctNumber() {
        try {
            const response = await axios.get("/user/count");
            const userCount = response.data;

            let hashedValue = userCount + 1;
            hashedValue = ((hashedValue >> 16) ^ hashedValue) * 0x45d9f3b;
            hashedValue = ((hashedValue >> 16) ^ hashedValue) * 0x45d9f3b;
            hashedValue = (hashedValue >> 16) ^ hashedValue;

            return hashedValue % 999999999;
        } catch (error) {
            console.error("Error fetching user count:", error);
            return 0;
        }
    }

    async function createFirebaseUser(values) {
        try {
            const firebaseCredential =
                await auth.createUserWithEmailAndPassword(
                    values.email,
                    values.password
                );
            console.log("firebase success, firebase user created");
            return firebaseCredential;
        } catch (error) {
            console.log("firebase error, firebase user not created");
            return null;
        }
    }

    async function createMongoUser(values, userCredential) {
        let accountNumber = await generateAcctNumber();

        const newUser = {
            accountNumber: accountNumber,
            firstName: values.firstName,
            lastName: values.lastName,
            role: "User",
            email: values.email,
            password: values.password,
            balance: 0,
            createdAt: new Date(),
        };

        try {
            const mongoCredentials = await axios.post("/user/add", newUser);
            console.log("mongo success, mongo user created");
            return mongoCredentials;
        } catch (error) {
            console.log("mongo fail, firebase user rollback");
            await userCredential.user.delete();
            return null;
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
            <>
                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                    }}
                    validationSchema={NewUserSchema}
                    onSubmit={async (values, { setErrors }) => {
                        // create firebase user
                        const firebaseCredentials = await createFirebaseUser(
                            values
                        );

                        // if firebase success, create mongo user
                        if (firebaseCredentials != null) {
                            // create mongo user
                            const mongoCredentials = await createMongoUser(
                                values,
                                firebaseCredentials
                            );

                            if (mongoCredentials != null) {
                                const profile = await getUserProfile(values);

                                if (profile) {
                                    alert("New account successfully created.");
                                    setCurrentUser(profile);
                                    setAuthenticated(true);
                                    navigate("/account");
                                } else {
                                    setErrors({
                                        create: "A firebase error occurred",
                                    });
                                }
                            }
                        }
                        // firebase error, dont create mongo user and set error
                        else {
                            setErrors({ create: "A firebase error occurred" });
                        }
                    }}>
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-floating mb-3">
                                {formik.errors.create ? (
                                    <div className="text-danger">
                                        {formik.errors.create}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-floating mb-3">
                                <Field
                                    type="text"
                                    className={`form-control ${
                                        formik.touched.firstName &&
                                        formik.errors.firstName
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="firstName"
                                    name="firstName"
                                    placeholder="First Name"
                                />
                                <label className="form-label-text">
                                    First Name
                                </label>
                                {formik.touched.firstName &&
                                    formik.errors.firstName && (
                                        <div className="formik-feedback">
                                            {formik.errors.firstName}
                                        </div>
                                    )}
                            </div>
                            <div className="form-floating mb-3">
                                <Field
                                    type="text"
                                    className={`form-control ${
                                        formik.touched.lastName &&
                                        formik.errors.lastName
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Last Name"
                                />
                                <label className="form-label-text">
                                    Last Name
                                </label>
                                {formik.touched.lastName &&
                                    formik.errors.lastName && (
                                        <div className="formik-feedback">
                                            {formik.errors.lastName}
                                        </div>
                                    )}
                            </div>
                            <div className="form-floating mb-3">
                                <Field
                                    type="email"
                                    className={`form-control ${
                                        formik.touched.email &&
                                        formik.errors.email
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                />
                                <label className="form-label-text">Email</label>
                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <div className="formik-feedback">
                                            {formik.errors.email}
                                        </div>
                                    )}
                            </div>
                            <div className="form-floating mb-3">
                                <Field
                                    type="password"
                                    className={`form-control ${
                                        formik.touched.password &&
                                        formik.errors.password
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <label className="form-label-text">
                                    Password
                                </label>
                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <div className="formik-feedback">
                                            {formik.errors.password}
                                        </div>
                                    )}
                                {formik.touched.password &&
                                    formik.errors.passwordLength && (
                                        <div className="formik-feedback">
                                            {formik.errors.passwordLength}
                                        </div>
                                    )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-success form-control">
                                Sign Up
                            </button>
                        </form>
                    )}
                </Formik>
            </>
        );
    }

    return (
        <>
            <Card 
                header="CREATE ACCOUNT"
                width="500px"
                body={renderForm()}
                />
        </>
    );
}
export default CreateAccount;