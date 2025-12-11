import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";

import {
  setViewImage,
  toggleProfileView,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import TextTranslate from "../../../utils/TextTranslate";
import { TypingUserList } from "../../../types/OnlineUserType";
import { formatLastSeen } from "../../../utils/formatUTCtoLocalDate";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { resetCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";

// Helper function to fix image URL and check validity
const getValidImageUrl = (url: string): string | null => {
  if (!url) return null;

  let cleanUrl = url;
  if (url.includes("http://localhost:3000/https://")) {
    cleanUrl = url.replace("http://localhost:3000/", "");
  } else if (url.includes("http://localhost:3000/http://")) {
    cleanUrl = url.replace("http://localhost:3000/", "");
  }

  if (cleanUrl.includes("not-found-images") || cleanUrl.includes("profile-image.png")) {
    return null;
  }

  if (cleanUrl.startsWith("/uploads") || cleanUrl === "") {
    return null;
  }

  // Only accept URLs that are proper CDN URLs or have image extensions
  if (!cleanUrl.includes("b-cdn.net") && !cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return null;
  }

  return cleanUrl;
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

export default function Profile() {
  let dispatch = useAppDispatch();
  const [currentConversationTyping, setcurrentConversationTyping] =
    useState<TypingUserList[]>();
  let currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const userData = useAppSelector((state) => state.userData);
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  let UserLastSeenList = useAppSelector((state) => state.UserLastSeenList);
  let TypingUserList = useAppSelector((state) => state.TypingUserList);
  let { data: conversationInfo, isLoading } = useConversationInfo();
  // console.log(UserLastSeenList, "UserLastSeenList");

  useEffect(() => {
    setcurrentConversationTyping(
      TypingUserList.typingUserList.filter(
        (typing) =>
          typing.conversation_id ==
          currentConversationData.conversation_id.toString(),
      ),
    );
  }, [TypingUserList]);

  return (
    <div className="flex items-center sm:gap-2">
      {/* Back button ===========================================================*/}
      <IoChevronBack
        onClick={() => {
          dispatch(
            updateViewState({
              show_chats_sidebar: true,
            }),
          );
          dispatch(resetCurrentConversation());
        }}
        className="mr-2 flex w-fit cursor-pointer text-2xl lg:hidden"
      />

      {(() => {
        const imageUrl = currentConversationData.is_group
          ? currentConversationData.group_profile_image
          : currentConversationData.profile_image;
        const validUrl = getValidImageUrl(imageUrl);
        const displayName = currentConversationData.is_group
          ? currentConversationData.group_name
          : currentConversationData.user_name;

        if (validUrl) {
          return (
            <div
              onClick={() => {
                dispatch(
                  setViewImage({
                    show_image: true,
                    image_src: [validUrl],
                  }),
                );
              }}
              className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full 2xl:h-12 2xl:w-12"
            >
              <LoadingSkeletonImageDynamic
                radius=""
                className="h-10 w-10 object-cover 2xl:h-12 2xl:w-12"
                image_height="100%"
                image_url={validUrl}
                image_width=""
              />
            </div>
          );
        } else {
          return (
            <div
              className={`mr-3 h-10 w-10 2xl:h-12 2xl:w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg cursor-pointer ${getAvatarColor(displayName)}`}
            >
              {getInitial(displayName)}
            </div>
          );
        }
      })()}
      <div className="flex flex-col">
        <div
          onClick={() => {
            dispatch(toggleProfileView(true));
          }}
          className="cursor-pointer text-sm font-medium capitalize text-darkText sm:text-base"
        >
          {currentConversationData.is_group
            ? currentConversationData.group_name
            : currentConversationData.user_name}
        </div>

        {currentConversationData.is_group ? (
          <>
            {TypingUserList.typingUserList.filter(
              (typing) =>
                typing.conversation_id ==
                currentConversationData.conversation_id.toString(),
            ).length !== 0 ? (
              <div className="flex items-center">
                <div className="mr-2 text-xs text-[#FDD030] sm:text-sm">
                  {!isLoading &&
                    currentConversationTyping &&
                    currentConversationTyping.length > 0 && (
                      <>
                        {currentConversationTyping
                          .map((typingUser) => {
                            // Find the corresponding user details from conversationInfo
                            const user =
                              conversationInfo?.conversationDetails.ConversationsUsers.find(
                                (user) =>
                                  user.User.user_id.toString() ===
                                  typingUser.user_id,
                              );

                            // Return the user name if found, otherwise return a fallback
                            return user ? user.User.user_name : "Unknown User"; // Fallback in case user is not found
                          })
                          .join(", ")}{" "}
                        {currentConversationTyping.length > 1 ? "are" : "is"}{" "}
                        typing...
                      </>
                    )}
                </div>
                {/* <PulseLoader speedMultiplier={0.85} color="#FDD030" size={8} /> */}
              </div>
            ) : (
              <div className="line-clamp-1 text-xs text-lightText sm:text-sm">
                {(() => {
                  const members =
                    conversationInfo?.conversationDetails.ConversationsUsers ||
                    [];
                  const names = members.map((user) =>
                    user.User.user_id == userData.user_id
                      ? "You"
                      : user.User.first_name,
                  );
                  const maxVisible = 3;
                  const visibleNames = names.slice(0, maxVisible).join(", ");
                  const remainingCount = names.length - maxVisible;

                  return (
                    <>
                      {visibleNames}
                      {remainingCount > 0 && (
                        <span
                          onClick={() => {
                            dispatch(toggleProfileView(true));
                          }}
                          className="cursor-pointer text-darkText"
                        >
                          {` +${remainingCount} More`}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        ) : (
          <>
            {TypingUserList.typingUserList.filter(
              (typing) =>
                typing.conversation_id ==
                currentConversationData.conversation_id.toString(),
            ).length != 0 ? (
              <div className="flex items-center">
                <div className="mr-2 text-xs text-[#FDD030] sm:text-sm">
                  Typing...
                </div>
                {/* <PulseLoader speedMultiplier={0.85} color="#FDD030" size={8} /> */}
              </div>
            ) : (
              <>
                {OnlineUserList.onlineUserList.includes(
                  currentConversationData.user_id.toString(),
                ) ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="h-3 w-3 bg-emerald-500 rounded-full" />
                    <div>
                      <TextTranslate text="Online" />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-lightText sm:text-sm">
                    {formatLastSeen(
                      UserLastSeenList.lastSeenUserList.filter(
                        (user) =>
                          user.user_id == currentConversationData.user_id,
                      )[0]?.updatedAt,
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
