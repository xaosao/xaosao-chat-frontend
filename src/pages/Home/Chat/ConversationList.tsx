import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuProvider,
} from "../../../components/ContextMenu";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { CgPoll } from "react-icons/cg";
import { PulseLoader } from "react-spinners";
import { BsCameraVideo } from "react-icons/bs";
import { AiOutlineAudio } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoImageOutline, IoLocationOutline } from "react-icons/io5";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

// utils:
import TextTranslate from "../../../utils/TextTranslate";
import chatSidebarTime from "../../../utils/chatSidebarTime";
import { truncateSentence } from "../../../utils/truncateSentence";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

// Type:
import { BlockUserRes } from "../../../types/ResType";
import { ChatList } from "../../../types/ChatListType";

// Socket.io:
import { socketInstance } from "../../../socket/socket";

// Redux or store:
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { updateSendMessageData } from "../../../store/Slices/SendMessageSlice";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import { updateSearchMessageResult } from "../../../store/Slices/SearchMessageSlice";
import { updateUnreadCountByConversationId } from "../../../store/Slices/ChatListSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";

// hooks:
import useApiPost from "../../../hooks/PostData";

// components:
import { useTheme } from "../../../context/ThemeProvider";
import CallInConversationList from "./CallInConversationList";
import { useChatList } from "../../../store/api/useChatList";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";

// Helper function to fix image URL and check validity
const getValidImageUrl = (url: string): string | null => {
  if (!url) return null;

  // Remove localhost prefix if URL contains CDN link
  let cleanUrl = url;
  if (url.includes("http://localhost:3000/https://")) {
    cleanUrl = url.replace("http://localhost:3000/", "");
  } else if (url.includes("http://localhost:3000/http://")) {
    cleanUrl = url.replace("http://localhost:3000/", "");
  }

  // Check if it's the default not-found image
  if (cleanUrl.includes("not-found-images") || cleanUrl.includes("profile-image.png")) {
    return null;
  }

  // If it's a relative path starting with /uploads, it's likely invalid or default
  if (cleanUrl.startsWith("/uploads") || cleanUrl === "") {
    return null;
  }

  // Accept any URL that starts with http/https (valid external URL)
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return null;
};

// Generate consistent color based on username
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-rose-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-teal-500",
    "bg-emerald-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-red-500",
  ];

  // Create a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Get first letter of name
const getInitial = (name: string): string => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

