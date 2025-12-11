import { NavLink, useLocation } from "react-router-dom";

// utils and context
import { useAppDispatch } from "../../utils/hooks";
import TextTranslate from "../../utils/TextTranslate";
import { useTheme } from "../../context/ThemeProvider";
import { updateViewState } from "../../store/Slices/ViewManagerSlice";
import { resetCurrentConversation } from "../../store/Slices/CurrentConversationSlice";
import { MessageCircleMore, Search, Settings, Users } from "lucide-react";

export default function Bottombar() {
  // @ts-ignore
  const { theme } = useTheme();
  let dispatch = useAppDispatch();
  let location = useLocation();

  return (
    <div
      onClick={() => {
        dispatch(updateViewState({ show_chats_sidebar: true }));
        dispatch(resetCurrentConversation());
      }}
      className="border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-between bg-primary py-3 lg:hidden px-4"
    >
      <NavLink to={"/"} className="flex items-center justify-center cursor-pointer flex-col space-y-1">
        <Search size={16} />
        <p className={`text-sm`}>
          <TextTranslate text="Discover" />
        </p>
      </NavLink>
      <NavLink to={"/chat"} className="flex items-center justify-center cursor-pointer flex-col space-y-1">
        <MessageCircleMore size={16} className={`${location.pathname === "/chat" ? "text-rose-500" : "text-gray-700"}`} />
        <p className={`text-sm ${location.pathname === "/chat" ? "text-rose-500" : "text-gray-700"}`}>
          <TextTranslate text="Chats" />
        </p>
      </NavLink>
      <NavLink to={"/contact-list"} className="flex items-center justify-center flex-col cursor-pointer space-y-1">
        <Users size={16} className={`${location.pathname === "/contact-list" ? "text-rose-500" : "text-gray-700"}`} />
        <p className={`text-sm ${location.pathname === "/contact-list" ? "text-rose-500" : "text-gray-700"}`}>
          <TextTranslate text="Contacts" />
        </p>
      </NavLink>
      <NavLink to={"/setting"} className="flex items-center justify-center flex-col cursor-pointer space-y-1">
        <Settings size={16} className={`${location.pathname === "/settings" ? "text-rose-500" : "text-gray-700"}`} />
        <p className={`text-sm ${location.pathname === "/setting" ? "text-rose-500" : "text-gray-700"}`}>
          <TextTranslate text="Setting" />
        </p>
      </NavLink>
    </div>
  );
}
