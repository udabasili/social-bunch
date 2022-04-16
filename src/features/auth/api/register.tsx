import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { string } from "yup";

export type RegisterCredentialsDTO = {
    email: string,
    password: string,
    username: string,
    confirmPassword?: string
}

export  const registerWithEmailAndPassword = async (userData: RegisterCredentialsDTO): Promise<string> => {
    const auth = getAuth();
    const {user} = await  createUserWithEmailAndPassword(
        auth,
        userData.email.trim(),
        userData.password
    )
    return user.uid

}