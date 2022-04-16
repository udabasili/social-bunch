import { useEffect, useState } from "react";
import { ReactComponent as AppIcon } from "@/assets/icons/instagram.svg";
import { BiHomeAlt } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { database } from "@/lib/fuego";
import { onValue, ref } from "firebase/database";
import clsx from "clsx";
import { useAuth } from "@/lib/auth";
import UserNotification from "../Notifications/UserNotification";

type NavigationProps = {};
export function Navigation(props: NavigationProps) {
  const { currentUser } = useAuth();

  const [unReadCount, setUnReadCount] = useState(0);


  useEffect(() => {
    const messageRef = ref(database, "messages/");
    let currentUserMessageIds = [];
    onValue(messageRef, (snapshot) => {
      let unReadMessagesLength: number = 0;
        const exists = snapshot.val() !== null;
        let messages = snapshot.val();
        if (exists) {
            const objKeys = Object.keys(messages)
            currentUserMessageIds = objKeys.filter(item => item.includes(currentUser.uid))
            let eachUnreadMessage = []
            currentUserMessageIds.forEach((id) => {
                let message = messages[id]
                for (let key in message) {
                    if (message[key].createdBy !== currentUser.uid && !message[key].read) {
                            eachUnreadMessage.push(message[key])
                    }
                } 
                unReadMessagesLength = eachUnreadMessage.length + unReadMessagesLength
                
            })
            setUnReadCount(unReadMessagesLength)
        
        }
    })
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="navigation">
      <nav className="navigation--left">
        <div className="app">
          <AppIcon />
          <span>SB</span>
        </div>
        <ul className="nav__list">
          <li className="nav__item ">
            <NavLink
              className={({ isActive }) =>
                clsx("nav__link", !isActive ? " " : "nav-active")
              }
              to="/"
            >
              <BiHomeAlt className="navigation__icon" />
            </NavLink>
          </li>
          <li className="nav__item nav__item--1">
            <NavLink
              title="messages"
              className={({ isActive }) =>
                clsx("nav__link", !isActive ? " " : "nav-active")
              }
              to="/messages"
            >
              <TiMessages className="navigation__icon" />
            </NavLink>
            {unReadCount > 0 && (
              <span className="notification-count">{unReadCount}</span>
            )}
          </li>
          {/* <li className="nav__item nav__item--1">
            <BsBell className="navigation__icon" />
            {unReadCount > 0 && (
              <span className="notification-count">{unReadCount}</span>
            )}
            <NotificationDropdown
              title="Notification"
              notifications={notifications}
              footer="Clear All"
            />
          </li> */}
        </ul>
      </nav>
      <input className="navigation__input" id="nav-toggle" type="checkbox" />
      <label className="navigation__button" htmlFor="nav-toggle">
        <span className="navigation__button-icon">&nbsp;</span>
      </label>
      <div className="navigation--right">
        <div className="user">
          <div className="user-icon">
            <img alt={currentUser.username} src={currentUser.image} />
          </div>
          <p className="user-name">{currentUser.username}</p>
          <UserNotification currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
