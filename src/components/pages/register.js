import React, { Component } from 'react';
import './../common/common.css';
import './../pages/register.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

import { Growl } from 'primereact/growl';

import { BASEURL } from './../config/config.js';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: "",
                email: "",
                password: ""
            },
            formValid: false,
            errorCount: null,
            errors: {
                name: "",
                email: "",
                password: ""
            }
        };

        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
    }

    componentDidMount() {

    }

    validEmailRegex = RegExp(
        /^([a-zA-Z0-9_\-/.]+)@([a-zA-Z0-9_\-/.]+)\.([a-zA-Z]{2,5})$/
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
            case "name":
                if (value.length < 5) {
                    errors.name = "Full Name must be 5 characters long!";
                    values.name = "";
                } else {
                    errors.name = "";
                    values.name = value;
                }
                break;
            case "email":
                if (this.validEmailRegex.test(value)) {
                    errors.email = "";
                    values.email = value;
                } else {
                    errors.email = "Email is not valid!";
                    values.email = "";
                }
                break;
            case "mobile":
                values.mobile = value;
                break;
            case "password":
                if (value.length < 8) {
                    errors.password = "Password must be 8 characters long!";
                    values.password = "";
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
            detail: 'Successfully Registered!',
            life: 3000
        });
    }

    showError = (res) => {
        this.growl.show({
            severity: 'error',
            summary: 'Error Message',
            detail: res.data.message,
            life: 3000
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const value = this.state.values;
        value.role = 'user';

        await axios.post(`${BASEURL}/signup`, value).then(response => {
            this.showSuccess(response);
            setTimeout(() => {
                this.props.history.push('/');
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
                    <h2 className="page-title">Sign up <span>Sign up to try our amazing services</span></h2>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="name p-col-12 form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={this.handleChange}
                                noValidate
                            />
                            {errors.name.length > 0 && (
                                <span className="error">{errors.name}</span>
                            )}
                        </div>
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
                        <div className="mobile p-col-12 form-group">
                            <label htmlFor="mobile">Mobile</label>
                            <input
                                type="number"
                                name="mobile"
                                onChange={this.handleChange}
                                noValidate
                            />
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
                            <button className="mybtn" disabled={!formValid}>Create</button>
                        </div>
                    </form>
                    <h2 className="page-title text-center"><span><Link to="/">Already have an account? Login here!</Link></span></h2>
                </div>
                <div className="split-screen">
                    <img src={require('./../../assets/images/splash.png')} alt="Split Screen" />
                </div>
            </div>
        );
    }
}

export default Register;