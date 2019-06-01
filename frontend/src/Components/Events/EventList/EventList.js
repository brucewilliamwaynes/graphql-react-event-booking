import React from 'react';
import './EventList.css';

import EventItem from './EventItem/EventItem';

const eventList = props => {

    const events = props.events.map(event => {
        return(
            <EventItem 
                key={event._id}
                eventId = {event._id}
                title = {event.title} 
                price = {event.price}
                date = {event.date}
                userId = {props.authUserId}
                creatorId = {event.creator._id}
                onDetails = {props.onViewDetail}
            />
        );
    });

    return (<ul className="event_list">
                        {events}
                    </ul>);
};

export default eventList;