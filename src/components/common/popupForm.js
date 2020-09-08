import React, { Component } from 'react';

import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import axios from 'axios';

import './common.css';
import './popupForm.css';

import { BASEURL } from './../config/config.js';

class PopupForm extends Component {

    componentDidMount() {
        this.getDevices();
    }

    getDevices = async () => {
        const res = await axios.get(`${BASEURL}/devices/list`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        this.setState({ devices: res.data.data });
    }

    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: "",
                uniqueId: "",
            },
            formValid: false,
            errorCount: null,
            errors: {
                name: "",
                uniqueId: ""
            },
            selectedDevices: null,
            devices: [],
            devicesArr: [{
                name: '',
                deviceInfo: ''
            }],
        }

        this.onDeviceChange = this.onDeviceChange.bind(this);
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
        this.props.submit({
            name: this.state.values.name,
            boxId: this.state.values.uniqueId,
            devices: this.state.devicesArr.map(data => ({ "surName": data.name, "refId": data.deviceInfo._id }))
        });
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
            },
            selectedDevices: null,
            devicesArr: []
        });
        this.props.close(true);
    }

    deviceOptionTemplate(option) {
        return (
            <div className="country-item">
                <img className="drop-img" alt={option.name} src={option.url} />
                <div>{option.name}</div>
            </div>
        );
    }

    selectedDeviceTemplate(option, props) {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <img alt={option.name} src={option.url} />
                    <div>{option.name}</div>
                </div>
            );
        }

        return (
            <span>
                test {props.placeholder}
            </span>
        );
    }

    devicesArrAdd = () => {
        this.setState(prevState => ({
            devicesArr: [...prevState.devicesArr,
            {
                "name": "",
                "deviceInfo": ""
            }
            ]
        }));
    }

    devicesArrRemove = (index) => {
        // console.log(index);
    }

    onDeviceChange(event, index) {
        let deviceArr = this.state.devicesArr;
        deviceArr[index].deviceInfo = event.value;
        this.setState({
            deviceArr: deviceArr
        });
    }

    updateDevicesArr = (value, index) => {
        let deviceArr = this.state.devicesArr;
        deviceArr[index].name = value;
        this.setState({
            deviceArr: deviceArr
        });
    }

    render() {
        const { errors, devices, devicesArr } = this.state;
        const { display } = this.props;
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <Dialog header="Header" visible={display} style={{ width: '50vw' }} onHide={this.close}>
                    <div className="form-group p-col-4">
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
                    <div className="form-group p-col-4">
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
                    <div className="p-col-12">
                        {devicesArr.map((customDevice, index) => {
                            return <div className="p-grid p-justify-between" key={index}>
                                <div className="form-group p-col-12 p-md-4 p-lg-4 padding-right-zero text-left">
                                    <label htmlFor="devices">Select devices</label>
                                    <Dropdown name={'defaultName' + index} value={customDevice.deviceInfo} options={devices} onChange={(event) => this.onDeviceChange(event, index)} optionLabel="name" filter showClear filterBy="name" placeholder="Select a device"
                                        valueTemplate={this.selectedDeviceTemplate} itemTemplate={this.deviceOptionTemplate} />
                                </div>
                                <div className="form-group p-col-12 p-md-4 p-lg-4 text-left">
                                    <label htmlFor={'name' + index}>Custom Device Name</label>
                                    <input name={'name' + index}
                                        type="text"
                                        defaultValue={customDevice.name}
                                        onChange={(event) => this.updateDevicesArr(event.target.value, index)}
                                        noValidate
                                    />
                                </div>
                                <div className="form-group p-col-12 p-md-3 p-lg-3 text-right">
                                    <label style={{ visibility: 'hidden' }} htmlFor="devices">Custom Device Name</label>
                                    <Button type="button" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined margin-right-10" tooltip="Remove Item" tooltipOptions={{ position: 'bottom' }} onClick={this.devicesArrRemove(index)} />
                                    <Button type="button" icon="pi pi-plus" className="p-button-rounded p-button-info p-button-outlined" tooltip="Add New Item" tooltipOptions={{ position: 'bottom' }} onClick={this.devicesArrAdd} />
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="form-group flex justify-end">
                        <Button type="button" label="No" className="p-button-text margin-right-10" />
                        <Button type="submit" disabled={!this.state.formValid} label="Yes" autoFocus />
                    </div>
                </Dialog>
            </form>

        )
    }
}

export default PopupForm;