import React, { Component } from 'react';
import './dashboard.css';
import AppHeader from '../common/app-header.js';

// PrimeNG Elements
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Growl } from 'primereact/growl';
import { Dropdown } from 'primereact/dropdown';

import axios from 'axios';


import { BASEURL } from '../config/config.js';

class Dashboard extends Component {

    componentDidMount() {
        this.getRooms();
        this.getBaseDevices();
    }

    getRooms = async () => {
        await axios.get(`${BASEURL}/rooms/list`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(res => {
            this.setState({ rooms: res.data, activeId: res.data[0].id });
            this.getDevices(this.state.activeId)
        }).catch(error => {
            console.log(error.response)
        });
    }

    getDevices = async (roomId) => {
        this.setState({
            activeId: roomId
        });
        await axios.get(`${BASEURL}/devices/list/${roomId}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(res => {
            this.setState({ devices: res.data.data });
        }).catch(error => {
            console.log(error.response)
        });
    }

    getBaseDevices = async () => {
        await axios.get(`${BASEURL}/basedevices/list`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(res => {
            let devices = [];
            res.data.data.forEach(device => {
                devices.push({ label: device.name, value: device.id, url: device.url })
            })
            this.setState({ baseDevices: devices });
        }).catch(error => {
            console.log(error)
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            devices: [],
            baseDevices: [],
            activeId: 0,

            // Room
            room_display: false,
            room_delete_display: false,
            room_action: '',
            room_values: {
                id: 0,
                name: "",
                boxId: ""
            },
            room_errors: {
                name: "",
                boxId: ""
            },
            room_formValid: false,

            // Device
            device_display: false,
            device_delete_display: false,
            device_action: '',
            device_values: {
                id: 0,
                name: "",
                baseDeviceId: ""
            },
            device_errors: {
                name: "",
                baseDeviceId: ""
            },
            device_formValid: false,
            device_selectedDevice: null

        }

        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.onHideRoomPopup = this.onHideRoomPopup.bind(this);

        this.onDeviceChange = this.onDeviceChange.bind(this);
    }

    onHideRoomPopup(name) {
        this.setState({
            [`${name}`]: false,

            room_values: {
                id: 0,
                name: "",
                boxId: ""
            },
            room_errors: {
                name: "",
                boxId: ""
            },
            room_formValid: false,
            room_action: '',

            room_info_id: 0,
            room_info_name: ''

        })
    }

    showSuccess = (msg) => {
        this.growl.show({
            severity: 'success',
            summary: 'Success Message',
            detail: msg,
            life: 3000
        });
    }

    showError = (message) => {
        this.growl.show({
            severity: 'error',
            summary: 'Error Message',
            detail: message,
            life: 3000
        });
    }


    // Room
    editRoom = (roomId) => {
        let room = this.state.rooms.find(a => a.id === roomId)
        this.setState({
            room_values: {
                id: room.id,
                name: room.name,
                boxId: room.boxId
            },
            room_errors: {
                name: "",
                boxId: ""
            },
            room_formValid: this.validateForm(room),
            room_display: true,
            room_action: 'edit'
        })

    }

    createRoom = () => {
        this.setState({
            room_display: true,
            room_action: 'add'
        })
    }

    deleteRoom = (roomId) => {
        let room = this.state.rooms.find(a => a.id === roomId);
        this.setState({
            room_delete_display: true,
            // remove icon clicked and that name; it may not selected
            room_info_id: room.id,
            room_info_name: room.name
        })
    }

    roomDelete = async (roomId) => {
        if (roomId > 0) {
            await axios.delete(`${BASEURL}/room/${roomId}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideRoomPopup('room_delete_display');
                this.showSuccess(response.data.message);
                this.getRooms();
            }).catch(error => {
                console.log(error.response)
            });
        }
    }

    roomsComponent = (rooms) => {
        return (
            <ul>
                {
                    rooms.length > 0 ?
                        rooms.map((room) => {
                            return <li className={this.state.activeId === room.id ? 'active' : 'not-active'} key={room.id}>
                                <h4 className="pointer">
                                    <span onClick={() => this.getDevices(room.id)}>{room.name}</span>
                                    <span>
                                        <Button onClick={() => this.editRoom(room.id)} icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-transparent" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} />
                                        <Button onClick={() => this.deleteRoom(room.id)} icon="pi pi-times" className="p-button-rounded p-button-text p-button-transparent" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} />
                                    </span>
                                </h4>
                            </li>
                        })
                        :
                        <li><h4>There is no room available.</h4></li>
                }
            </ul>
        )
    }

    handleRoomChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.room_errors;
        let values = this.state.room_values;

        switch (name) {
            case "name":
                if (value.length > 0) {
                    values.name = value;
                    errors.name = ""
                } else {
                    values.name = "";
                    errors.name = "Name is required!";
                }
                break;
            case "boxId":
                if (value.length > 0) {
                    errors.boxId = "";
                    values.boxId = value;
                } else {
                    values.boxId = "";
                    errors.boxId = "Box Id is required!";
                }
                break;
            default:
                break;
        }

        this.setState({

            room_errors: errors,
            room_values: values,
            room_formValid: this.validateForm(values),

        });
    };

    validateForm = (values) => {
        let index = Object.values(values).findIndex(a => a.length === 0)
        return index === -1 ? true : false;
    };

    handleRoomSubmit = async (event) => {
        event.preventDefault();

        if (this.state.room_action === 'edit') {
            const values = {
                name: this.state.room_values.name,
                boxId: this.state.room_values.boxId
            };

            await axios.put(`${BASEURL}/room/${this.state.room_values.id}`, values, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideRoomPopup('room_display')
                this.showSuccess(response.data.message);
                this.getRooms();
            }).catch(error => {
                console.log(error)
            })
        } else {
            const values = {
                name: this.state.room_values.name,
                boxId: this.state.room_values.boxId
            };

            await axios.post(`${BASEURL}/room`, values, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideRoomPopup('room_display')
                this.showSuccess(response.data.message);
                this.getRooms();
            }).catch(error => {
                console.log(error)
            })
        }



    };


    // Device
    devicesComponent(devices) {
        return (
            devices.length > 0 ?
                <ul className="devices">
                    {
                        devices.map((device) => {
                            return <li key={device.id}>
                                <div>
                                    <img src={BASEURL + device.url} alt={device.surname} />
                                    <h4 className="pointer">
                                        <span>{device.surname}</span>
                                        <span>
                                            <Button onClick={() => this.editDevicePopup(device.id)} icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-transparent dark" tooltip="Edit" tooltipOptions={{ position: 'bottom' }} />
                                            <Button onClick={() => this.deleteDevicePopup(device.id)} icon="pi pi-times" className="p-button-rounded p-button-text p-button-transparent dark" tooltip="Delete" tooltipOptions={{ position: 'bottom' }} />
                                        </span>
                                    </h4>

                                </div>
                            </li>
                        })
                    }
                </ul>
                :
                <div className="flex fcenter">
                    <p>There is no device available.</p>
                </div>
        )
    }

    onDeviceChange = (event) => {
        this.setState({
            device_selectedDevice: event.value
        })
    }

    onHideDevicePopup(name) {
        this.setState({
            [`${name}`]: false,

            device_values: {
                id: 0,
                name: "",
                baseDeviceId: ""
            },
            device_errors: {
                name: "",
                baseDeviceId: ""
            },
            device_formValid: false,
            device_action: '',

            device_info_id: 0,
            device_info_name: ''

        })
    }

    deviceOptionTemplate(option) {
        return (
            <div className="country-item" key={option.value}>
                <img className="drop-img" alt={option.label} src={option.url} />
                <div>{option.label}</div>
            </div>
        );
    }

    selectedDeviceTemplate(option, props) {
        if (option) {
            console.log(option)
            return (
                <div className="country-item country-item-value">
                    {/* <img alt={option.label} src={option.url} /> */}
                    <div>{option.label}</div>
                </div>
            );
        }

        return (
            <span>
                test {props.placeholder}
            </span>
        );
    }

    handleDeviceChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.device_errors;
        let values = this.state.device_values;

        switch (name) {
            case "name":
                if (value.length > 0) {
                    values.name = value;
                    errors.name = ""
                } else {
                    values.name = "";
                    errors.name = "Name is required!";
                }
                break;
            case "baseDeviceId":
                if (value > 0) {
                    errors.baseDeviceId = "";
                    values.baseDeviceId = value;
                } else {
                    values.baseDeviceId = "";
                    errors.baseDeviceId = "Device is required!";
                }
                break;
            default:
                break;
        }

        this.setState({
            device_errors: errors,
            device_values: values,
            device_formValid: this.validateForm(values),
        });
    };

    handleDeviceSubmit = async (event) => {
        event.preventDefault();

        if (this.state.device_action === 'edit') {
            const values = {
                name: this.state.device_values.name,
                baseDeviceId: this.state.device_values.baseDeviceId
            };

            await axios.put(`${BASEURL}/device/${this.state.device_values.id}`, values, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideDevicePopup('device_display')
                this.showSuccess(response.data.message);
                this.getDevices(this.state.activeId);
            }).catch(error => {
                console.log(error)
            })
        } else {
            const values = {
                name: this.state.device_values.name,
                baseDeviceId: this.state.device_values.baseDeviceId,
                roomId: this.state.activeId
            };

            await axios.post(`${BASEURL}/device`, values, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideDevicePopup('device_display')
                this.showSuccess(response.data.message);
                this.getDevices(this.state.activeId);
            }).catch(error => {
                console.log(error)
            })
        }
    };

    createDevicePopup = () => {
        this.setState({
            device_display: true,
            device_action: 'add'
        })
    }

    editDevicePopup = (deviceId) => {
        let device = this.state.devices.find(a => a.id === deviceId)
        this.setState({
            device_values: {
                id: device.id,
                name: device.surname,
                baseDeviceId: device.refId
            },
            device_errors: {
                name: "",
                baseDeviceId: ""
            },
            device_formValid: this.validateForm(device),
            device_selectedDevice: device.refId,
            device_display: true,
            device_action: 'edit'
        })
    }

    deleteDevicePopup = (deviceId) => {
        let room = this.state.devices.find(a => a.id === deviceId);
        this.setState({
            device_delete_display: true,
            device_info_id: room.id,
            device_info_name: room.surname
        })
    }

    deleteDevice = async (deviceId) => {
        if (deviceId > 0) {
            await axios.delete(`${BASEURL}/device/${deviceId}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth_token')}`
                }
            }).then(response => {
                this.onHideRoomPopup('device_delete_display');
                this.showSuccess(response.data.message);
                this.getDevices(this.state.activeId);
            }).catch(error => {
                console.log(error.response)
            });
        }
    }


    render() {
        const { rooms, devices, baseDevices, device_selectedDevice, device_delete_display } = this.state;

        return (
            <div className="dashboard" >
                <Growl ref={(el) => this.growl = el} />

                <AppHeader name={localStorage.getItem('user_name')} />

                <div className="page-body">
                    <div className="left-sec">
                        <div className="heading">
                            <h2>Rooms</h2>
                            <Button onClick={this.createRoom} icon="pi pi-plus" className="p-button-rounded p-button-text p-button-transparent" tooltip="Add" tooltipOptions={{ position: 'bottom' }} />
                        </div>
                        {this.roomsComponent(rooms)}
                    </div>
                    <div className="right-sec">
                        <div className="heading">
                            <h2>Devices</h2>
                            <Button onClick={this.createDevicePopup} icon="pi pi-plus" className="p-button-rounded p-button-text p-button-transparent" tooltip="Add" tooltipOptions={{ position: 'bottom' }} />
                        </div>
                        {this.devicesComponent(devices)}

                    </div>
                </div>

                {/* Room Add/Edit Popup */}
                <Dialog header={this.state.room_action + " Room"} visible={this.state.room_display} style={{ width: '35vw' }} onHide={() => this.onHideRoomPopup('room_display')}>
                    <form onSubmit={this.handleRoomSubmit} noValidate>
                        <div className="name p-col-12 form-group">
                            <label htmlFor="name">Name</label>
                            <input type="hidden" name="id" value={this.state.room_values.id > 0 ? this.state.room_values.id : 0} />
                            <input
                                type="text"
                                name="name"
                                value={this.state.room_values.name}
                                onChange={this.handleRoomChange}
                                noValidate
                            />
                            {

                                this.state.room_errors.name.length > 0 && (
                                    <span className="error">{this.state.room_errors.name}</span>
                                )}
                        </div>
                        <div className="boxId p-col-12 form-group">
                            <label htmlFor="boxIdboxId">BoxId</label>
                            <input
                                type="text"
                                name="boxId"
                                value={this.state.room_values.boxId}
                                onChange={this.handleRoomChange}
                                noValidate
                            />
                            {this.state.room_errors.boxId.length > 0 && (
                                <span className="error">{this.state.room_errors.boxId}</span>
                            )}
                        </div>
                        <div className="submit popup-btns p-col-12">
                            <Button type="button" label="Cancel" icon="pi pi-times" onClick={() => this.onHideRoomPopup('room_display')} className="p-button p-button-transparent" />
                            <Button disabled={!this.state.room_formValid} label="Save" icon="pi pi-check" type="submit" autoFocus />
                        </div>
                    </form>
                </Dialog>

                {/* Room Delete Confirmation */}
                <Dialog header="Delete Room" visible={this.state.room_delete_display} style={{ width: '35vw' }} onHide={() => this.onHideRoomPopup('room_delete_display')}>
                    <form>
                        <h4>Are you want to delete '{this.state.room_info_name}'?</h4>
                        <p>It will delete entire configuration and associated devices.</p>
                        <div className="submit popup-btns-center p-col-12">
                            <Button type="button" label="No" icon="pi pi-times" onClick={() => this.onHideRoomPopup('room_delete_display')} className="p-button p-button-transparent" />
                            <Button label="Yes" icon="pi pi-check" type="button" onClick={() => this.roomDelete(this.state.room_info_id)} autoFocus />
                        </div>
                    </form>
                </Dialog>

                {/* Device Add/Edit Popup */}
                <Dialog header={this.state.device_action + " Device"} visible={this.state.device_display} style={{ width: '35vw' }} onHide={() => this.onHideRoomPopup('device_display')}>
                    <form onSubmit={this.handleDeviceSubmit} noValidate>
                        <div className="name p-col-12 form-group">
                            <label htmlFor="name">Name</label>
                            <input type="hidden" name="id" value={this.state.device_values.id > 0 ? this.state.device_values.id : 0} />
                            <input
                                type="text"
                                name="name"
                                value={this.state.device_values.name}
                                onChange={this.handleDeviceChange}
                                noValidate
                            />
                            {
                                this.state.device_errors.name.length > 0 && (
                                    <span className="error">{this.state.device_errors.name}</span>
                                )}
                        </div>
                        <div className="baseDeviceId p-col-12 form-group">
                            <label htmlFor="baseDeviceId">Available Devices</label>
                            <Dropdown dataKey="value" appendTo={document.body} style={{ width: '100%' }} name="baseDeviceId" options={baseDevices} onChange={(event) => { this.onDeviceChange(event); this.handleDeviceChange(event) }} optionLabel="label" filter showClear filterBy="label" placeholder="Select a device"
                                value={device_selectedDevice} valueTemplate={this.selectedDeviceTemplate} itemTemplate={this.deviceOptionTemplate} />
                            {this.state.device_errors.baseDeviceId.length > 0 && (
                                <span className="error">{this.state.device_errors.baseDeviceId}</span>
                            )}
                        </div>
                        <div className="submit popup-btns p-col-12">
                            <Button type="button" label="Cancel" icon="pi pi-times" onClick={() => this.onHideDevicePopup('device_display')} className="p-button p-button-transparent" />
                            <Button disabled={!this.state.device_formValid} label="Save" icon="pi pi-check" type="submit" autoFocus />
                        </div>
                    </form>
                </Dialog>

                {/* Room Delete Confirmation */}
                <Dialog header="Delete Device" visible={device_delete_display} style={{ width: '35vw' }} onHide={() => this.onHideRoomPopup('device_delete_display')}>
                    <form>
                        <h4>Are you want to delete '{this.state.device_info_name}'?</h4>
                        <p>It will delete entire configuration and devices details.</p>
                        <div className="submit popup-btns-center p-col-12">
                            <Button type="button" label="No" icon="pi pi-times" onClick={() => this.onHideRoomPopup('device_delete_display')} className="p-button p-button-transparent" />
                            <Button label="Yes" icon="pi pi-check" type="button" onClick={() => this.deleteDevice(this.state.device_info_id)} autoFocus />
                        </div>
                    </form>
                </Dialog>

            </div>

        )
    }
}

export default Dashboard;