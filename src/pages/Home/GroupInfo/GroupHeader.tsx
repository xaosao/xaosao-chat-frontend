import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

// icons:
import { MdCheck } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { setViewImage } from "../../../store/Slices/ViewManagerSlice";

// utils and context:
import useApiPost from "../../../hooks/PostData";
import { useFile } from "../../../context/FileProvider";
import { UpdateGroupRes } from "../../../types/ResType";
import { socketInstance } from "../../../socket/socket";
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";

export default function GroupHeader() {
  const theme = useTheme()
  let { data } = useConversationInfo();
  const { setSelectedFile } = useFile();
  const [selectedFileUrl, setSelectedFileUrl] = useState("");
  const { postData } = useApiPost();
  let dispatch = useAppDispatch();
  const [editGroup, setEditGroup] = useState(false);
  const [group_name, setGroup_name] = useState(
    data?.conversationDetails?.group_name,
  );

  useEffect(() => {
    setGroup_name(data?.conversationDetails.group_name);
  }, [data?.conversationDetails.group_name]);

  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    const files = event.target.files![0];
    if (!files) return;
    setSelectedFile(files);
    setSelectedFileUrl(URL.createObjectURL(files));

    let editGroupFormData = new FormData();

    editGroupFormData.append(
      "conversation_id",
      currentConversationData.conversation_id.toString(),
    );
    editGroupFormData.append("files", files!);
    // Make the API call with the constructed FormData
    let updateGroupProfile: UpdateGroupRes = await postData(
      "create-group",
      editGroupFormData,
      "multipart/form-data",
    );

    if (updateGroupProfile.success == true) {
      toast.success("Group Profile Updated", { position: "top-right" });
      dispatch(
        updateCurrentConversation({
          group_profile_image:
            updateGroupProfile.conversationDetails.group_profile_image,
        }),
      );
      socketInstance().emit("ChatList", {});
    }
  };

  async function updateGroupName() {
    let updateGroupProfile: UpdateGroupRes = await postData(
      "create-group",
      {
        conversation_id: currentConversationData.conversation_id,
        group_name: group_name,
      },
      "multipart/form-data",
    );

    if (updateGroupProfile.success == true) {
      toast.success("Group Name Updated", { position: "top-right" });
      dispatch(
        updateCurrentConversation({
          group_name: updateGroupProfile.conversationDetails.group_name,
        }),
      );
      socketInstance().emit("ChatList", {});
    }
  }

  return (
    <>
      <div
        style={{
          backgroundSize: "100%",
        }}
        className={`mb-4 h-80 w-full space-y-5 ${theme.theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#F1F1F1]"} bg-no-repeat xl:space-y-7`}
      >
        <div className="flex items-center gap-3 px-3 pt-16 font-semibold text-black 2xl:pt-16">
          <div className="py-2"></div>
        </div>

        <div className="grid place-content-center gap-y-2 text-center">
          <div className="mx-auto  rounded-full bg-primary p-2 h-36 w-36">
            <div className="relative">
              <LoadingSkeletonImageDynamic
                radius=""
                className={`mx-auto cursor-pointer rounded-full bg-secondary object-cover min-h-32 min-w-32`}
                image_height=""
                image_url={
                  data?.conversationDetails.is_group == true
                    ? selectedFileUrl ||
                    data?.conversationDetails.group_profile_image
                    : data?.conversationDetails.ConversationsUsers[0].User
                      .profile_image! || currentConversationData.profile_image
                }
                image_width=""
                onClickFunc={() => {
                  dispatch(
                    setViewImage({
                      show_image: true,
                      image_src: [
                        currentConversationData.is_group
                          ? currentConversationData.group_profile_image
                          : currentConversationData.profile_image,
                      ],
                    }),
                  );
                }}
              />
              <input
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
                type="file"
                id="groupPhotoEdit"
              />
              {data?.conversationDetails.is_group == true && (
                <label
                  htmlFor="groupPhotoEdit"
                  className="absolute bottom-0 right-0 z-30 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-primary"
                >
                  <BiEditAlt className="primary-gradient rounded-full p-1 text-2xl" />
                </label>
              )}
            </div>
          </div>

          <div className="flex">
            <input
              onChange={(e) => {
                setGroup_name(e.target.value);
              }}
              disabled={editGroup ? false : true}
              type="text"
              className="bg-transparent text-center text-lg font-semibold outline-none"
              value={
                data?.conversationDetails.is_group
                  ? group_name
                  : data?.conversationDetails.ConversationsUsers[0].User
                    .user_name! || currentConversationData.user_name
              }
            />

            {data?.conversationDetails.is_group == true && (
              <>
                {editGroup ? (
                  <MdCheck
                    onClick={() => {
                      setEditGroup(false);
                      updateGroupName();
                    }}
                    className="cursor-pointer p-1 text-2xl"
                  />
                ) : (
                  <BiEditAlt
                    onClick={() => {
                      setEditGroup(true);
                    }}
                    className="cursor-pointer p-1 text-2xl"
                  />
                )}
              </>
            )}
          </div>

          <span className="flex items-center justify-center gap-2 font-sans text-sm font-medium text-[#808080] pb-4">
            {data?.conversationDetails.is_group ? (
              <>
                <TextTranslate text="Group" /> <GoDotFill />{" "}
                {data?.conversationDetails.ConversationsUsers.length}{" "}
                <TextTranslate text="Members" />
              </>
            ) : (
              <>
                {
                  data?.conversationDetails.ConversationsUsers[0].User
                    .country_code
                }
                xxxxxxxxxx
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
