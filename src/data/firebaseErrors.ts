interface IFirebaseErrors {
    [x: string]: string
}
export const firebaseErrors: IFirebaseErrors = {
    "auth/wrong-password": "The Email or Password is invalid",
    "auth/user-not-found": "This email has not be registered. Create a new account",
    "auth/email-already-in-use": "This email is already being used. Click login to reset your password",
    "auth/invalid-verification-code": "The OTP you put in was invalid",
    "auth/account-exists-with-different-credential": "This phone is already registered",
    "auth/provider-already-linked": "This account already has a phone number attached"
}