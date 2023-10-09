import React, { useContext, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { UserContext } from "../usercontext";
import Card from "./card";
import "../keypad.css";

function Account() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [depositError, setDepositError] = useState();
    const denominations = [1, 5, 10, 20, 50, 100];

    const UserSchema = Yup.object().shape({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
            .min(6, "Must be at least 6 characters")
            .required("Required"),
    });

    async function updateUserInfo(values, setErrors) {
        try {
            const response = await axios.put(
                `/user/update/${currentUser.email}`,
                values
            );
            if (response.status === 200) {
                setCurrentUser(response.data);
                alert("Profile update successful");
            }
        } catch (error) {
            console.error("User update error: " + error);
            setErrors({
                updater: "User info couldn't be updated at this time.",
            });
        }
    }

    function renderUserInfo() {
        return (
            <>
                <Formik
                    initialValues={{
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        email: currentUser.email,
                        password: currentUser.password,
                    }}
                    validationSchema={UserSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={async (values, { setErrors }) => {
                        // update data about current user
                        await updateUserInfo(values, setErrors);
                    }}>
                    {({ errors }) => (
                        <Form>
                            {/* First name */}
                            <div className="form-floating mb-3">
                                <Field
                                    type="text"
                                    for="firstName"
                                    name="firstName"
                                    className={`form-control ${
                                        errors.firstName ? "is-invalid" : ""
                                    }`}
                                    placeholder="First Name"
                                />
                                <label className="form-label-text">
                                    First Name
                                </label>
                                {errors.firstName ? (
                                    <div className="text-danger">
                                        {errors.firstName}
                                    </div>
                                ) : null}
                            </div>
                            {/* Last name */}
                            <div className="form-floating mb-3">
                                <Field
                                    type="text"
                                    for="lastName"
                                    name="lastName"
                                    className={`form-control ${
                                        errors.lastName ? "is-invalid" : ""
                                    }`}
                                    placeholder="Last Name"
                                />
                                <label className="form-label-text">
                                    Last Name
                                </label>
                                {errors.lastName ? (
                                    <div className="text-danger">
                                        {errors.lastName}
                                    </div>
                                ) : null}
                            </div>
                            {/* Email */}
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
                            {/* Password */}
                            <div className="form-floating mb-3">
                                <Field
                                    type="text"
                                    for="password"
                                    name="password"
                                    className={`form-control ${
                                        errors.password ? "is-invalid" : ""
                                    }`}
                                    placeholder="Password"
                                />
                                <label className="form-label-text">
                                    Password
                                </label>
                                {errors.password ? (
                                    <div className="text-danger">
                                        {errors.password}
                                    </div>
                                ) : null}
                            </div>
                            {errors.updater ? (
                                <div className="text-danger">
                                    {errors.updater}
                                </div>
                            ) : null}
                            <button
                                type="submit"
                                className="btn btn-success form-control">
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    async function deposit() {
        // Generate new transaction
        const newTransaction = {
            accountNumber: currentUser.accountNumber,
            type: "Deposit",
            amount: depositAmount,
            timestamp: new Date(),
            newBalance: currentUser.balance + depositAmount,
        };

        // Add new transaction to db, api call will also updated users balance
        const response = await axios.post("transaction/add", newTransaction);

        // If deposit success, update page
        if (response.status == 200) {
            setDepositAmount(0);
            currentUser.balance = newTransaction.newBalance;
        }
        // Else, display error to user
        else {
            setDepositError("An error occurred.");
        }
    }

    function depositForm() {
        const isDepositAmountValid = depositAmount > 0;

        return (
            <form>
                <div>
                    <p className="fs-6 text-secondary m-0 p-0">
                        Name:{" "}
                        {currentUser.firstName + " " + currentUser.lastName}
                    </p>
                    <p className="fs-6 text-secondary m-0 p-0">
                        Acct Number: {currentUser.accountNumber}
                    </p>
                    <p className=" fs-6 text-secondary m-0 p-0">
                        Acct Balance: <span className="text-emphasis"></span>
                        {currentUser.balance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </p>
                </div>
                <p className="fs-5 text-secondary text-center">
                    Choose sum (in USD)
                </p>
                <ul className="keypad-list">
                    {denominations.map((item) => {
                        return (
                            <li className="d-flex w-50 m-auto mb-1" key={item}>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-50 m-auto"
                                    onClick={() => {
                                        setDepositAmount(depositAmount + item);
                                    }}>
                                    ${item}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p className="fs-5 text-center">
                    Deposit amount:{" "}
                    {depositAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                </p>
                <div className="text-danger">{depositError}</div>
                <div className="d-flex w-100">
                    <button
                        type="button"
                        className="btn btn-success w-50 m-1"
                        onClick={deposit}
                        disabled={!isDepositAmountValid}>
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-success w-50 m-1"
                        onClick={() => setDepositAmount(0)}>
                        Reset
                    </button>
                </div>
            </form>
        );
    }

    function validateWithdraw(value) {
        let runningTotal = value + withdrawAmount;
        if (runningTotal <= currentUser.balance) {
            setWithdrawAmount(runningTotal);
        }
    }

    async function withdraw() {
        // Generate new transaction
        const newTransaction = {
            accountNumber: currentUser.accountNumber,
            type: "Withdraw",
            amount: withdrawAmount,
            timestamp: new Date(),
            newBalance: currentUser.balance - withdrawAmount,
        };

        // Add new transaction to db, api call will also updated users balance
        const response = await axios.post("transaction/add", newTransaction);

        // If deposit success, update page
        if (response.status == 200) {
            setCurrentUser((prevUser) => ({
                ...prevUser,
                balance: newTransaction.newBalance,
            }));
        }
        // Else, display error to user
        else {
            setDepositError("An error occurred.");
        }
    }

    function withdrawForm() {
        const isWithdrawAmountValid = withdrawAmount > 0;
        return (
            <form>
                <div>
                    <p className="fs-6 text-secondary m-0 p-0">
                        Name:{" "}
                        {currentUser.firstName + " " + currentUser.lastName}
                    </p>
                    <p className="fs-6 text-secondary m-0 p-0">
                        Acct Number: {currentUser.accountNumber}
                    </p>
                    <p className=" fs-6 text-secondary m-0 p-0">
                        Acct Balance: <span className="text-emphasis"></span>
                        {currentUser.balance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </p>
                </div>
                <p className="fs-5 text-secondary text-center">
                    Choose sum (in USD)
                </p>

                <ul className="keypad-list">
                    {denominations.map((item) => {
                        const disabled =
                            currentUser.balance < item ||
                            withdrawAmount + item > currentUser.balance;
                        return (
                            <li className="d-flex w-50 m-auto mb-1" key={item}>
                                <button
                                    type="button"
                                    className={`btn ${
                                        disabled
                                            ? "btn-outline-danger"
                                            : "btn-outline-secondary"
                                    } w-50 m-auto`}
                                    onClick={() => validateWithdraw(item)}
                                    disabled={disabled}>
                                    ${item}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p className="fs-5 text-center">
                    Withdraw amount:{" "}
                    {withdrawAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                </p>
                <div className="d-flex w-100">
                    <button
                        type="button"
                        className="btn btn-success w-50 m-1"
                        onClick={withdraw}
                        disabled={!isWithdrawAmountValid}>
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-success w-50 m-1"
                        onClick={() => setWithdrawAmount(0)}>
                        Reset
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="container">
            <Card
                header="EDIT ACCOUNT INFO"
                width="500px"
                auth={true}
                body={renderUserInfo()}
            />
            <Card header="DEPOSIT" width="500px" body={depositForm()} />
            <Card header="WITHDRAW" width="500px" body={withdrawForm()} />
        </div>
    );
}

export default Account;
