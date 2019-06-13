import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../Components/Spinner/Spinner';
import BookingList from '../Components/Bookings/BookingList/BookingList';
import BookingsChart from '../Components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../Components/Bookings/BookingsControl/BookingsControl';

class BookingsPage extends Component {

    state = {
        isLoading: false,
        bookings: [],
        outputType: 'List'
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fecthBookings();
    }

    fecthBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                const bookings = resData.data.bookings;
                this.setState({ bookings: bookings, isLoading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    }

    deleteBookingHandler = bookingId => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                  cancelBooking(bookingId : $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(booking => {
                        return booking._id !== bookingId;
                    });
                    return ({ bookings: updatedBookings, isLoading: false });
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    };

    changeOutputTypeHandler = outputType => {
        if (outputType === 'List') {
            this.setState({ outputType: 'List' });
        }
        else {
            this.setState({ outputType: 'Chart' });
        }
    }


    render() {
        let content = <Spinner></Spinner>;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingsControl 
                        activeOutputType={this.state.outputType} 
                        onChange={this.changeOutputTypeHandler}>
                    </BookingsControl>
                    <div>
                        <button onClick={this.changeOutputTypeHandler.bind(this, 'List')}>List</button>
                        <button onClick={this.changeOutputTypeHandler.bind(this, 'Chart')}>Chart</button>
                    </div>
                    <div>
                        {this.state.outputType === 'List' ? (
                            <BookingList
                                bookings={this.state.bookings}
                                onDelete={this.deleteBookingHandler}>
                            </BookingList>
                        ) : (
                                <BookingsChart bookings={this.state.bookings}></BookingsChart>
                            )}
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>

        );
    }
}

export default BookingsPage;