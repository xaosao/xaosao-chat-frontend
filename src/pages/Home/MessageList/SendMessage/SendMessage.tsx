import toast from "react-hot-toast";
import { VscSend } from "react-icons/vsc";
import { ClipLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useScrollToBottom } from "react-scroll-to-bottom";

//  coontext and store:
import { useFile } from "../../../../context/FileProvider";
import { useTheme } from "../../../../context/ThemeProvider";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { appendMessageWithDateCheck } from "../../../../store/Slices/MessageListSlice";

// utils and hooks:
import useApiPost from "../../../../hooks/PostData";
import base64ToFile from "../../../../utils/base64ToFile";
import scrollToMessage from "../../../../utils/scrollToMessage";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";

// components:
import SelectFile from "./SelectFile";
import ShowSelectedFile from "./ShowSelectedFile";
import EmojiPickerCompo from "./EmojiPickerCompo";
import { socketInstance } from "../../../../socket/socket";
import { MessageList } from "../../../../types/MessageListType";
import SelectedReplyMessage from "../ReplyMessage/SelectedReplyMessage";

// Store and Redux:
import {
  updateViewState,
} from "../../../../store/Slices/ViewManagerSlice";
import { useConversationInfo } from "../../../../store/api/useConversationInfo";
import { updateCurrentConversation } from "../../../../store/Slices/CurrentConversationSlice";
import { Loader } from "lucide-react";

