import React, { Component } from 'react';
import Modal from '../Components/Modal/Modal';
import Backdrop from '../Components/Backdrop/Backdrop';

import './Events.css';

class EventsPage extends Component{
    state = {
        creating : false
    };

    startCreateEventhandler = () => {
        this.setState({creating : true});
    }

    modalConfirmHandler = () => {};

    modalCancelHandler = () => {
        this.setState({creating : false});
    };

    render(){
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop></Backdrop>}
                {this.state.creating && (
                    <Modal title="Add title" canConfirm onConfirm = {this.modalConfirmHandler} canCancel onCancel = {this.modalCancelHandler}>
                        <p>Modal Content</p>
                    </Modal>
                )}
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventhandler}>Create event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;