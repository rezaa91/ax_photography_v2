import React, { Component } from "react";
import ReactDOM from "react-dom";
import Card from "./components/card";
import Modal from "../../global_components/modal";
import {parseNotifications} from './data/notificationData';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.getUser();

        this.state = {
            user: {
                user_id: null,
                username: null,
                name: null,
                email: null,
                created_at: null,
                avatar_filepath: null
            },
            shouldDeleteAccount: false,
            deleteAccountError: false,
        }
    }

    getUser = async () => {
        await fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            user = user.data;
            this.setState({
                user: {
                    user_id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                    avatar_filepath: user.avatar_filepath
                }
            })
        })
    }

    displayWarning = () => {
        this.setState({shouldDeleteAccount: true});
    }

    resetWarning = () => {
        this.setState({shouldDeleteAccount: false});
    }

    deleteAccount = () => {
        const {user_id} = this.state.user;
        this.setState({shouldDeleteAccount: false}); //hide modal
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(`/user/${user_id}`, {
            method: "delete",
            headers: {
                "Content-Type": "text/plain",
                "Access-Control-Allow-Origin": "*",
                "X-CSRF-TOKEN": token,
                Authorization:
                    "Bearer " +
                    document.querySelector('meta[name="api_token"]').content
            },
            redirect: "follow"
        })
            .then(() => {
                window.location.href = "/";
            })
            .catch(() => {
                this.setState({ deleteAccountError: true });
            });
    }

    render() {
        const { user, shouldDeleteAccount, deleteAccountError } = this.state;

        return (
            <div className="dashboard-wrapper container">
                {shouldDeleteAccount && (
                    <Modal
                        message="Are you sure you want to delete your account?"
                        resetState={this.resetWarning}
                        action={this.deleteAccount}
                    />
                )}

                <div className="row justify-content-center">
                    {user.user_id && (
                        <Card
                            user={user}
                            displayWarning={this.displayWarning}
                            refresh={this.getUser}
                            notifications={this.props.notifications}
                        />
                    )}

                    {deleteAccountError && (
                        <span>
                            Oops, something went wrong and we could not delete
                            your account. Please try again.
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

if (document.getElementById("dashboard")) {
    ReactDOM.render(<Dashboard notifications={parseNotifications()} />, document.getElementById("dashboard"));
}
