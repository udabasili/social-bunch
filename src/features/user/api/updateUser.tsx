import { firebaseErrors } from "@/data/firebaseErrors";
import { setError } from "@/features/error/reducer/errorSlice";
import { useAuth } from "@/lib/auth";
import { useAppDispatch } from "@/store";
import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";
import { useDocument } from "swr-firestore-v9";
import { UserAttributes, UserInfoDTO } from "../types";

export const useUpdateUser = () => {
  const { currentUser } = useAuth();
  const dispatch = useAppDispatch();
  const { update } = useDocument<UserAttributes>(`users/${currentUser.uid}`);

  async function updateUserFn(userInfo: UserInfoDTO) {
    try {
      await update({
        ...userInfo,
        fullAuthenticated: true,
        nextRoute: "",
      });
    } catch (error) {
      let errorMessage = "";
      const errorObject = error as AxiosError;
      if (errorObject.name === "FirebaseError") {
        errorMessage = firebaseErrors[(error as FirebaseError).code];
      } else if (errorObject.isAxiosError) {
        errorMessage = errorObject.response?.data.message;
      } else {
        errorMessage = errorObject.message;
      }
      dispatch(setError(errorMessage));
      throw error;
    }
  }

  return {
    updateUserFn,
  };
};
