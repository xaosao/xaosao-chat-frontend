import { useTranslation } from "react-i18next";

// Mapping from old text keys to new i18next keys
const textKeyMap: Record<string, string> = {
  "My Chats": "chat.myChats",
  "Search User": "chat.searchUser",
  "Archived": "chat.archived",
  "Back to chat": "chat.backToChat",
  "Archive Chat": "chat.archiveChat",
  "Unarchive Chat": "chat.unarchiveChat",
  "Delete Chat": "chat.deleteChat",
  "Start New Chat": "chat.startNewChat",
  "Start a new chat with your favorite one and": "chat.startNewChatMessage",
  "make every moment count.": "chat.makeEveryMoment",
  "Type Message": "chat.typeMessage",
  "Online": "chat.online",
  "Offline": "chat.offline",
  "No Conversations Found": "chat.noConversationsFound",
  "You don't have any conversation with": "chat.noConversationWith",
  "Find on contact list": "chat.findOnContactList",
  "Loading....": "chat.loading",
  "Image": "chat.image",
  "Gif": "chat.gif",
  "Video": "chat.video",
  "Audio": "chat.audio",
  "Location": "chat.location",
  "Contact": "chat.contact",
  "Poll": "chat.poll",
  "Block": "chat.block",
  "Unblock": "chat.unblock",
  "Conversation Archived": "chat.conversationArchived",
  "Conversation Deleted!": "chat.conversationDeleted",
  "Contact Lists": "contacts.contactLists",
  "Contact Details": "contacts.contactDetails",
  "Non Changeable": "contacts.nonChangeable",
  "Next": "contacts.next",
  "No Contacts Found": "contacts.noContactsFound",
  "Install the Whoxa mobile app first to sync your account and display your contacts here.": "contacts.syncMessage",
  "Call History": "calls.callHistory",
  "Video Call": "calls.videoCall",
  "Audio Call": "calls.audioCall",
  "Call is Decliend": "calls.callDeclined",
  "Accept the call to get started discussion": "calls.acceptCall",
  "All Calls": "calls.allCalls",
  "Missed Call": "calls.missedCall",
  "No Calls Found": "calls.noCallsFound",
  "No Calls found": "calls.noCallsFound",
  "No Missed Calls found": "calls.noMissedCallsFound",
  "Settings": "settings.settings",
  "Profile": "settings.profile",
  "Starred Messages": "settings.starredMessages",
  "Block Contacts": "settings.blockContacts",
  "Share a link": "settings.shareLink",
  "Language": "settings.language",
  "Blocked account": "settings.blockedAccount",
  "No blocked account": "settings.noBlockedAccount",
  "About": "settings.about",
  "Currently set to": "settings.currentlySetTo",
  "Select your about": "settings.selectYourAbout",
  "Public Groups": "groups.publicGroups",
  "Add Group Members": "groups.addGroupMembers",
  "Members": "groups.members",
  "Out Of": "groups.outOf",
  "View Profile": "profile.viewProfile",
  "Contact Info": "profile.contactInfo",
  "Media, Links, and docs": "profile.mediaLinksAndDocs",
  "Clear Chat": "profile.clearChat",
  "No Media Found!": "media.noMediaFound",
  "No Links Found": "media.noLinksFound",
  "Document": "media.document",
  "No nearby places found": "location.noNearbyPlaces",
  "Create Poll": "poll.createPoll",
  "Add Title": "poll.addTitle",
  "Enter poll question": "poll.enterPollQuestion",
  "Add Options": "poll.addOptions",
  "Option": "poll.option",
  "Poll Votes": "poll.pollVotes",
  "Title": "poll.title",
  "Options": "poll.options",
  "Cancel": "common.cancel",
  "Submit": "common.submit",
  "Close": "common.close",
  "Logout": "common.logout",
  "Are you sure you want to logout?": "common.logoutConfirm",
  "Are you sure you want to logout this account from this Device": "common.logoutDeviceConfirm",
  "Delete for me": "common.deleteForMe",
  "Discover": "bottom_bar.discover",
  "Match": "bottom_bar.match",
  "Chats": "bottom_bar.chats",
  "Contacts": "bottom_bar.contacts",
  "Setting": "bottom_bar.setting"
};

const TextTranslate: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation();

  // Check if we have a mapped key for this text
  const i18nKey = textKeyMap[text];

  if (i18nKey) {
    return <>{t(i18nKey)}</>;
  }

  // Return original text if no mapping found
  return <>{text}</>;
};

export default TextTranslate;
