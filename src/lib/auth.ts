import { RegisterCredentialsDTO, registerWithEmailAndPassword } from '@/features/auth/api/register';
import { useAppDispatch, useAppSelector } from '@/store';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from './fuego';
import { AxiosError } from 'axios';
import { clearError, setError } from '@/features/error/reducer/errorSlice';
import { FirebaseError } from 'firebase/app';
import { firebaseErrors } from '@/data/firebaseErrors';
import { setCurrentUser } from '@/features/user/reducer/userSlice';
import { LoginCredentialsDTO, loginWithEmailAndPassword } from '@/features/auth';
import { UserAttributes, UserInfoDTO } from '@/features/user/types';
import { getAuth } from 'firebase/auth';
import { useDocument } from 'swr-firestore-v9';
import { useEffect } from 'react';


export const useAuth = () => {

    const dispatch = useAppDispatch()
    const authenticated = useAppSelector((state) => state.user.authenticated);
	const currentUser = useAppSelector((state) => state.user.currentUser as UserAttributes & UserInfoDTO);
    const auth = getAuth()
    const { data, isValidating } = useDocument<UserAttributes>(currentUser.uid ? `users/${currentUser.uid}`: null, { listen: true })

    useEffect(() => {
      
        if (data) {
            dispatch(setCurrentUser({
                ...data
            } ))
        } 
      return () => {
        
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    
    
    async function registerFn(data: RegisterCredentialsDTO) {
        try {
            dispatch(clearError());
            const uid = await registerWithEmailAndPassword(data);
            const currentUser = {
                uid,
                email: data.email,
                username: data.username,
                friends: [],
                posts: [],
                notifications: [],
                fullAuthenticated: false,
                nextRoute: 'image'
            }
            await setDoc(doc(db, 'users', uid), {
                ...currentUser
            });
            dispatch(setCurrentUser(currentUser));
            
    
        } catch (error) {
            let errorMessage = ''
            const errorObject = error as AxiosError;
            if (errorObject.name === 'FirebaseError'){
                errorMessage = firebaseErrors[(error as FirebaseError).code]
            } else if (errorObject.isAxiosError) {
				errorMessage = errorObject.response?.data.message
			} else  {
                errorMessage = errorObject.message
            }
			dispatch(setError(errorMessage));
            throw error

        }
    }

    async function loadUser() {
		try {
            dispatch(clearError());
            const docRef = doc(db, 'users', auth?.currentUser?.uid || '');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data() as UserAttributes
                dispatch(setCurrentUser(userData ))
                return userData
            } 
		} catch (error) {
			console.error(error);
		}
	}

    async function loginFn(loginData: LoginCredentialsDTO): Promise<UserAttributes | undefined> {
        try {
            dispatch(clearError());
            const userId = await loginWithEmailAndPassword(loginData);
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data() as UserAttributes
                dispatch(setCurrentUser(userData ))
                return userData
            } 
            else {
                throw new Error('User not found')
            }

    
        } catch (error) {
            let errorMessage = ''
            const errorObject = error as AxiosError;
            if (errorObject.name === 'FirebaseError'){
                errorMessage = firebaseErrors[(error as FirebaseError).code]
            } else if (errorObject.isAxiosError) {
				errorMessage = errorObject.response?.data.message
			} else  {
                errorMessage = errorObject.message
            }
			dispatch(setError(errorMessage));
            throw error
        }
    }

    return {
        registerFn, 
        loginFn,
        authenticated,
        currentUser,
        loadUser
    }
}

