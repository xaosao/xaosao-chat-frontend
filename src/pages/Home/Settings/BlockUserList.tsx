import { useState } from "react";
import { ClipLoader } from "react-spinners";

// hooks and components
import useApiPost from "../../../hooks/PostData";
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useBlockUserList } from "../../../store/api/useBlockUserList";
import { updateForwardedList } from "../../../store/Slices/ForwardMessageSlice";
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
    "bg-rose-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500",
    "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-emerald-500",
    "bg-green-500", "bg-amber-500", "bg-orange-500", "bg-red-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Get first letter of name
const getInitial = (name: string): string => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

export default function BlockUserList() {
  const [selectedConversationId, setSelectedConversationId] = useState(0);
  // @ts-ignore
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useBlockUserList();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();

  async function unblockUser({ conversation_id }: { conversation_id: number }) {
    await postData("block-user", {
      conversation_id,
    });

    refetch();
  }

  return (
    <div className="my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : data?.blockUserList?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>
            <TextTranslate text="No blocked account" />
          </div>
        </div>
      ) : (
        data?.blockUserList?.map((e) => {
          return (
            <>
              <div
                className={`hover:bg-selectedChatdata flex cursor-pointer items-center justify-start px-3 py-4`}
              >
                <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                  {(() => {
                    const validUrl = getValidImageUrl(e?.Conversation?.BlockedUserDetails[0]?.profile_image || "");
                    const displayName = e?.Conversation?.BlockedUserDetails[0]?.user_name || "";

                    if (validUrl) {
                      return (
                        <LoadingSkeletonImageDynamic
                          radius=""
                          className="h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                          image_height="100%"
                          image_url={validUrl}
                          image_width=""
                        />
                      );
                    } else {
                      return (
                        <div className={`h-10 w-10 2xl:h-12 2xl:w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${getAvatarColor(displayName)}`}>
                          {getInitial(displayName)}
                        </div>
                      );
                    }
                  })()}
                  {OnlineUserList.onlineUserList.includes(
                    e.user_id.toString(),
                  ) && (
                      <span className="absolute bottom-0 right-0 z-30 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                </div>

                <div>
                  <div className="text-base font-medium capitalize text-darkText">
                    {e?.Conversation?.BlockedUserDetails[0]?.user_name}
                  </div>
                </div>

                <button
                  onClick={() => {
                    dispatch(
                      updateForwardedList({
                        conversation_id: e?.conversation_id,
                      }),
                    );
                    unblockUser({ conversation_id: e?.conversation_id });
                    setSelectedConversationId(e?.conversation_id);
                  }}
                  className={`relative ml-auto mr-3 h-9 w-28 overflow-hidden rounded-full border border-rose-500 px-4 text-sm font-medium outline-none`}
                >
                  {(loading || isLoading) &&
                    selectedConversationId == e?.conversation_id ? (
                    <ClipLoader
                      size={21}
                      color={theme == "dark" ? "white" : "black"}
                    />
                  ) : (
                    "Unblock"
                  )}
                </button>
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })
      )}
    </div>
  );
}
