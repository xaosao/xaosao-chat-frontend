import toast from "react-hot-toast";
import { BsReply } from "react-icons/bs";
import { LuTrash2 } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { RiArrowGoForwardLine } from "react-icons/ri";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";


import {
  addMessage,
  updateMessageOptions,
} from "../../../../store/Slices/MessageOptionsSlice";
import PinMessageButton from "./PinMessageButton";
import useApiPost from "../../../../hooks/PostData";
import { MessageList } from "../../../../types/MessageListType";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateIsStarMessage } from "../../../../store/Slices/MessageListSlice";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { useStarMessageList } from "../../../../store/api/useStarMessageList";
import { useTranslateText } from "../../../../hooks/useTranslateText";

export default function SelectedMessageOption({
  messageData,
}: {
  messageData: MessageList;
}) {
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const userData = useAppSelector((state) => state.userData);
  const { postData } = useApiPost();
  const { refetch } = useStarMessageList();
  const translate = useTranslateText();

  async function starMessage(message_id: number, remove_from_star: boolean) {
    await postData("add-to-star-message", {
      conversation_id: currentConversation.conversation_id,
      message_id: String(message_id),
      remove_from_star: String(remove_from_star),
    });

    // Refetch the star message ==================================================================================
    refetch();
    toast.success(
      `Message  ${remove_from_star ? "removed from" : "added to"} star  `,
    );

    dispatch(
      updateIsStarMessage({
        message_id,
        is_star_message: remove_from_star ? false : true,
      }),
    );
  }

  return (
    <>
      <div
        className={`relative text-darkText ${messageData.myMessage ? "" : "text-darkText"} `}
      >
        <Menu>
          <MenuButton
            onClick={(event) => {
              event.stopPropagation(); // Prevents the parent onClick event
              // setSelectedConversation(e);
            }}
            className="items-center font-semibold shadow-2xl focus:outline-none data-[focus]:outline-0"
          >
            <IoIosArrowDown className="cursor-pointer text-xl text-white" />
          </MenuButton>

          <MenuItems
            transition
            anchor={messageData.myMessage ? "bottom end" : "bottom start"}
            className="z-10 w-52 origin-top-right rounded-xl border border-borderColor bg-modalBg p-1 text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <button
                onClick={() => {
                  dispatch(
                    updateMessageOptions({
                      selectMessage: true,
                      delete_message: true,
                      // show only delete from button if message is allready deleted ======================================================
                      delete_only_from_me:
                        messageData.delete_from_everyone ||
                          messageData.delete_for_me
                            .split(",")
                            .includes(userData.user_id.toString()) ||
                          !messageData.myMessage
                          ? true
                          : false,
                    }),
                  );
                  dispatch(addMessage(messageData));
                }}
                className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-1.5 data-[focus]:bg-dropdownOptionHover"
              >
                <span>{translate("Delete")}</span>
                <LuTrash2 className="text-xl" />
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() =>
                  messageData.is_star_message
                    ? starMessage(messageData.message_id, true)
                    : starMessage(messageData.message_id, false)
                }
                className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-1.5 data-[focus]:bg-dropdownOptionHover"
              >
                <span>
                  {translate(messageData.is_star_message ? "Unstar" : "Star")}
                </span>
                <FaRegStar className="text-xl" />
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => {
                  dispatch(
                    updateSendMessageData({
                      reply_id: messageData.message_id,
                    }),
                  );
                }}
                className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-1.5 data-[focus]:bg-dropdownOptionHover"
              >
                <span>{translate("Reply")}</span>
                <BsReply className="text-xl" />
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => {
                  dispatch(
                    updateMessageOptions({
                      selectMessage: true,
                      forward_message: true,
                    }),
                  );
                  dispatch(addMessage(messageData));
                }}
                className="group flex w-full items-center justify-between gap-2 rounded-lg px-4 py-1.5 data-[focus]:bg-dropdownOptionHover"
              >
                <span>{translate("Forward")}</span>
                <RiArrowGoForwardLine className="text-xl" />
              </button>
            </MenuItem>
            <MenuItem>
              <button className="data-[focus]:bg-dropdownOptionHover rounded-lg w-full">
                <PinMessageButton messageData={messageData} />
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </>
  );
}
