import { protectedRoutes } from "./protected"
import { useLocation, useRoutes } from 'react-router-dom';
import { useAuth } from "@/lib/auth";
import { publicRoutes } from "./public";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearError } from "@/features/error/reducer/errorSlice";
import { checkOnlineStatus } from "@/features/message/api/checkOnlineStatus";

export const AppRoutes = () => {
    
    let location = useLocation();
    const dispatch = useAppDispatch()
    const error = useAppSelector((state) => state.error.error);
    const { authenticated } = useAuth()


    useEffect(() => {
        if (error) {
            console.log(error)
            dispatch(clearError())   
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
      if (authenticated) {
        checkOnlineStatus()
      }
    
      
    }, [authenticated])
    
    
    const routes = authenticated ? protectedRoutes : publicRoutes
    const elements = useRoutes([...routes])
    return <>{elements}</>
    
}