import { toast } from 'react-toastify';
import { f } from "../../services/firebase";

export const createEvent = (eventRecord) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        const { user } = getState();
        const userId = user.currentUser._id;
        let attenders = [];
        attenders.push(userId)
        const data = {
            eventName: eventRecord.EventName,
            description: eventRecord.EventDescription,
            date: eventRecord.EventDate,
            time: eventRecord.EventTime,
            category: eventRecord.EventCategory,
            createdBy: userId,
            attenders,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return firestore.collection('events').add({
            ...data
        })
        .then((response)=>{                   
            return response
        })
        .catch((error)=>{
            toast.error(error.message)
            throw error.message
        }
        )
    }
}


export const joinEvent = (eventId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const { user } = getState();
        const userId = user.currentUser._id   
        const firestore = getFirestore();
        const eventsRef = firestore.collection('events').doc(eventId);
        return eventsRef.update({
            attenders: f.firestore.FieldValue.arrayUnion(userId)
        })
        .then((response)=>{                   
            return response;
        })
        .catch((error)=>{
            toast.error(error.message)
        })
    }
}

export const leaveEvent = (eventId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const { user } = getState();
        const userId = user.currentUser._id   
        const firestore = getFirestore();
        const eventsRef = firestore.collection('events').doc(eventId);
        return eventsRef.update({
            attenders: f.firestore.FieldValue.arrayRemove(userId)
        })
        .then((response)=>{        
            return response           
        })
        .catch((error)=>{
            toast.error(error.message)
        })
    }
}

export const deleteEvent = (eventId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		return firestore.collection('events').doc(eventId).delete()
		.then((response) => {
            return response
		})
        .catch((error)=>{
            toast.error(error.message)
        })
    }
}
