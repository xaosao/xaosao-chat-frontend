import { GoDotFill } from "react-icons/go";
import { useAppSelector } from "../../../utils/hooks";
import { MessageList } from "../../../types/MessageListType";

export default function ShowStatusReply({
  messageData,
}: {
  messageData: MessageList;
}) {
  const userData = useAppSelector((state) => state.userData);
  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );
  if (
    messageData?.statusData == undefined ||
    messageData?.statusData.length == 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div
        onClick={() => {
        }}
        className="my-1 flex min-w-52 cursor-pointer items-center gap-2 rounded-xl bg-primary px-3 py-2 text-darkText lg:min-w-72"
      >
        <div className="text-[13px] font-medium">
          {messageData?.statusData[0].StatusMedia[0].url.endsWith(".mp4") ? (
            <video
              className="h-10 w-10 rounded-lg"
              src={messageData?.statusData[0].StatusMedia[0].url}
              controls
            />
          ) : (
            <img
              className="h-10 w-10 rounded-lg object-cover"
              src={messageData?.statusData[0].StatusMedia[0].url}
              alt=""
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          {messageData?.statusData[0].user_id == userData.user_id
            ? "You"
            : currentConversation?.user_name}
          <>
            <GoDotFill className="h-2 w-2 text-lightText" />
            <div className="text-[#FCC604]">Status</div>
          </>
        </div>
      </div>
      <div className="line-clamp-1">
        {messageData?.message_type == "text" && (
          <div className="gap-1">{messageData.message}</div>
        )}
      </div>
    </div>
  );
}
