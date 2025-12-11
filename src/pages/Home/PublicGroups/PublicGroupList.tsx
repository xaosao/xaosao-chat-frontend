import { ClipLoader } from "react-spinners";

import { AllPublicGroup } from "../../../types/ResType";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { usePublicGroupList } from "../../../store/api/usePublicGroupList";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";

export default function PublicGroupList({
  searchUser,
}: {
  searchUser: string;
}) {
  let {
    data: publicGroupList,
    isLoading,
  } = usePublicGroupList({
    group_name: searchUser,
  });

  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  // @ts-ignore
  const { theme } = useTheme();

  function changeCurrentConversation(group: AllPublicGroup) {
    if (group.conversation_id == currentConversationData.conversation_id) {
      return;
    }

    dispatch(
      updateCurrentConversation({
        conversation_id: group.conversation_id,
        is_group: true,
        group_name: group.group_name,
        group_profile_image: group.group_profile_image,
        last_message: "",
        last_message_type: "",
        user_id: 0,
        user_name: "",
        phone_number: "",
        profile_image: "",
        is_block: false,
        createdAt: "",
        updatedAt: "",
        public_group: true,
      }),
    );
    dispatch(removeMessageList());
  }

  return (
    <div className="my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-20">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : publicGroupList?.allPublicGroup?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Public group found</div>
        </div>
      ) : (
        publicGroupList?.allPublicGroup
          .sort((a, b) => {
            const nameA = a?.group_name?.toLowerCase() || "";
            const nameB = b?.group_name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          })
          .map((e) => {
            return (
              <div key={e.conversation_id}>
                <div
                  onClick={() => {
                    changeCurrentConversation(e);
                  }}
                  className={`flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${false && "bg-selectedChat"}`}
                >
                  <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                    <LoadingSkeletonImageDynamic
                      radius=""
                      className="min-h-12 min-w-12 rounded-full object-cover 2xl:h-12 2xl:w-12"
                      image_height="100%"
                      image_url={e?.group_profile_image}
                      image_width=""
                    />
                  </div>

                  <div>
                    <div className="text-base font-medium capitalize text-darkText">
                      {e?.group_name}
                    </div>
                  </div>
                </div>
                <hr className="border-t border-borderColor" />
              </div>
            );
          })
      )}
    </div>
  );
}
