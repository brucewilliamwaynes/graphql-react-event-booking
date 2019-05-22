const Event = require('../../models/event');

const { transformEvent } = require('./merge') ;

module.exports = {
    events : () => {
        return Event
        .find()
        .populate('creator')
        .then( events => {
            return events.map( event => {
                return transformEvent(event);
            });
        })
        .catch( err => {
            throw err;
        });
    },

    createEvent : args => {
        
        const event = new Event( {
            title : args.eventInput.title,
            description : args.eventInput.description,
            price : +args.eventInput.price,
            date : new Date(args.eventInput.date),
            creator : 'userID from MongoDB'
        });
        let createdEvent;
        return event
        .save()
        .then(result => {
            createdEvent = transformEvent(result);

            return User.findById('userID by MONGODB')
        })
        .then(user => {
            if(!user) {
                throw new Error('User not found.');
            }
            user.createdEvent.push(event);
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err => {
           console.log(err);
           throw err;
        });
    }
};