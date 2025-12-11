import { configureStore } from "@reduxjs/toolkit";

import UserSlice from "./Slices/UserSlice";
import PollSlice from "./Slices/PollSlice";
import PeerJsSlice from "./Slices/PeerJsSlice";
import StatusSlice from "./Slices/StatusSlice";
import ChatListSlice from "./Slices/ChatListSlice";
import CallDataSlice from "./Slices/CallDataSlice";
import AddStatusSlice from "./Slices/AddStatusSlice";
import OnlineUserSlice from "./Slices/OnlineUserSlice";
import PinMessagesSlice from "./Slices/PinMessagesSlice";
import ViewManagerSlice from "./Slices/ViewManagerSlice";
import MessageListSlice from "./Slices/MessageListSlice";
import SendMessageSlice from "./Slices/SendMessageSlice";
import CreateGroupSlice from "./Slices/CreateGroupSlice";
import ArchiveListSlice from "./Slices/ArchiveListSlice";
import UserLastSeenSlice from "./Slices/UserLastSeenSlice";
import ConnectedUserSlice from "./Slices/ConnectedUserSlice";
import SearchMessageSlice from "./Slices/SearchMessageSlice";
import TypingUserListSlice from "./Slices/TypingUserListSlice";
import MessageOptionsSlice from "./Slices/MessageOptionsSlice";
import ForwardMessageSlice from "./Slices/ForwardMessageSlice";
import MeetingScheduleSlice from "./Slices/MeetingScheduleSlice";
import LanguageTextListSlice from "./Slices/LanguageTextListSlice";
import CurrentConversationSlice from "./Slices/CurrentConversationSlice";
import SelectedGroupMemberSlice from "./Slices/SelectedGroupMemberSlice";
import NavigateToSpesificMessageSlice from "./Slices/NavigateToSpesificMessageSlice";

// Create the Redux store
export const store = configureStore({
  reducer: {
    // Add reducers here
    userData: UserSlice,
    ViewManager: ViewManagerSlice,
    MessageOptions: MessageOptionsSlice,
    meetingSchedule: MeetingScheduleSlice,
    chatList: ChatListSlice,
    archiveList: ArchiveListSlice,
    MessageList: MessageListSlice,
    CurrentConversation: CurrentConversationSlice,
    SendMessageData: SendMessageSlice,
    UserLastSeenList: UserLastSeenSlice,
    OnlineUserList: OnlineUserSlice,
    ConnectedUser: ConnectedUserSlice,
    TypingUserList: TypingUserListSlice,
    CreateGroup: CreateGroupSlice,
    SelectedGroupMember: SelectedGroupMemberSlice,
    SearchMessage: SearchMessageSlice,
    ForwardMessage: ForwardMessageSlice,
    NavigateToSpesificMessage: NavigateToSpesificMessageSlice,
    LanguageTextList: LanguageTextListSlice,
    PeerJsSlice: PeerJsSlice,
    PollData: PollSlice,
    CallData: CallDataSlice,
    status: StatusSlice,
    addStatus: AddStatusSlice,
    PinMessages: PinMessagesSlice,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
