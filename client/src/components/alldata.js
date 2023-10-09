import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../usercontext";
import Card from "./card";

function AllData() {
    const { currentUser, authenticated } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    /* console.log(authenticated);
    const currentRole = currentUser.role;
    console.log(currentRole); */

    useEffect(() => {
        console.log("fetching all transactions");
        const fetchTransactions = async () => {
            try {
                const response = await fetch("/transaction/all");
                if (!response.ok) {
                    throw new Error("A network error occurred");
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        console.log("fetching all users");
        const fetchUsers = async () => {
            try {
                const response = await fetch("/user/all");
                if (!response.ok) {
                    throw new Error("A network error occurred");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    const renderAllUsers = () => {
        let filteredUsers = [];
        if (currentUser.role === "Admin") {
            filteredUsers = users;
        } else if (currentUser.role === "User") {
            filteredUsers = users.filter(
                (user) => user.email === currentUser.email
            );
        }

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Acct Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Acct Since</th>
                        <th scope="col">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.accountNumber}>
                            <td>{user.accountNumber}</td>
                            <td>{user.firstName + " " + user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                                {user.balance.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderAllTransactions = () => {
        let filteredTransactions = [];
        if (currentUser.role === "Admin") {
            // If user is Admin, show all transactions
            filteredTransactions = transactions;
        } else if (currentUser.role === "User") {
            // If user is User, filter transactions related to their account
            filteredTransactions = transactions.filter(
                (transaction) =>
                    transaction.accountNumber === currentUser.accountNumber
            );
        }
        return (
            <>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Acct Number</th>
                            <th scope="col">Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">New Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction) => (
                            <tr>
                                <td>{transaction.accountNumber}</td>
                                <td>{transaction.type}</td>
                                <td>
                                    {transaction.amount.toLocaleString(
                                        "en-US",
                                        {
                                            style: "currency",
                                            currency: "USD",
                                        }
                                    )}
                                </td>
                                <td>
                                    {new Date(
                                        transaction.timestamp
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    {new Date(
                                        transaction.timestamp
                                    ).toLocaleTimeString([], {
                                        hour12: true,
                                    })}
                                </td>
                                <td>
                                    {transaction.newBalance.toLocaleString(
                                        "en-US",
                                        {
                                            style: "currency",
                                            currency: "USD",
                                        }
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <div className="container">
            {authenticated ? (
                <>
                    <Card header="USERS" body={renderAllUsers()} />
                    <Card
                        header="TRANSACTIONS"
                        body={renderAllTransactions()}
                    />
                </>
            ) : (
                <Card header="Log in to see app data" />
            )}
        </div>
    );
}

export default AllData;