export default function ConversationList({
  searchUser,
}: {
  searchUser: string;
}) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();

  const ChatListArray = useAppSelector((state) => state.chatList);
  const OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const TypingUserList = useAppSelector((state) => state.TypingUserList);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );


  let {
    // data: chatList,
    isLoading,
  } = useChatList({
    full_name: searchUser,
  });

  const [SelectedConversation, setSelectedConversation] = useState<ChatList>();

  async function blockUser() {
    let blockUserResponse: BlockUserRes = await postData("block-user", {
      conversation_id: SelectedConversation?.conversation_id,
    });
    if (
      SelectedConversation?.conversation_id ==
      currentConversationData.conversation_id
    ) {
      dispatch(
        updateCurrentConversation({ is_block: blockUserResponse.is_block }),
      );
    }
    socketInstance().emit("ChatList", {});
  }

  async function archiveConversation() {
    await postData("add-to-archive", {
      conversation_id: SelectedConversation?.conversation_id,
    });

    socketInstance().emit("ChatList", {});
    toast.success("Conversation Archived", { position: "bottom-left" });
  }

  async function deleteConversation() {
    await postData("delete-chatlist", {
      conversation_id: SelectedConversation?.conversation_id,
    });

    if (
      currentConversationData.conversation_id ==
      SelectedConversation?.conversation_id
    ) {
      dispatch(removeMessageList());
      dispatch(
        updateCurrentConversation({
          conversation_id: -1,
          group_name: "",
          group_profile_image: "",
          profile_image: "",
          user_id: 0,
          is_group: false,
        }),
      );
    }
    socketInstance().emit("ChatList", {});
    toast.success("Conversation Deleted!", { position: "bottom-left" });
  }

  const handleBlockContextMenu = (e: ChatList) => {
    e;
  };

  const filteredChats = ChatListArray.filter(
    (chat) =>
      chat.user_name.toLowerCase().includes(searchUser.toLowerCase()) ||
      chat.group_name.toLowerCase().includes(searchUser.toLowerCase()),
  );

  return (
    <ContextMenuProvider>
      <div className="flex h-[75vh] w-full flex-col overflow-y-auto overflow-x-hidden lg:max-w-md">
        {isLoading ?
          <div className="w-full h-full flex items-center justify-center gap-2">
            <Loader className="text-rose-500 animate-spin" size={18} />
            <span className="text-md text-rose-500"><TextTranslate text="Loading...." /></span>
          </div>
          : ChatListArray.length === 0 ? (
            <div className="grid h-96 place-content-center gap-5">
              <img
                className="mx-auto h-16 w-16"
                src="/LightIcons/no_search_result_found.png"
                alt=""
              />
              <div><TextTranslate text="No Conversations Found" /></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="grid h-96 place-content-center gap-5">
              <img
                className="mx-auto h-10 w-10"
                src="/LightIcons/no_search_result_found.png"
                alt=""
              />
              <div><TextTranslate text="You don't have any conversation with" /> {searchUser}</div>
              <a
                type="submit"
                className="text-center px-4 py-2 bg-rose-500 text-white rounded-md shadow-sm"
                href={`/contact-list?id=${searchUser}`}
              >
                <TextTranslate text="Find on contact list" />
              </a>
            </div>
          ) : (
            filteredChats.map((e) => (
              <div key={e.conversation_id} className="px-4">
                <ContextMenuTrigger id="my-context-menu-1">
                  <div
                    onClick={() => {
                      if (
                        currentConversationData.conversation_id !=
                        e.conversation_id
                      ) {
                        // To Update current conversation
                        dispatch(updateCurrentConversation(e));
                        sessionStorage.setItem(
                          "currentConversation",
                          JSON.stringify(e),
                        );

                        // Update
                        dispatch(
                          updateUnreadCountByConversationId({
                            conversation_id: e.conversation_id,
                          }),
                        );

                        // To clear the previous conversation messages
                        dispatch(removeMessageList());

                        // To clear search message for spesific conversation
                        dispatch(updateSearchMessageResult([]));

                        // To hide the contact info sidebar
                        dispatch(updateViewState({ showSearchMessage: false }));
                        // Clear Reply messag design

                        dispatch(
                          updateSendMessageData({
                            reply_id: 0,
                          }),
                        );

                        // Hide Selected file
                        // Remove selected files
                        // setSelectedFile(null);
                        dispatch(
                          updateMessageOptions({
                            show_forward_message_modal: false,
                            selectMessage: false,
                            forward_message: false,
                            message_list: [],
                          }),
                        );

                        dispatch(
                          updateViewState({
                            show_chats_sidebar: false,
                          }),
                        );
                      }
                    }}
                    onContextMenu={() => {
                      handleBlockContextMenu(e);
                      setSelectedConversation(e);
                    }}
                    className={`group flex cursor-pointer items-center px-3 py-4 rounded-xl ${currentConversationData.conversation_id == e.conversation_id ? theme === "dark" ? "border border-gray-500" : "bg-rose-50 border border-rose-500" : ""}`}
                  >
                    <div className="relative mr-3 h-12 w-12">
                      {(() => {
                        const imageUrl = e.is_group ? e.group_profile_image : e.profile_image;
                        const validUrl = getValidImageUrl(imageUrl);
                        const displayName = e.is_group ? e.group_name : e.user_name;

                        if (validUrl) {
                          return (
                            <LoadingSkeletonImageDynamic
                              radius=""
                              className="h-12 w-12 rounded-full object-cover"
                              image_height="100%"
                              image_url={validUrl}
                              image_width=""
                            />
                          );
                        } else {
                          return (
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${getAvatarColor(displayName)}`}
                            >
                              {getInitial(displayName)}
                            </div>
                          );
                        }
                      })()}
                      {!e.is_group &&
                        OnlineUserList.onlineUserList.includes(
                          e.user_id.toString(),
                        ) && (
                          <span className="absolute bottom-0 right-0 z-30 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                    </div>
                    <div className="min-w-44 sm:min-w-52 2xl:min-w-60">
                      <div className={`line-clamp-1 text-base font-medium capitalize ${currentConversationData.conversation_id == e.conversation_id ? theme === "dark" ? "text-white" : "" : ""}`}>
                        {truncateSentence(
                          e.is_group ? e.group_name : e.user_name,
                          32,
                        )}
                      </div>

                      <div className="flex items-center gap-x-1">
                        <div className="line-clamp-1 flex w-full gap-x-1 text-[13px] text-lightText">
                          <>
                            {TypingUserList.typingUserList.filter(
                              (typing) =>
                                typing.conversation_id ==
                                e.conversation_id.toString(),
                            ).length != 0 ? (
                              <div className="flex items-center">
                                <PulseLoader
                                  speedMultiplier={0.85}
                                  color="#FDD030"
                                  size={8}
                                />
                              </div>
                            ) : (
                              <>
                                {e.last_message_type == "image" ? (
                                  <>
                                    <IoImageOutline className="fa fa-solid fa-image w-5 text-xl text-gray-500" />{" "}
                                    Image
                                  </>
                                ) : e.last_message_type == "gif" ? (
                                  <>
                                    😈
                                    <div>Gif</div>
                                  </>
                                ) : e.last_message_type == "video" ? (
                                  <>
                                    <BsCameraVideo className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                    Video
                                  </>
                                ) : e.last_message_type == "audio" ? (
                                  <>
                                    <AiOutlineAudio className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                    Audio
                                  </>
                                ) : e.last_message_type == "document" ? (
                                  <>
                                    <HiOutlineDocumentText className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                    Document
                                  </>
                                ) : e.last_message_type == "location" ? (
                                  <>
                                    <IoLocationOutline className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                    Location
                                  </>
                                ) : e.last_message_type == "text" ? (
                                  <span className="w-full">
                                    {truncateSentence(e.last_message, 32)}
                                  </span>
                                ) : e.last_message_type == "link" ? (
                                  <>
                                    <span>🔗</span>
                                    <span className="line-clamp-1 w-full">
                                      {truncateSentence(e.last_message, 32)}
                                    </span>
                                  </>
                                ) : e.last_message_type == "contact" ? (
                                  <>
                                    <RiContactsLine />
                                    <span className="line-clamp-1">
                                      Contact
                                    </span>
                                  </>
                                ) : e.last_message_type == "poll" ? (
                                  <>
                                    <CgPoll className="text-xl" />
                                    <span className="line-clamp-1">Poll</span>
                                  </>
                                ) : e.last_message_type == "video_call" ||
                                  e.last_message_type == "audio_call" ? (
                                  <>
                                    <CallInConversationList messageData={e} />
                                  </>
                                ) : (
                                  <>{e.last_message}</>
                                )}
                              </>
                            )}
                          </>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto grid h-full grid-cols-1 place-content-start gap-y-2 text-center">
                      <div className="min-w-[5.5rem] text-xs text-lightText">
                        {chatSidebarTime(e.updatedAt)}
                      </div>
                      <div className="mx-auto flex w-fit gap-1">
                        {e.unread_count >= 1 ? (
                          <div className="primary-gradient z-10 mx-auto grid h-5 w-5 place-content-center rounded-full text-xs text-white">
                            {e.unread_count}
                          </div>
                        ) : (
                          <>
                            <div className="h-5 w-5"></div>
                          </>
                        )}
                        <Menu>
                          <MenuButton
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedConversation(e);
                            }}
                            className="items-center font-semibold shadow-2xl focus:outline-none data-[focus]:outline-0"
                          >
                            <IoIosArrowDown className={`${theme === "dark" ? "text-white" : ""} cursor-pointer text-xl`} />
                          </MenuButton>

                          <MenuItems
                            transition
                            anchor="bottom end"
                            className="z-10 w-52 origin-top-right rounded-xl border border-borderColor bg-modalBg p-1 text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                          >
                            <MenuItem>
                              <button
                                onClick={() => {
                                  archiveConversation();
                                }}
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                              >
                                <TextTranslate text="Archive Chat" />
                              </button>
                            </MenuItem>
                            <MenuItem>
                              <button
                                onClick={() => {
                                  deleteConversation();
                                }}
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                              >
                                <TextTranslate text="Delete Chat" />
                              </button>
                            </MenuItem>

                            {!e.is_group && (
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    blockUser();
                                  }}
                                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                                >
                                  <TextTranslate
                                    text={e.is_block ? "Unblock" : "Block"}
                                  />
                                </button>
                              </MenuItem>
                            )}
                          </MenuItems>
                        </Menu>
                      </div>
                    </div>
                  </div>
                  <hr className="border-t border-borderColor" />
                </ContextMenuTrigger>
              </div>
            ))
          )}
      </div >

      {
        SelectedConversation?.is_group ? (
          <ContextMenu id="my-context-menu-1" className="!rounded-xl !bg-modalBg" >
            <ContextMenuItem
              onClick={() => {
                archiveConversation();
              }}
              className="hover:!bg-dropdownOptionHover"
            >
              <TextTranslate text="Archive Chat" />
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                deleteConversation();
              }}
              className="hover:!bg-dropdownOptionHover"
            >
              <TextTranslate text="Delete Chat" />
            </ContextMenuItem>
          </ContextMenu>
        ) : (
          <ContextMenu id="my-context-menu-1" className="!rounded-xl !bg-modalBg">
            <ContextMenuItem
              onClick={() => {
                archiveConversation();
              }}
              className="hover:!bg-dropdownOptionHover"
            >
              <TextTranslate text="Archive Chat" />
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                deleteConversation();
              }}
              className="hover:!bg-dropdownOptionHover"
            >
              <TextTranslate text="Delete Chat" />
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                blockUser();
              }}
              className="hover:!bg-dropdownOptionHover"
            >
              <TextTranslate
                text={SelectedConversation?.is_block ? "Unblock" : "Block"}
              />
            </ContextMenuItem>
          </ContextMenu>
        )
      }
    </ContextMenuProvider>
  );
}
