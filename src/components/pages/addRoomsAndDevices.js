import React, { Component } from 'react';
import './add-devices.css';
import PopupForm from './../common/popupForm.js';
import MyTable from './../common/mytable.js';

// PrimeNG Elements
import { Button } from 'primereact/button';

class AddRoomsAndDevices extends Component {



    constructor(props) {
        super(props);
        this.state = {
            isPopUpShowing: false,
            rooms: [
                {
                    id: 1,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 2,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 3,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 4,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 5,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 6,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 7,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 8,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 9,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 10,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 11,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 12,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 13,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 14,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 15,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 16,
                    name: 'Tube Light',
                    uniqueId: 'TL0000001X'
                },
                {
                    id: 17,
                    name: 'Fan',
                    uniqueId: 'TL0000002X'
                },
                {
                    id: 18,
                    name: 'Switch Box',
                    uniqueId: 'TL0000002X'
                },
            ]
        }
    }

    showAddRoom = () => {
        this.setState({ isPopUpShowing: true })
    }

    submitAddRoom = (values) => {
        this.state.rooms.push(values);
        console.log(this.state.rooms)
    }

    close = (e) => {
        this.setState({ isPopUpShowing: !e })
    }


    render() {
        const { isPopUpShowing, rooms } = this.state;
        return (
            <div className="rooms-devices flex flex-30-70 height-100vh">
                <div className="left-img">
                    <img src={require('./../../assets/images/add-devices.png')} alt="Add Devices" />
                </div>
                <div>
                    {isPopUpShowing ?
                        <PopupForm heading="Add Room" close={this.close} submit={this.submitAddRoom} />
                        :
                        <div className="room-list">
                            <div className="page-header">
                                <h4 className="page-title margin-zero">Rooms</h4>
                                <Button label="Add Room" icon="pi pi-plus" onClick={this.showAddRoom} />
                            </div>
                            <div className="page-body">
                                <MyTable data={rooms} dataKey="id" noOfRows={20} selection={false} expand={false} exportpdf={false}/>
                            </div>
                        </div>
                    }
                </div>
            </div>

        )
    }
}

export default AddRoomsAndDevices;