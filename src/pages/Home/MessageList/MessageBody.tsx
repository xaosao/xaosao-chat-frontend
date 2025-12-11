import { useEffect, useRef, useState } from "react";

// components:
import MyMessage from "./MyMessage";
import LoadMoreMessages from "./LoadMoreMessages";
import OnClickScrollToBottom from "./OnClickScrollToBottom";

// Utils
import { useTheme } from "../../../context/ThemeProvider";
import scrollToMessage from "../../../utils/scrollToMessage";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { formatUTCtoLocalDate } from "../../../utils/formatUTCtoLocalDate";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

export default function MessageBody() {
  const theme = useTheme();
  const [isIOS, setIsIOS] = useState(false);
  const MessageListArray = useAppSelector((state) => state.MessageList);

  const NavigateTospesificMessage = useAppSelector(
    (state) => state.NavigateToSpesificMessage,
  );
  const messageListDetails = useAppSelector((state) => state.MessageOptions);
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
  }, []);


  const topTriggerRef = useRef(null);
  let dispatch = useAppDispatch();
  const urls = MessageListArray?.filter((message) => {
    return (
      ["image", "video", "gif"].includes(message.message_type!) && message.url
    );
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(updateMessageOptions({ messageListAtTop: true }));
        }
      },
      { threshold: 1.0 },
    );

    if (topTriggerRef.current) {
      observer.observe(topTriggerRef.current);
    }

    return () => {
      if (topTriggerRef.current) {
        observer.unobserve(topTriggerRef.current);
      }
    };
  }, [topTriggerRef, dispatch]);

  useEffect(() => {
    if (
      MessageListArray.length != 0 &&
      NavigateTospesificMessage.navigate_to_message == false
    ) {
      if (
        messageListDetails.currentPage == "1" ||
        messageListDetails.currentPage == ""
      ) {
        scrollToMessage(
          MessageListArray[MessageListArray.length - 1].message_id,
          false,
          false,
        );
      }
    }
  }, []);

  const image_urls = urls.map((message) => message.url.replace(/\\/g, "/"));

  return (
    <div
      id="messageListDiv"
      className={`flex ${location.pathname != "/video-call" ? "h-[83dvh]" : "h-[78dvh] lg:h-[76dvh]"}  flex-col gap-y-2 overflow-y-auto ${location.pathname != "/video-call" && "sm:px-14"} px-5 ${isIOS ? "pb-20" : "pb-14"} lg:py-6`}
    >
      <div ref={topTriggerRef} style={{ height: "1px" }}></div>

      <OnClickScrollToBottom />
      <LoadMoreMessages />

      {MessageListArray.map((e) => {
        return (
          <div key={e.message_id}>
            {e.message_type == "date" ? (
              <div
                id={String(e.message_id)}
                className={`${theme.theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#F1F1F1]"} mx-auto my-3 w-fit rounded-full bg-messageHead px-5 py-1 text-center text-sm font-medium text-darkText shadow-sm`}
              >
                {formatUTCtoLocalDate(e.message)}
              </div>
            ) : e.message_type == "member_added" ||
              e.message_type == "member_removed" ? (
              <div
                id={String(e.message_id)}
                className="mx-auto my-3 w-fit rounded-full bg-primary px-5 py-1 text-center text-sm font-medium text-darkText shadow-sm"
              >
                {e.message}
              </div>
            ) : (
              <>
                <MyMessage messageData={e} image_urls={image_urls} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
