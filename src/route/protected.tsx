import { FullScreenLoader } from "@/components/FullScreenLoader";
import { lazyImport } from "@/utils/lazyImport";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const { ChatRoute } = lazyImport(() => import("@/features/chat/route"),"ChatRoute");
const { Homepage } = lazyImport(() => import("@/features/misc"),"Homepage");
const { GroupPage } = lazyImport(() => import("@/features/groups/route"),"GroupPage");
const { EventPage } = lazyImport(() => import("@/features/events/route"),"EventPage");
const { UserPage } = lazyImport(() => import("@/features/users/routes"),"UserPage");
const { MessagePage } = lazyImport(() => import("@/features/message/route"),"MessagePage");
const { UserProfile } = lazyImport(() => import("@/features/user/route/userProfile"),"UserProfile");




const App = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/chat/*", element: <ChatRoute /> },
      { path: "/groups/*", element: <GroupPage /> },
      { path: "/events/*", element: <EventPage /> },
      { path: "/users/*", element: <UserPage /> },
      { path: "/messages/*", element: <MessagePage /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/", element: <Homepage /> },
      { path: "*", element: <Navigate to='.' /> },

    ],
  },
];
