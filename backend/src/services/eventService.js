const models = require('../models');
const Logger = require('../loaders/logger');
const mongoose = require('mongoose');

const logger = Logger
/** Handle event functions*/
class EventService {
    /**
     * 
     * @param {Object} currentUser 
     * @param {Object} eventRecord - the details of the event being added
     * @param {String} eventId 
     */
    constructor(currentUser = null, eventRecord = null, eventId = null) {
        this.currentUser = currentUser;
        this.eventRecord = eventRecord;
        this.eventId = eventId;
    }

    /**
     * create new event
     * @return {Object} event
     * @return {Object Array} events
     */
    async createEvent() {
        const eventRecord = this.eventRecord;
        const event = await models.EventModel.create({
            eventName: eventRecord.EventName,
            description: eventRecord.EventDescription,
            date: eventRecord.EventDate,
            time: eventRecord.EventTime,
            category: eventRecord.EventCategory,
            createdBy: mongoose.Types.ObjectId(this.currentUser._id)
        })
        event.attenders.push(mongoose.Types.ObjectId(this.currentUser._id))
        await event.save()
        const events = await this.getAllEvents()
        return {
            event,
            events
        };
    }

    async getAllEvents(){
        const events = await models.EventModel.find()
            .populate('createdBy', ['username', 'userImage'])
            .populate('attenders', ['username', 'userImage'])

        return events;
    }

    /**
     * user joining an event
     * @return {Object} allEvents
     */
    async joinEvent() {
        await models.EventModel.findByIdAndUpdate(
                mongoose.Types.ObjectId(this.eventId),
                {
                    $push:{
                        attenders: mongoose.Types.ObjectId(this.currentUser._id)
                    }
                }
        );
        const events = await this.getAllEvents()
        return events
    }

    /**
     * user leaving an event
     * @return {Object} allEvents
     */
    async leaveEvent() {
        const event = await models.EventModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(this.eventId), {
                $pull: {
                    attenders: mongoose.Types.ObjectId(this.currentUser._id)
                }
            }
        );
        const allEvents = await this.getAllEvents()
        return allEvents
    }

    /**
     * current user deleting an event he created
     * @return {Object} allEvents
     */
    async deleteEvent() {
        const event = await models.EventModel.findById(this.eventId)
        await models.EventModel.findByIdAndRemove(this.eventId)
        const allEvents = await this.getAllEvents()
        return allEvents

    }
}

module.exports = EventService;