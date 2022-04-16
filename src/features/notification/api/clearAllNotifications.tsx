import { database } from "@/lib/fuego";
import { getAuth } from "firebase/auth";
import { ref, remove } from "firebase/database";

export const clearAllNotifications =  async () => {        
    const auth = getAuth()
    const userId = auth?.currentUser?.uid as string
    await remove(ref(database, 'notifications/' + userId))  
} 