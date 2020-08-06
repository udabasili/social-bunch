const Models = require('../models');
const logger = require('../loaders/logger');

/** Handle event functions*/
class EventService {
    /**
     * 
     * @param {Object} currentUser 
     * @param {Object} eventRecord - the details of the event being added
     * @param {String} eventId 
     */
    constructor(currentUser=null, eventRecord=null, eventId=null){
        this.currentUser = currentUser;
        this.eventRecord = eventRecord;
        this.eventId = eventId;
    }

    /**
     * create new event
     * @return {Object} event
     * @return {Object Array} events
     */
    async createEvent(){
        let event = await Models.Event.create(this.eventRecord)
        event.createdBy = this.currentUser.username        
        event = await event.save()        
        const events = await Models.Event.find()
        logger('info', `${this.currentUser.username} created event called ${event.eventName}`)
        return {event, events};
    }

    /**
     * user joining an event
     * @return {Object} allEvents
     */
    async joinEvent(){
        let event = await Models.Event.findById(this.eventId);
        await event.attenders.push(this.currentUser.username);
        await event.save();
        let allEvents = await Models.Event.find();
        logger('info', `${this.currentUser.username} joined event called ${event.eventName}`)
        return allEvents
    }

    /**
     * user leaving an event
     * @return {Object} allEvents
    */
    async leaveEvent(){
        const event = await Models.Event.findById(this.eventId)
        await event.removeAttender(this.currentUser.username);
        await event.save();
        let allEvents = await Models.Event.find();
        logger('info', `${this.currentUser.username} left an event called ${event.eventName}`)
        return allEvents
    }

    /**
     * current user deleting an event he created
     * @return {Object} allEvents
     */
    async deleteEvent(){
        const event = await Models.Event.findById(this.eventId)
        await Models.Event.findByIdAndRemove(this.eventId)
        logger('info', `${event.eventName} event deleted`)
        let allEvents = await Models.Event.find()
        return allEvents
        
    }
}

module.exports = EventService;