export default function SendMessage() {
  // @ts-ignore
  const { theme } = useTheme();
  const messageData = useAppSelector((state) => state.SendMessageData);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isStoppedTyping, setIsStoppedTyping] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedFile, setSelectedFile } = useFile();
  const { refetch } = useConversationInfo();
  const dispatch = useAppDispatch();
  const { loading: sendMessageLoading, progress, postData } = useApiPost();
  const scrollToBottom = useScrollToBottom();
  const translate = useTranslateText();
  const location = useLocation();

  const keydownListenerRef = useRef<(e: KeyboardEvent) => void>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (selectedFile || messageData.message?.trim() !== "") {
          sendMessageApiCall(e);
        }
      }
    };

    // Assign the handler to the ref
    keydownListenerRef.current = handleKeyDown;
  }, [selectedFile, messageData]);



  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (keydownListenerRef.current) {
        keydownListenerRef.current(e);
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  async function sendMessageApiCall(e: any) {
    e.preventDefault();
    if (sendMessageLoading) {
      return;
    }
    let messageFormData = new FormData();

    if (
      !currentConversationData.conversation_id &&
      currentConversationData.phone_number == "" &&
      currentConversationData.email_id == ""
    ) {
      return;
    }
    // Ensure message_type is present, otherwise return early
    if (!messageData.message_type) {
      return;
    }

    if (currentConversationData.phone_number != "") {
      messageFormData.append(
        "phone_number",
        currentConversationData.phone_number,
      );
    } else {
      if (
        currentConversationData.conversation_id != -1 &&
        currentConversationData.conversation_id != 0
      ) {
        // Append conversation_id
        messageFormData.append(
          "conversation_id",
          currentConversationData.conversation_id.toString(),
        );
        messageFormData.append(
          "other_user_id",
          String(currentConversationData.user_id),
        );
      } else {
        messageFormData.append(
          "other_user_id",
          String(currentConversationData.user_id),
        );
      }
    }

    if (messageData.other_user_id) {
      messageFormData.delete("other_user_id");
      messageFormData.delete("conversation_id");
      messageFormData.delete("phone_number");
      messageFormData.append(
        "other_user_id",
        String(messageData.other_user_id),
      );
    }
    // Append message_type
    messageFormData.append("message_type", messageData.message_type!);

    // Append message type and the corresponding data based on message_type
    switch (messageData.message_type) {
      case "text": {
        if (messageData.message) {
          messageFormData.append("message", messageData.message);
        }
        break;
      }
      case "image": {
        messageFormData.append("files", selectedFile!);
        break;
      }
      case "video": {
        if (messageData.thumbnail_url != "" && messageData.thumbnail_url) {
          messageFormData.append("files", selectedFile!);
          const thumbnailBlob = base64ToFile(
            messageData.thumbnail_url,
            "image/png",
            "thumbnail.png",
          );
          messageFormData.append("files", thumbnailBlob);
        } else {
          console.log("return");
          return;
        }
        break;
      }
      case "document":
        messageFormData.append("files", selectedFile!);
        break;

      default:
        // Handle unknown message_type or cases that don't need extra fields
        messageFormData.append("message_type", messageData.message_type!);
        break;
    }

    // Append other optional fields that might be relevant regardless of type
    if (messageData.forward_id) {
      messageFormData.append("forward_id", messageData.forward_id.toString());
    }

    if (messageData.reply_id) {
      messageFormData.append("reply_id", messageData.reply_id.toString());
    }

    if (messageData.status_id) {
      messageFormData.append("status_id", messageData.status_id.toString());
    }

    // Make the API call with the constructed FormData
    let sendMessageRes: MessageList = await postData(
      "send-message",
      messageFormData,
      "multipart/form-data",
    );

    // Handle the response (if needed)
    if (sendMessageRes) {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 0,
      });
      setIsStoppedTyping(true);
      // @ts-ignore
      if (sendMessageRes.is_block) {
        toast.error(`${currentConversationData.user_name} Blocked You! `);
        return;
      }

      scrollToBottom();
      // append new message to message list

      if (
        currentConversationData.conversation_id == 0 ||
        currentConversationData.conversation_id == -1
      ) {
        if (!messageData.other_user_id) {
          dispatch(
            updateCurrentConversation({
              conversation_id: sendMessageRes.conversation_id,
            }),
          );
        }
      }

      if (
        sendMessageRes.conversation_id ==
        currentConversationData.conversation_id
      ) {
        dispatch(appendMessageWithDateCheck(sendMessageRes));
      }
      // Remove Value from input box
      dispatch(
        updateSendMessageData({
          message: "",
          message_type: "",
          reply_id: 0,
          other_user_id: 0,
        }),
      );

      // Remove selected files
      setSelectedFile(null);

      // console.log(sendMessageRes.message_id, sendMessageRes.message_id);
      setTimeout(() => {
        scrollToMessage(sendMessageRes.message_id, false, true);
      }, 1000);

      // Refetch the media in sidebar ===============================================================
      refetch();
      // Update Chat list
      socketInstance().emit("ChatList", {});
    } else {
      // Error handling here
    }
  }

  async function sendTypingStatus() {
    // Emit typing status only if typing had stopped before
    if (isStoppedTyping) {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 1,
      });
      setIsStoppedTyping(false); // Mark typing has started
    }

    // Clear existing timeout to reset inactivity timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to emit "typing: false" after 3 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 0,
      });
      setIsStoppedTyping(true); // Mark typing has stopped
    }, 3000);
  }

  return (
    <div
      className={`${location.pathname != "/video-call" && location.pathname != "/status" ? "fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:left-auto lg:right-auto" : "absolute"} flex w-full items-center justify-center pb-4 pt-2 bg-primary transition-all duration-300`}
    >
      <div className="flex w-[90%] items-center gap-3 xl:w-[90%]">
        <div
          className={`relative flex h-fit w-full gap-2 rounded-xl ${selectedFile == null && "border"} bg-secondary ${theme == "dark" ? "border-[#EEEEEE14]" : "border-[#B0B0B0]"} `}
        >
          <EmojiPickerCompo />
          <ShowSelectedFile
            progress={progress}
            sendMessageLoading={sendMessageLoading}
          />
          <SelectedReplyMessage />
          <form
            className="w-full"
          >
            <textarea
              ref={inputRef}
              value={
                ["location", "gif"].includes(messageData.message_type!)
                  ? ""
                  : messageData.message
              }
              onChange={(e) => {
                const textarea = e.target;

                // Auto-resize logic
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;

                sendTypingStatus();
                if (sendMessageLoading) {
                  return;
                }

                const value = textarea.value;

                if (value.trim() === "") {
                  textarea.style.height = "auto"; // Reset to default if cleared
                }

                dispatch(
                  updateSendMessageData({
                    conversation_id: currentConversationData.conversation_id,
                    message: e.target.value,
                    message_type: "text",
                  }),
                );
              }}
              onFocus={() => {
                dispatch(
                  updateViewState({
                    showOtherProfile: false,
                    showSearchMessage: false,
                    showStarMessageList: false,
                    showMediaDocLinks: false,
                  }),
                );
              }}
              className="h-full w-full resize-none bg-transparent px-2 py-1 pt-3 text-sm placeholder-lightText outline-none"
              placeholder={translate("Type Message")}
              rows={1}
              style={{
                maxHeight: "9rem",
                overflowY: "auto",
              }}
            />
          </form>
          <SelectFile />
        </div>
        <div
          onClick={(e) => {
            if (messageData.message_type == "video") {
              if (
                messageData.thumbnail_url == "" ||
                !messageData.thumbnail_url
              ) {
                return;
              }
            }
            sendMessageApiCall(e);
          }}
          className="bg-rose-500 grid h-11 min-w-12 cursor-pointer place-content-center rounded-xl"
        >
          {messageData.conversation_id ==
            currentConversationData.conversation_id && sendMessageLoading ? (
            <Loader size={22} className="text-white animate-spin" />
          ) : (
            <VscSend className="-rotate-45 text-xl text-white" />
          )}
        </div>
      </div>
    </div>
  );
}
