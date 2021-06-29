import { toast } from 'react-toastify';
import { f } from "../../services/firebase";

export const createGroup = (groupRecord) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const { user } = getState();
        const firestore = getFirestore();
        const userId = user.currentUser._id
        let members = [];
        members.push(userId)
        const groupData = {
            groupName: groupRecord.GroupName,
            description: groupRecord.GroupDescription,
            imageUrl: groupRecord.imageUrl,
            category: groupRecord.GroupCategory,
            createdAt: new Date(),
            createdBy: userId,
            members,
            updatedAt: new Date()
        }
        return firestore.collection('groups').add({
            ...groupData
        })
        .then((response)=>{                   
            return;
        })
        .catch((error)=>{
            toast.error(error.message)
            throw error.message
        })
    }
}

export const joinGroup = (groupId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const { user } = getState();
        const userId = user.currentUser._id   
        const firestore = getFirestore();
        const groupsRef = firestore.collection('groups').doc(groupId);
        return groupsRef.update({
            members: f.firestore.FieldValue.arrayUnion(userId)
        })
        .then((response)=>{                   
            return;
        })
        .catch((error)=>{
            toast.error(error.message)
        })
    }
}

export const leaveGroup = (groupId) => {
     return (dispatch, getState, { getFirebase, getFirestore }) => {
        const { user } = getState();
        const userId = user.currentUser._id   
        const firestore = getFirestore();
        const groupsRef = firestore.collection('groups').doc(groupId);
        console.log(userId, groupId)
        return groupsRef.update({
            members: f.firestore.FieldValue.arrayRemove(userId)
        })
        .then((response)=>{      
            return             
        })
        .catch((error)=>{
            toast.error(error.message)
        })
     }
}

export const deleteGroup = (groupId) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		return firestore.collection('groups').doc(groupId).delete()
		.then((response) => {
            return response
		})
        .catch((error)=>{
            toast.error(error.message)
        })
    }
}
