import React, { Component } from 'react';
import './../common/common.css';
import './../pages/register.css';

import axios from 'axios';

import { Growl } from 'primereact/growl';

import { BASEURL } from './../config/config.js';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                email: "",
                password: ""
            },
            formValid: false,
            errorCount: null,
            errors: {
                email: "",
                password: ""
            }
        };

        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
    }

    componentDidMount() {
        this.props.location.error && this.showError(this.props.location.error);
    }

    validEmailRegex = RegExp(
        /^([a-zA-Z0-9]+)@([a-zA-Z0-9]+).([a-zA-Z]{2,5})$/
    );
    validateForm = errors => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    };

    countErrors = errors => {
        let count = 0;
        Object.values(errors).forEach(val => val.length > 0 && (count = count + 1));
        return count;
    };

    handleChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        let values = this.state.values;

        switch (name) {
            case "email":
                if (this.validEmailRegex.test(value)) {
                    values.email = value;
                    errors.email = ""
                } else {
                    values.email = "";
                    errors.email = "Email is not valid!";
                }
                break;
            case "password":
                if (value.length < 8) {
                    values.password = "";
                    errors.password = "Password must be 8 characters long!";
                } else {
                    errors.password = "";
                    values.password = value;
                }
                break;
            default:
                break;
        }

        this.setState({
            errors,
            [name]: value,
            values,
            formValid: this.validateForm(errors),
            errorCount: this.countErrors(errors)
        });
    };

    showSuccess = (res) => {
        this.growl.show({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Welcome Back!',
            life: 3000
        });
    }

    showError = (error) => {
        this.growl.show({
            severity: 'error',
            summary: error.statusText,
            detail: error.data.message,
            life: 3000
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const value = this.state.values;
        value.role = 'user';

        await axios.post(`${BASEURL}/login`, value).then(response => {
            this.showSuccess(response);
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_id', response.data.data.id);
            localStorage.setItem('user_name', response.data.data.name);
            setTimeout(() => {
                this.props.history.push('/dashboard')
            }, 2000);
        }).catch(error => {
            this.showError(error.response);
        })
    };

    render() {
        const { errors, formValid } = this.state;
        return (
            <div className="wrapper flex-box flex-50-50">
                <div className="form-wrapper">
                    <Growl ref={(el) => this.growl = el} />
                    <h2 className="page-title">Welcome Back <span>Please login to your account</span></h2>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="email p-col-12 form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={this.handleChange}
                                noValidate
                            />
                            {errors.email.length > 0 && (
                                <span className="error">{errors.email}</span>
                            )}
                        </div>
                        <div className="password p-col-12 form-group">
                            <label htmlFor="password">Password <small>(must be eight characters in length.)</small></label>
                            <input
                                type="password"
                                name="password"
                                onChange={this.handleChange}
                                noValidate
                            />
                            {errors.password.length > 0 && (
                                <span className="error">{errors.password}</span>
                            )}
                        </div>
                        <div className="submit p-col-12">
                            <button className="mybtn" disabled={!formValid}>Login</button>
                        </div>
                    </form>
                </div>
                <div className="split-screen">
                    <img src={require('./../../assets/images/splash.png')} alt="Split Screen" />
                </div>
            </div>
        );
    }
}

export default Login;