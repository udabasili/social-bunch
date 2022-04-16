import { database } from "@/lib/fuego";
import { getAuth } from "firebase/auth";
import { ref, update } from "firebase/database";

export const markMessageRead = (notificationId: string) => {
        const auth = getAuth();
		const userId = auth.currentUser?.uid
        const notificationRef = ref(database, 'notifications/' + userId + notificationId)
        update(notificationRef,{
            textRead: true
        })
    
};
