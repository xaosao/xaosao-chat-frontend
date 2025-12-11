// @ts-nocheck
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// components
import ThemeToggleButton from "./ThemeToggle";
import LogoutModal from "./Settings/LogOutModal";

// utils and context
import { useAppDispatch } from "../../utils/hooks";
import { useTheme } from "../../context/ThemeProvider";
import { removeMessageList } from "../../store/Slices/MessageListSlice";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";
import { ChartPie, LogOut, MessageSquareText, Phone, Settings, UserRound, Users } from "lucide-react";
import { resetCurrentConversation } from "../../store/Slices/CurrentConversationSlice";

export default function Sidebar() {
  const { theme } = useTheme();
  let dispatch = useAppDispatch();
  let location = useLocation();
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  let { data: websiteSettings } = useWebsiteSettings();

  return (
    <>
      <div className="fixed hidden h-screen min-w-24 flex-col justify-between bg-primary py-6 text-darkText shadow-xl lg:flex 2xl:min-w-28">
        <div
          className="bgGradient flex flex-col items-center gap-7"
          onClick={() => {
            dispatch(resetCurrentConversation());
          }}
        >
          <NavLink to={"/chat"} className="cursor-pointer" >
            <MessageSquareText size={18} className={`${location.pathname === "/chat" ? "text-rose-500" : ""}`} />
          </NavLink>
          <NavLink to={"/contact-list"} className="cursor-pointer">
            <Users size={18} className={`${location.pathname === "/contact-list" ? "text-rose-500" : ""}`} />
          </NavLink>
          <NavLink to={"/setting"} className="cursor-pointer">
            <Settings size={18} className={`${location.pathname === "/setting" ? "text-rose-500" : ""}`} />
          </NavLink>
        </div>
      </div>
      <div className="hidden min-w-24 lg:flex 2xl:min-w-28"></div>
    </>
  );
}
