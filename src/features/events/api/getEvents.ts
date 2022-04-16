import { useCollection, useDocument } from "swr-firestore-v9";
import { EventAttributes } from "../type";

export const UseGetEvents = (eventId?: string) => {

    const { data, error }  = useCollection<EventAttributes>(`events`)
    const eventRef = useDocument<EventAttributes>(eventId ?  `events/${eventId}`: null)

    return {
        error,
        events: data,
        eventItem: eventRef.data,
        eventItemLoading: !eventRef.data && !eventRef.error,
        isLoading: !error && !data
    }
    
}