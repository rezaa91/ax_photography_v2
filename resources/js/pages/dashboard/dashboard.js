import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Card from './components/card';
import Modal from '../../global_components/modal';
import $ from 'jquery';

class Dashboard extends Component {
    constructor() {
        super();
        this.getUser();

        this.state = {
            user: {
                user_id: null,
                username: null,
                name: null,
                email: null,
                created_at: null
            },
            shouldDeleteAccount: false
        }

        this.getUser = this.getUser.bind(this);
        this.displayWarning = this.displayWarning.bind(this);
        this.resetWarning = this.resetWarning.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    async getUser() {
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
                    created_at: user.created_at
                }
            })
        })
        .catch(error => console.log(error));
    }

    displayWarning() {
        this.setState({shouldDeleteAccount: true});
    }

    resetWarning() {
        this.setState({shouldDeleteAccount: false});
    }

    async deleteAccount() {
        const {user_id} = this.state.user;
        this.setState({shouldDeleteAccount: false}); //hide modal

        await fetch(`/user/${user_id}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

    render() {
        const {user, shouldDeleteAccount} = this.state;

        return(
            <div className='dashboard-wrapper container'>
                {shouldDeleteAccount &&
                <Modal message="Are you sure you want to delete your account?" resetState={this.resetWarning} action={this.deleteAccount} />
                }
                <div className='row justify-content-center'>
                    <Card user = {user} displayWarning={this.displayWarning}/>
                </div>
            </div>
        );
    }
}

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}
