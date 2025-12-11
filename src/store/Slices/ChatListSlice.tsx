import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatList } from "../../types/ChatListType";

const initialState: ChatList[] = [];

const ChatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    // Reducer to update the chatList
    updateChatList(state, action: PayloadAction<ChatList[]>) {
      return action.payload;
    },

    updateByConversationId(
      state,
      action: PayloadAction<{
        conversation_id: any;
        last_message: string;
        last_message_type: string;
      }>,
    ) {

      return state.map((conversation) => {
        if (conversation.conversation_id == action.payload.conversation_id) {
          return {
            ...conversation,
            last_message: action.payload.last_message,
            last_message_type: action.payload.last_message_type,
          };
        }
        return conversation;
      });
    },

    updateUnreadCountByConversationId(
      state,
      action: PayloadAction<{
        conversation_id: any;
      }>,
    ) {
      return state.map((conversation) => {

        if (
          Number(conversation.conversation_id) ==
          Number(action.payload.conversation_id)
        ) {
          return {
            ...conversation,
            unread_count: 0,
          };
        }
        return conversation;
      });
    },
  },
});

export default ChatListSlice.reducer;
export const {
  updateChatList,
  updateByConversationId,
  updateUnreadCountByConversationId,
} = ChatListSlice.actions;
