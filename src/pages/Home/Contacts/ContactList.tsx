import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// type and utils
import { useTheme } from "../../../context/ThemeProvider";
import TextTranslate from "../../../utils/TextTranslate";
import { MyContactList } from "../../../types/SendMessageType";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

// components
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

// store
import { formatDate } from "../../../utils/formatUTCtoLocalDate";
import { useContactList } from "../../../store/api/useContactList";
import { useGroupSettings } from "../../../store/api/useGroupSettings";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { addOrRemoveUserId } from "../../../store/Slices/CreateGroupSlice";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";

export default function ContactList({ searchUser }: { searchUser: string }) {
  const navigate = useNavigate();
  // @ts-ignore
  const { theme } = useTheme();
  const location = useLocation();

  let {
    data: contactListUser,
    isLoading,
    refetch: refetchContactlist,
  } = useContactList({
    full_name: searchUser,
  });

  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let userData = useAppSelector((state) => state.userData);

  let { data: groupSettingsData } = useGroupSettings();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const ChatListArray = useAppSelector((state) => state.chatList);

  const dispatch = useAppDispatch();
  const [has_any_contacts, sethas_any_contacts] = useState(false);

  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  useEffect(() => {
    if (
      contactListUser?.myContactList?.length &&
      contactListUser?.myContactList?.filter(
        (contact) => userData.user_id != contact?.userDetails?.user_id,
      ).length > 0 && userData.user_id
    ) {
      sethas_any_contacts(true);
    }
  }, [contactListUser, userData.user_id]);

  function changeCurrentConversation(member: MyContactList) {
    if (member.userDetails.user_id == userData.user_id) return;

    let conversation_id =
      ChatListArray.find(
        (chatUser) => chatUser.user_id == member.userDetails.user_id,
      )?.conversation_id ?? 0;

    if (
      currentConversationData.conversation_id == conversation_id &&
      currentConversationData.conversation_id != 0
    ) return

    dispatch(removeMessageList());

    dispatch(
      updateCurrentConversation({
        conversation_id: conversation_id,
        is_group: false,
        group_name: "",
        group_profile_image: "",
        last_message: "",
        last_message_type: "",
        user_id: member.userDetails.user_id,
        user_name: member.full_name,
        phone_number: member.phone_number,
        email_id: member.userDetails.email_id,
        profile_image: member.userDetails.profile_image,
        is_block: false,
        public_group: false,
        createdAt: "",
        updatedAt: "",
      }),
    );
    refetchContactlist();
  }

  return (
    <div className="flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-20">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center gap-2">
          <Loader className="text-rose-500 animate-spin" size={18} />
          <span className="text-md text-rose-500"><TextTranslate text="Loading...." /></span>
        </div>
      ) : contactListUser?.myContactList?.filter(
        (contact) => userData.user_id != contact?.userDetails?.user_id,
      ).length == 0 ? (
        has_any_contacts ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div><TextTranslate text="No Contacts Found" /></div>
          </div>
        ) : (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/contact_not_found_light.png"
              alt=""
            />
            <div className="px-5 text-center">
              <TextTranslate text="Install the Whoxa mobile app first to sync your account and display your contacts here." />
            </div>
          </div>
        )
      ) : (
        contactListUser?.myContactList
          .filter(
            (contact) => userData.user_id !== contact?.userDetails?.user_id,
          )
          .sort((a, b) => {
            const nameA = a?.full_name?.toLowerCase() || "";
            const nameB = b?.full_name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          })
          .map((e) => {
            return (
              <div key={e.contact_id + 1}>
                <div
                  onClick={() => {
                    if (location.pathname == "/contact-list") {
                      changeCurrentConversation(e);
                      dispatch(
                        updateViewState({
                          show_chats_sidebar: false,
                        }),
                      );
                      return;
                    }

                    if (
                      CreateGroup.user_id.length >=
                      Number(groupSettingsData?.settings[0].max_members) &&
                      !CreateGroup.user_id.includes(e?.userDetails?.user_id)
                    ) {
                      toast.error(
                        `Max group memeber size is ${groupSettingsData?.settings[0].max_members}`,
                        { position: "bottom-left" },
                      );
                      return;
                    }
                    dispatch(
                      addOrRemoveUserId({
                        user_id: e.userDetails.user_id,
                      }),
                    );
                  }}
                  className={`flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${CreateGroup.user_id.includes(e?.userDetails?.user_id) && "bg-selectedChat"}`}
                >
                  <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                    {(() => {
                      const validUrl = getValidImageUrl(e?.userDetails?.profile_image);
                      const displayName = e?.full_name || e?.userDetails?.user_name || "";

                      if (validUrl) {
                        return (
                          <LoadingSkeletonImageDynamic
                            radius=""
                            className="min-h-12 min-w-12 rounded-full object-cover 2xl:h-12 2xl:w-12"
                            image_height="100%"
                            image_url={validUrl}
                            image_width=""
                          />
                        );
                      } else {
                        return (
                          <div
                            className={`h-14 w-14 2xl:h-12 2xl:w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${getAvatarColor(displayName)}`}
                          >
                            {getInitial(displayName)}
                          </div>
                        );
                      }
                    })()}
                    {OnlineUserList.onlineUserList.includes(
                      e?.userDetails?.user_id?.toString(),
                    ) && (
                        <span className="absolute bottom-0 right-0 z-30 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-base font-medium capitalize text-darkText">
                      {e?.full_name}
                    </div>

                    <div className="flex items-center gap-x-1">
                      <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
                        {/* {e?.userDetails?.user_name} 111 */}
                        {formatDate(e?.createdAt)}
                      </div>
                    </div>
                  </div>
                  {CreateGroup.user_id.includes(e?.userDetails?.user_id) && (
                    <div className="ml-auto grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
                      <img
                        className="h-5 w-5"
                        src="/Home/contact_selected.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <hr className="border-t border-borderColor" />
              </div>
            );
          })
      )}

      {location.pathname != "/contact-list" &&
        CreateGroup.user_id.length > 1 && (
          <div className="absolute bottom-10 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent lg:bottom-0">
            <div
              onClick={() => {
                navigate("/create-group");
              }}
              className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
            >
              <TextTranslate text="Next" />
            </div>
          </div>
        )}
    </div>
  );
}
