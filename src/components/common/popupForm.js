import React, { Component } from 'react';

class PopupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: "",
                uniqueId: ""
            },
            formValid: false,
            errorCount: null,
            errors: {
                name: "",
                uniqueId: ""
            }
        };
    }

    validateForm = values => {
        const index = Object.values(values).findIndex(val => val.length < 1);
        return index === -1 ? true : false;
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
                if (value && value !== null && value !== ' ') {
                    values.name = value;
                    errors.name = "";
                } else {
                    values.name = "";
                    errors.name = "Room Name is required!";
                }
                break;
            case "uniqueId":
                if (value && value !== null && value !== ' ') {
                    values.uniqueId = value;
                    errors.uniqueId = "";
                } else {
                    values.uniqueId = ""
                    errors.uniqueId = "Room Unique Id/Box Id is required!";
                }
                break;
            default:
                break;
        }

        this.setState({
            errors,
            [name]: value,
            values,
            formValid: this.validateForm(values),
            errorCount: this.countErrors(errors)
        });

    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.submit(this.state.values);
        this.props.close(true);
    };

    close = () => {
        this.setState({
            values: {
                name: "",
                uniqueId: ""
            },
            formValid: false,
            errorCount: null,
            errors: {
                name: "",
                uniqueId: ""
            }
        });
        this.props.close(true);
    }

    render() {
        const { errors, formValid } = this.state;
        return (
            <div className="modal">
                <div className="backdrop"></div>
                <div className="modal-body">
                    <div className="modal-header"> 
                        <h4>{this.props.heading}</h4>
                        <h4 className="close" onClick={this.close}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </h4>
                    </div>
                    <div className="modal-content">
                        <form onSubmit={this.handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={this.handleChange}
                                    noValidate
                                />
                                {errors.name && (
                                    <span className="error">{errors.name}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="uniqueId">Unique Id/Box Id</label>
                                <input
                                    type="text"
                                    name="uniqueId"
                                    onChange={this.handleChange}
                                    noValidate
                                />
                                {errors.uniqueId && (
                                    <span className="error">{errors.uniqueId}</span>
                                )}
                            </div>
                            <div className="submit">
                                <button disabled={!formValid}>Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopupForm;