import * as React from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { fuego } from "@/lib/fuego";
import { FuegoProvider } from "swr-firestore-v9";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import FirebaseAuthState from "@/features/auth/components/FirebaseAuthState";

type AppProviderProps = {
  children: React.ReactNode;
};


export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <FullScreenLoader />
        </div>
      }
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <FirebaseAuthState>
          <FuegoProvider fuego={fuego}>
            <Router> {children}</Router>
          </FuegoProvider>
          </FirebaseAuthState>
          
        </PersistGate>
      </Provider>
    </React.Suspense>
  );
};
