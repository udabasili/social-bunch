import { f } from "../../services/firebase";

export const markMessageRead = (notificationId) => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
        const { user } = getState();
		const userId = user.currentUser._id
        const notificationRef = f.database().ref('notifications').child(userId).child(notificationId)
        return notificationRef.update({
            textRead: true
        })
        .then((response) => {
            console.log(response)
        })
        .catch((err) => {
            throw err.message
        });
    }
};


export const addNotification = async (type, postId, owner, notificationAbout) => {
    if (notificationAbout._id) {

    }
	const notificationRef = f.database().ref('notifications').child(owner)
	return  notificationRef.push({
		type,
		postId,
		owner,
        textRead: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
		notificationAbout: {
			userId: notificationAbout._id,
			username: notificationAbout.username,
			userImage: notificationAbout.image
		}
	})
	

}

export const clearAllNotifications =  () => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
        try {
            const { user } = getState();
		    const userId = user.currentUser._id
            await f.database().ref('notifications').child(userId).remove()
        } catch (error) {
            throw error.message;
        }
        
    }
}