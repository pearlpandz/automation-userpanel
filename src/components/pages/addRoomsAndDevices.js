import React, { Component } from 'react';
import './add-devices.css';
import PopupForm from './../common/popupForm.js';
import MyTable from './../common/mytable.js';
import AppHeader from './../common/app-header.js';

// PrimeNG Elements
import { Button } from 'primereact/button';

import axios from 'axios';

import { Growl } from 'primereact/growl';

class AddRoomsAndDevices extends Component {

    componentDidMount() {
        this.getRooms();
    }

    getRooms = async () => {
        const res = await axios.get(`http://localhost:8000/rooms/listAll`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        this.setState({ rooms: res.data.data });
    }

    constructor(props) {
        super(props);
        this.state = {
            isPopUpShowing: false,
            rooms: []
        }
        this.columns = [
            { field: 'boxId', header: 'Room ID' },
            { field: 'name', header: 'Room Name' },
        ];

        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
    }

    showAddRoom = () => {
        this.setState({ isPopUpShowing: true, display: true })
    }

    submitAddRoom = async (values) => {
        await axios.post(`http://localhost:8000/room/add`, values, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then(() => {
            this.getRooms();
            this.showSuccess('Room successfully added!');
        }).catch(error => {
            this.showError(error.response.data.message);
        })
    }

    close = (e) => {
        this.setState({ isPopUpShowing: !e, display: e })
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


    render() {
        const { isPopUpShowing, rooms, display } = this.state;
        return (
            <div className="rooms-devices flex flex-30-70 height-100vh" >
                <div className="left-img">
                    <Growl ref={(el) => this.growl = el} />
                    <img src={require('./../../assets/images/add-devices.png')} alt="Add Devices" />
                </div>
                <div>
                    <AppHeader name={localStorage.getItem('user_name')} />
                    {isPopUpShowing ?
                        <PopupForm heading="Add Room" close={this.close} display={display} submit={this.submitAddRoom} />
                        :
                        <div className="room-list">
                            <div className="page-header">
                                <h4 className="page-title margin-zero">Rooms</h4>
                                <Button label="Add Room" icon="pi pi-plus" onClick={this.showAddRoom} />
                            </div>
                            <div className="page-body">
                                <MyTable data={rooms} columns={this.columns} dataKey="name" noOfRows={20} selection={false} expand={true} exportpdf={false} />
                            </div>
                        </div>
                    }
                </div>
            </div>

        )
    }
}

export default AddRoomsAndDevices;