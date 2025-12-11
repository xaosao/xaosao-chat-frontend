import { Outlet } from "react-router-dom";

// components:
import Sidebar from "./Sidebar";
import MessageList from "./MessageList/MessageList";
import EmptyChatScreen from "./Chat/EmptyChatScreen";

// utils and context:
import Bottombar from "./Bottombar";
import { useAppSelector } from "../../utils/hooks";
import { useTheme } from "../../context/ThemeProvider";
import OnClickOutside from "../../utils/OnClickOutSide";

export default function Home() {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const ViewManager = useAppSelector((state) => state.ViewManager);

  // @ts-ignore
  const { theme } = useTheme();
  return (
    <>
      <div className="relative flex w-screen">
        <Sidebar />
        <div
          className={`fixed left-0 top-0 z-10 h-[100dvh] w-full min-w-[25rem] transition-all duration-500 lg:relative lg:h-auto lg:min-h-max lg:w-fit lg:max-w-fit lg:pt-0 lg:transition-none ${ViewManager.show_chats_sidebar ? "translate-x-0" : "-translate-x-[100%] lg:translate-x-0"}`}
        >
          <Outlet />
        </div>
        <div
          className="grid h-[100dvh] w-full"
        >
          <div
            className={`${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"
              } relative h-full bg-opacity-[0.98]`}
          >
            <OnClickOutside
              className="h-full"
              onClickOutside={() => {
              }}
            >
              {currentConversationData.conversation_id == -1 ? (
                <div>
                  <EmptyChatScreen />
                </div>
              ) : (
                <MessageList />
              )}
            </OnClickOutside>
          </div>
        </div>
        {currentConversationData.conversation_id === -1 && <Bottombar />}
      </div>
    </>
  );
}
