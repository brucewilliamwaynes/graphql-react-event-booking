import React, { Component } from 'react';
import Modal from '../Components/Modal/Modal';
import Backdrop from '../Components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../Components/Events/EventList/EventList';
import Spinner from '../Components/Spinner/Spinner';

import './Events.css';

class EventsPage extends Component{
    state = {
        creating : false,
        events : [],
        isLoading : false,
        selectedEvent : null
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount(){
        if(this.state.events.length !== 0){
            this.fetchEvents();
        }
    }

    startCreateEventhandler = () => {
        this.setState({creating : true});
    }

    modalConfirmHandler = () => {
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if(title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0){
            this.setState({creating : false});
            return;
        }

        const event = {title: title, price: price, date: date, description: description};
        console.log(event);

        const requestBody = {
            query : `
                mutation {
                  createEvent( eventInput : {title : "${event.title}", desciption : "${event.description}", price : ${event.price}, date : "${event.date}"}) {
                        _id
                        title
                        description
                        price
                        date
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:4000/graphql', {
            method : 'POST',
            body : JSON.stringify(requestBody),
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then( resData => {
            this.setState(prevState => {
                const updatedEvents = [ ...prevState.events];
                updatedEvents.push({
                    _id : resData.data.createEvent._id,
                    title : resData.data.createEvent.title,
                    description :resData.data.createEvent.description,
                    date : resData.data.createEvent.date,
                    price : resData.data.createEvent.price,
                    creator : {
                        _id : this.context.userId
                    }
                });
                return {events : updatedEvents};
            });
        })
        .catch(err => {
            console.log(err);
        });

    };

    modalCancelHandler = () => {
        this.setState({creating : false, selectedEvent : null});
    };

    fetchEvents() {
        this.setState({isLoading : true});
        const requestBody = {
            query : `
                query {
                  events {
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method : 'POST',
            body : JSON.stringify(requestBody),
            headers : {
                'Content-Type' : 'application/json',
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then( resData => {
            const events = resData.data.evetns;
            this.setState({events : events, isLoading : false});
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading : false});
        });
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return (this.setState({selectedEvent : selectedEvent}));
        });
    }

    bookEventHandler = () => {

    }

    render(){

        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop></Backdrop>}
                {this.state.creating && (
                    <Modal title="Add title" 
                           canConfirm 
                           canCancel 
                           onConfirm = {this.modalConfirmHandler} 
                           onCancel = {this.modalCancelHandler}
                           confirmText = "Confirm"
                           >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="text" ref={this.titleElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}

                {this.state.selectedEvent && (
                    <Modal title={this.state.selectedEvent.title} 
                           canConfirm
                           canCancel
                           onConfirm = {this.bookEventHandler} 
                           onCancel = {this.modalCancelHandler}
                           confirmText = "Book"
                           >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>$ {this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )
                }

                {this.context.token && (
                    <div className="events-control">
                        <p>Share your own Events!</p>
                        <button className="btn" onClick={this.startCreateEventhandler}>Create event</button>
                    </div>
                    )}
                    {this.state.isLoading ? 
                        <Spinner></Spinner>
                        : (
                            <EventList 
                                events = {this.state.events} 
                                authUserId = {this.context.userId}
                                onViewDetail = {this.showDetailHandler}
                                >
                            </EventList>
                        )
                    }
            </React.Fragment>
        );
    }
}

export default EventsPage;