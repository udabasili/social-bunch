import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export type LoginCredentialsDTO = {
    email: string,
    password: string
}

export async function loginWithEmailAndPassword(userData: LoginCredentialsDTO): Promise<string> {
    const auth = getAuth();
    const { user } = await signInWithEmailAndPassword(
        auth,
        userData.email.trim(),
        userData.password
    )
    return user.uid

}

