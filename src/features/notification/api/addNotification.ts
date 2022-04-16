import { database } from "@/lib/fuego";
import { generateId } from "@/utils/generateId";
import { getAuth } from "firebase/auth";
import { ref, remove, set } from "firebase/database";
import { NotificationDTO, NotificationProps } from "../types";

export const addNotification =  async (notification: NotificationDTO) => {        
    const notificationRef = ref(database, 'notifications/' + notification.owner)
	const id = generateId()

    set(notificationRef, {
		_id: id,
		type: notification.type,
		postId: notification.postId,
		owner: notification.owner,
        textRead: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
		notificationAbout: {
			uid: notification.notificationAbout.uid,
			username: notification.notificationAbout.username,
			image: notification.notificationAbout.image
		}
	})
	
} 

