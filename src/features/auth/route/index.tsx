import { useAuth } from "@/lib/auth";
import { useAppSelector } from "@/store";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Layout } from "../components/Layout";
import { authenticationStep } from "../type";
import { ImageUpload } from "./ImageUpload";
import { Start } from "./Start";
import UserInfo from "./UserInfo";

type Props = {
  setAuthenticationStep: (e: authenticationStep) => void;
  authChangeHandler: (e: "login" | "register") => void;
};

type ComponentsProps = {
  [x: string]: FC<Props>;
};

export const Auth = () => {

  const { currentUser } = useAuth()
  const [authenticationStep, setAuthenticationStep] = useState<authenticationStep>(() => setCurrentAuthenticationStep());
  const [authType, setAuthType] = useState<"login" | "register">("login");

  console.log(setCurrentAuthenticationStep())

  function setCurrentAuthenticationStep (): string {
      return currentUser.nextRoute || 'start'
  }

  const error = useAppSelector((state) => state.error.error);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  function authChangeHandler(type: "login" | "register") {
    const authCover = document.querySelector<HTMLElement>(".auth__cover");
    const login = document.querySelector<HTMLElement>(".login");
    const register = document.querySelector<HTMLElement>(".register");
    if (authCover && login && register) {
      if (type === "register") {
        authCover.style.left = "0";
        authCover.style.right = "unset";
        login.style.display = "none";
        register.style.display = "flex";
      } else {
        authCover.style.right = "0";
        authCover.style.left = "unset";
        register.style.display = "none";
        login.style.display = "flex";
      }
    }
    setAuthType(type);
  }

  const COMPONENT_MAP: ComponentsProps = {
    image: ImageUpload,
    start: Start,
    userInfo: UserInfo,
  };

  const Component = COMPONENT_MAP[authenticationStep];

  return (
    <Layout>
      <Component
        setAuthenticationStep={setAuthenticationStep}
        authChangeHandler={authChangeHandler}
      />
    </Layout>
  );
};
