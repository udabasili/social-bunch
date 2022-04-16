import React from "react";
import { authenticationStep } from "../type";
import Login from "./Login";
import Register from "./Register";

type StartProps = {
  setAuthenticationStep: (e: authenticationStep) => void
  authChangeHandler: (e: "login" | "register") => void
}

export const Start = ({
  setAuthenticationStep,
  authChangeHandler
}: StartProps) => {
  return (
    <React.Fragment>
      <Login
        authChangeHandler={authChangeHandler}
        setAuthenticationStep={setAuthenticationStep}
      />
      <Register
        authChangeHandler={authChangeHandler}
        setAuthenticationStep={setAuthenticationStep}
      />
    </React.Fragment>
  );
};
