import { ClipLoader } from "react-spinners";

// components
import MessageBody from "./MessageBody";
import MessageHeader from "./MessageHeader";
import EmptyMessageList from "./EmptyMessageList";
import SendMessage from "./SendMessage/SendMessage";
import IfUserBlocked from "./SendMessage/IfUserBlocked";
import SearchMessageDrawer from "../GroupInfo/SearchMessageDrawer";
import ConversationInfoDrawer from "../GroupInfo/ConversationInfoDrawer";
import IfGropIsBlockedByAdmin from "./SendMessage/IfGropIsBlockedByAdmin";
import DeleteSelectedMessage from "./SelectedMessageOption/DeleteSelectedMessage";
import ForwardSelectedMessage from "./SelectedMessageOption/ForwardSelectedMessage";

// utils and context:
import { useAppSelector } from "../../../utils/hooks";
import { useTheme } from "../../../context/ThemeProvider";
import { useConversationInfo } from "../../../store/api/useConversationInfo";

export default function MessageList() {
  const { theme } = useTheme();
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  let { data: conversationInfo } = useConversationInfo();
  let ChatListArray = useAppSelector((state) => state.chatList);

  return (
    <>
      <MessageHeader />
      {MessageOptions.isMessageLoading ? (
        <div className="flex h-[83dvh] flex-col items-center justify-center gap-y-2 overflow-y-auto px-14 pb-0 lg:py-6">
          <ClipLoader color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : (
        <>
          {MessageListArray.length === 0 ||
            (currentConversationData.public_group &&
              !ChatListArray.some(
                (chatUser) =>
                  chatUser.conversation_id ===
                  currentConversationData.conversation_id,
              )) ? (
            <EmptyMessageList />
          ) : (
            <MessageBody />
          )}
        </>
      )}

      <ConversationInfoDrawer />
      <SearchMessageDrawer />

      {MessageOptions.selectMessage ? (
        MessageOptions.delete_message ? (
          <DeleteSelectedMessage />
        ) : MessageOptions.forward_message ? (
          <ForwardSelectedMessage />
        ) : (
          <SendMessage />
        )
      ) : currentConversationData.is_block ? (
        <IfUserBlocked />
      ) : conversationInfo?.conversationDetails.blocked_by_admin ? (
        <IfGropIsBlockedByAdmin />
      ) : (
        <SendMessage />
      )}
    </>
  );
}
