import { setCurrentUser } from "@/features/user/reducer/userSlice";
import { UserAttributes } from "@/features/user/types";
import { useAuth } from "@/lib/auth";
import { useAppDispatch } from "@/store";
import { getAuth, User } from "firebase/auth";
import { useState, useEffect } from "react";

export type UserProps = {
    uid: string
    displayName: string
    email: string
}

  
export default function useFirebaseAuth() {
    const [loading, setLoading] = useState(true); 
    const dispatch = useAppDispatch()   
    const auth = getAuth()
    const { loadUser } = useAuth()
  
    const authStateChanged = async (authState: User | null) => {
        setLoading(true)

      if (!authState) {
        dispatch(setCurrentUser({} as UserAttributes))
        setLoading(false)
        return;
      }

      const currentUser = await loadUser()

      
      if (authState && currentUser) {
        setCurrentUser(currentUser)
      }
      setLoading(false);
    };
  
  // listen for Firebase state change
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(authStateChanged);
      return () => unsubscribe();
    }, []);
  
    
    return {
      loading
    };
  }