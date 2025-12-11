import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList, PollVote } from "../../types/MessageListType";

// Define the initial state with an empty MessageList
const initialState: MessageList[] = [];

// Create a slice of the state
const MessageListSlice = createSlice({
  name: "MessageList",
  initialState,
  reducers: {
    updateMessageList(state, action: PayloadAction<MessageList[]>) {
      return [...action.payload, ...state];
    },
    removeMessageList() {
      return [];
    },

    removeMessagesByIds(state, action: PayloadAction<number[]>) {
      return state.filter(
        (message) => !action.payload.includes(message.message_id),
      );
    },
    updatePollVote(
      state,
      action: PayloadAction<{
        message_id: number;
        user_id: number;
        new_option_id: number;
      }>,
    ) {
      const { message_id, user_id, new_option_id } = action.payload;

      return state.map((message) => {
        if (message.message_id !== message_id) return message;

        return {
          ...message,
          pollData: message.pollData.map((pollOption) => {
            const pollOptionData = JSON.parse(JSON.stringify(pollOption)); // Deep copy
            return {
              ...pollOptionData,
              PollVotes:
                pollOptionData.poll_option_id === new_option_id
                  ? [
                    ...pollOptionData.PollVotes,
                    { user_id, updatedAt: new Date().toISOString() },
                  ]
                  : pollOptionData.PollVotes.filter(
                    (vote: PollVote) => vote.user_id !== user_id,
                  ),
            };
          }),
        };
      });
    },

    updateMessagesByIds(
      state,
      action: PayloadAction<{
        message_id: number;
        message: string;
        delete_from_everyone: boolean;
        user_id?: string;
      }>,
    ) {
      return state.map((message) => {
        if (message.message_id === action.payload.message_id) {
          return {
            ...message,
            message: action.payload.message,
            delete_for_me: action.payload.user_id || message.delete_for_me,
            delete_from_everyone: action.payload.delete_from_everyone,
          };
        }
        return message;
      });
    },
    updateMessagesReadStatusByIds(
      state,
      action: PayloadAction<{
        message_id: number;
      }>,
    ) {
      return state.map((message) => {
        if (message.message_id == action.payload.message_id) {
          return {
            ...message,
            message_read: 1,
          };
        }
        return message;
      });
    },

    updateIsStarMessage(
      state,
      action: PayloadAction<{ message_id: number; is_star_message: boolean }>,
    ) {
      const { message_id, is_star_message } = action.payload;
      const message = state.find((msg) => msg.message_id == message_id);

      if (message) {
        message.is_star_message = is_star_message;
      }
    },

    appendMessageWithDateCheck(state, action: PayloadAction<MessageList>) {
      state.push(action.payload);
    },

    updateReaction(
      state,
      action: PayloadAction<{
        message_id: number;
        user_id: number;
        reaction: string;
      }>,
    ) {
      const { message_id, user_id, reaction } = action.payload;

      const message = state.find((m) => m.message_id === message_id);
      if (!message) return;

      const existingReaction = message.reactionData.find(
        (r) => r.user_id === user_id,
      );

      if (existingReaction) {
        existingReaction.reaction = reaction;
      } else {
        message.reactionData.push({
          reaction_id: Date.now(),
          user_id,
          reaction,
          message_id,
        });
      }
    },



  },
});

export default MessageListSlice.reducer;
export const {
  updateMessageList,
  removeMessagesByIds,
  appendMessageWithDateCheck,
  removeMessageList,
  updateIsStarMessage,
  updateMessagesByIds,
  updateMessagesReadStatusByIds,
  updatePollVote,
  updateReaction,
} = MessageListSlice.actions;
