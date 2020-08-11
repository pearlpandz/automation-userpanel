import React, { Component } from 'react';
import './../common/common.css';
import './../pages/register.css';
import { Link } from 'react-router-dom';

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
                    values.email = "";
                    errors.email = "Email is not valid!";
                } else {
                    values.email = value;
                    errors.email = ""
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

    handleSubmit = event => {
        event.preventDefault();
        // submit values
        // console.log(this.state.values);
    };

    render() {
        const { errors, formValid } = this.state;
        return (
            <div className="wrapper flex-box flex-50-50">
                <div className="form-wrapper">
                    <h2 className="page-title">Welcome Back <span>Please login to your account</span></h2>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="email">
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
                        <div className="password">
                            <label htmlFor="password">Password</label>
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
                        <div className="info">
                            <small>Password must be eight characters in length.</small>
                        </div>
                        <div className="submit">
                            <button disabled={!formValid}>Create</button>
                        </div>
                    </form>
                    <h2 className="page-title text-center"><span><Link to="/register">Don't have an account? Register here!</Link></span></h2>
                </div>
                <div className="split-screen">
                    <img src={require('./../../assets/images/splash.png')} alt="Split Screen" />
                </div>
            </div>
        );
    }
}

export default Login;