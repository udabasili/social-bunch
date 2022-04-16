import { getAuth, signOut } from "firebase/auth";

export function logout() {
    const auth = getAuth();
    return signOut(auth)
}