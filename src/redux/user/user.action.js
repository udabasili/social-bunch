import { SET_CURRENT_USER } from "../actionType";
import { toast } from "react-toastify";
import { auth, f } from "../../services/firebase";

export const setCurrentUser = (user) =>({
    type: SET_CURRENT_USER,
    payload: user
})

const upload = async (firebase, data, userId) => {
    const uploadRef = firebase.storage().ref(`/users/${userId}`)
    const imageUrl = new Promise((resolve, reject) => {
        const uploadTask = uploadRef.put(data)
        uploadTask.on('state_changed', (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Progress: ", progress)
            },
            reject,
            async () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(url => {
                        resolve(url);
                    });
            });
    })
    return imageUrl
}

export function login(userData) {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        return auth.signInWithEmailAndPassword(
            userData.email.trim(),
            userData.password
        )
        .then(async (res) => {
            const userId = res.user.uid
            const userRef = firestore.collection('users').doc(userId)
            const data = await userRef.get()
            if (data.exists) {
                const userData = data.data();
                dispatch(setCurrentUser(userData))
            }
            return userData
        })
        .catch((error) => {
            toast.error(error.message)
            throw error.message
        })
    }
}

export const signUp = (data) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        return auth.createUserWithEmailAndPassword(
            data.email.trim(),
            data.password
        )
        .then(async (res) => {
            delete data.password;
            delete data.confirmPassword;
            let userId = res.user.uid;
            const currentUser = {
                _id: userId,
                ...data,
                friends: [],
                posts: [],
                notifications: [],
                fullAuthenticated: false
            }
            await firestore.collection('users').doc(userId).set({
                ...currentUser
            })
            dispatch(setCurrentUser(currentUser))
            return res
        })
        .catch((error) =>{
            toast.error(error.message)
            throw error.message
        })
    }
}

export const uploadImage = (data, userId) => {
        return async (dispatch, getState, { getFirebase, getFirestore}) => {
        const firebase = getFirebase()
        const firestore = getFirestore()
        const userRef = firestore.collection('users').doc(userId);
        const imageUrl = await upload(firebase, data, userId)
        return  userRef.update({
            image: imageUrl,
            fullAuthenticated: false,
            nextRoute: 'user-info'
        }).then(async (res) => {
            const data = await firestore
                .collection("users")
                .doc(userId)
                .get()
            if (data.exists) {
                const userData = data.data();
                dispatch(setCurrentUser(userData))
            }
            return res
        }).catch((error) => {
            toast.error(error.message)
            throw error.message
        })
        
            
    }
}

export const addFriend = (friendId) => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
    const firestore = getFirestore()
    const { user } = getState();
    const userId = user.currentUser._id
    const currentUser = firestore.collection('users').doc(userId)
    const friend = firestore.collection('users').doc(friendId)
    console.log(friendId, userId)
    await currentUser.update({
        friends: f.firestore.FieldValue.arrayUnion(friendId)
    })
    return friend.update({
        friends: f.firestore.FieldValue.arrayUnion(userId)
    })
    .then(async (res) => {
        const userRef = firestore.collection('users').doc(userId)
        const data = await userRef.get()
        if (data.exists) {
            const userData = data.data();
            dispatch(setCurrentUser(userData))
            toast.success('Friend Added')
        }
        return res
    })
    .catch((error) => {
        toast.error(error.message)
        throw error.message
        })
    }
}

export const removeFriend = (friendId) => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
        const firestore = getFirestore()
        const { user } = getState();
        const userId = user.currentUser._id
        const currentUser = firestore.collection('users').doc(userId)
        const friend = firestore.collection('users').doc(friendId)
        await currentUser.update({
            friends: f.firestore.FieldValue.arrayRemove(friendId)
        })
        return friend.update({
            friends: f.firestore.FieldValue.arrayRemove(userId)
        })
        .then(async (res) => {
            const userRef = firestore.collection('users').doc(userId)
            const data = await userRef.get()
            if (data.exists) {
                const userData = data.data();
                dispatch(setCurrentUser(userData))
                toast.success('Friend Removed')
            }
            return res
        })
        .catch((error) => {
            toast.error(error.message)
            throw error.message
        })
    }
}


export function editUser(userData, userId) {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore()
        const userRef = firestore.collection('users').doc(userId)
        return userRef
            .update({ 
                ...userData ,
                fullAuthenticated: true,
                nextRoute: ''
            })
            .then(async (res) => {  
                const data = await userRef.get()
                if (data.exists) {
                    const userData = data.data();
                    dispatch(setCurrentUser(userData))
                }
                return res
            })
            .catch((error)=>{                    
                toast.error(error.message)
                throw error.message
        })
    }
}

export const logOut = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        return new Promise((resolve, reject) => {
            const firebase = getFirebase()
            const { user } = getState();
            const userId = user.currentUser._id
            firebase.auth().signOut()
                .then(async () => {
                    await f.database().ref("presence").child(userId).remove()
                    localStorage.clear()
                    sessionStorage.clear()
                    dispatch(setCurrentUser({}))
                    return resolve()
                })
                .catch((error) => {
                    return reject(error.message)
                })
        })
    }
}

