// components/MyMessage.tsx
import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import PinIcon from "/MessageListIcons/pin 1.png";
import PinDarkIcon from "/MessageListIcons/pin_dark.png";

// @ts-ignore
import { AudioPlayer } from "react-audio-player-component";

// icons
import { MdLocationPin } from "react-icons/md";
import { IoSquareOutline } from "react-icons/io5";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { FaPlay, FaSquareCheck } from "react-icons/fa6";

// Type and utils
import { useTheme } from "../../../context/ThemeProvider";
import { MessageList } from "../../../types/MessageListType";
import { formatTimeOnly } from "../../../utils/formatUTCtoLocalDate";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";


// store
import {
  addMessage,
  removeMessage,
  updateMessageOptions,
} from "../../../store/Slices/MessageOptionsSlice";
import { setViewImage } from "../../../store/Slices/ViewManagerSlice";

// components:
import SharedContact from "./SharedContact";
import ShowStatusReply from "./ShowStatusReply";
import CallInMessageList from "./CallInMessageList";
import PollMessages from "./PollMessages/PollMessages";
import LinkPreview from "../../../components/LinkPreview";
import ShowReplyMessage from "./ReplyMessage/ShowReplyMessage";
import ShowReactions from "./SelectedMessageOption/ShowReactions";
import ReactionPicker from "./SelectedMessageOption/ReactionPicker";
import SelectedMessageOption from "./SelectedMessageOption/SelectedMessageOption";
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

interface MyMessageProps {
  messageData: MessageList;
  image_urls: string[];
}

const MyMessage: React.FC<MyMessageProps> = ({ messageData, image_urls }) => {
  const dispatch = useAppDispatch();
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const userData = useAppSelector((state) => state.userData);
  const [showReactions, setShowReactions] = useState(false);

  const PinMessagesData = useAppSelector((state) => state.PinMessages);

  // @ts-ignore
  const { theme } = useTheme();

  const isMessageSelected = MessageOptions.message_list?.some(
    (message) => message.message_id === messageData.message_id,
  );

  const handleImageClick = (imageIndex: number) => {
    console.log(image_urls, "image_urls");

    dispatch(
      setViewImage({
        show_image: true,
        image_src: image_urls,
        currentIndex: imageIndex,
      }),
    );
  };
  const imageIndex = image_urls.indexOf(messageData.url.replace(/\\/g, "/"));

  const handleSelectMessageClick = () => {
    if (MessageOptions.selectMessage) {
      if (isMessageSelected) {
        dispatch(removeMessage(messageData.message_id));
      } else if (messageData.myMessage) {
        dispatch(addMessage(messageData));
      } else {
        dispatch(
          updateMessageOptions({
            delete_only_from_me: true,
          }),
        );
        dispatch(addMessage(messageData));
      }
    }
  };

  // Regex to check if the message contains only emojis
  const isOnlyEmojis = (message: string) => {
    return (
      message &&
      message
        .trim()
        .match(
          /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})+$/u,
        )
    );
  };

  return (
    <div
      key={messageData.message_id}
      id={String(messageData.message_id)}
      className={`my-2 flex flex-col rounded-lg ${MessageOptions.selectMessage && isMessageSelected
        ? theme === "dark"
          ? "bg-[#2A2A2A]"
          : "bg-[#F1F1F1]"
        : ""
        }`}
    >
      <div className="flex items-end justify-end">
        {!["video_call", "audio_call", "delete_from_everyone"].includes(
          messageData.message_type!,
        ) &&
          MessageOptions.selectMessage &&
          (isMessageSelected ? (
            <FaSquareCheck
              onClick={() => dispatch(removeMessage(messageData.message_id))}
              className="mx-5 my-auto h-5 w-5 cursor-pointer text-rose-500"
            />
          ) : (
            <IoSquareOutline
              onClick={() => dispatch(addMessage(messageData))}
              className="mx-5 my-auto h-5 w-5 cursor-pointer text-rose-500"
            />
          ))}

        <div
          onClick={() => {
            if (
              !["video_call", "audio_call", "delete_from_everyone"].includes(
                messageData.message_type!,
              )
            ) {
              handleSelectMessageClick();
            }
          }}
          className={`mx-2 flex w-full flex-col space-y-2 ${MessageOptions.selectMessage ? "cursor-pointer" : ""
            } ${messageData.myMessage ? "order-1 items-end" : "order-2"}`}
        >
          <div>
            <div
              onMouseEnter={() => {
                setShowReactions(true);
              }}
              onMouseLeave={() => {
                setShowReactions(false);
              }}
              className={`${messageData.myMessage
                ? "bg-rose-500 ml-auto mr-0 rounded-br-none text-white"
                : "rounded-bl-none bg-otherMessageBg"
                } group relative flex w-fit min-w-[1rem] max-w-[17rem] flex-col rounded-lg px-2 py-1 text-sm sm:max-w-xl 2xl:max-w-3xl ${messageData?.reactionData?.length != 0 ? "mb-6 pb-2" : "mb-2"} `}
            >
              {messageData?.reply_id != 0 && (
                <ShowReplyMessage reply_id={messageData.reply_id} />
              )}
              {messageData?.reactionData?.length != 0 &&
                messageData?.reactionData?.length != undefined && (
                  <ShowReactions messageData={messageData} />
                )}
              <div className="flex h-full w-full">
                {
                  <>
                    {messageData.delete_from_everyone === true ? (
                      <div className="pr-5">🚫 This message was deleted!</div>
                    ) : messageData.delete_for_me
                      .split(",")
                      .includes(userData.user_id.toString()) ? (
                      <div className="pr-5">🚫 You deleted this message!</div>
                    ) : messageData.message_type === "text" ? (
                      messageData.status_id ? (
                        <ShowStatusReply messageData={messageData} />
                      ) : (
                        <div
                          className={` ${isOnlyEmojis(messageData.message) ? "text-4xl" : ""} pr-5`}
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {messageData.message}
                        </div>
                      )
                    ) : messageData.message_type === "link" ? (
                      <div>
                        <LinkPreview
                          right={messageData.myMessage}
                          url={messageData.message}
                        />
                      </div>
                    ) : messageData.message_type === "image" ? (
                      <div
                        onClick={() => {
                          handleImageClick(imageIndex);
                        }}
                      >
                        <LoadingSkeletonImageDynamic
                          radius=""
                          className={` ${messageData.myMessage
                            ? "rounded-br-none"
                            : "rounded-bl-none"
                            } min-h-44 min-w-60 cursor-pointer select-none rounded-lg object-cover transition-all duration-300 ${location.pathname != "/video-call" ? "lg:h-56 lg:w-96" : "lg:h-40 lg:w-72"} `}
                          image_height=""
                          image_url={messageData.url}
                          image_width=""
                        />
                      </div>
                    ) : messageData.message_type === "gif" ? (
                      <div
                        onClick={() => {
                          handleImageClick(imageIndex);
                        }}
                      >
                        <LoadingSkeletonImageDynamic
                          radius=""
                          className={` ${messageData.myMessage
                            ? "rounded-br-none"
                            : "rounded-bl-none"
                            } h-44 w-[17rem] cursor-pointer select-none rounded-lg object-cover transition-all duration-300 ${location.pathname != "/video-call" ? "lg:h-56 lg:w-96" : "lg:h-40 lg:w-72"}`}
                          image_height=""
                          image_url={messageData.url}
                          image_width=""
                        />
                      </div>
                    ) : messageData.message_type === "video" ? (
                      <div
                        onClick={() => {
                          handleImageClick(imageIndex);
                        }}
                        className={` ${messageData.myMessage
                          ? "rounded-br-none"
                          : "rounded-bl-none"
                          } relative h-44 w-60 cursor-pointer overflow-hidden rounded-lg ${location.pathname != "/video-call" ? "lg:h-56 lg:w-96" : "lg:h-40 lg:w-72"}`}
                      >
                        <div className="absolute grid h-full w-full place-content-center">
                          <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3 text-white" />
                        </div>
                        <LoadingSkeletonImageDynamic
                          radius=""
                          className={`h-44 select-none object-cover ${location.pathname != "/video-call" ? "lg:h-56 lg:w-96" : "lg:h-40 lg:w-72"}`}
                          image_height="100%"
                          image_url={messageData.thumbnail}
                          image_width="100%"
                        />
                      </div>
                    ) : messageData.message_type === "document" ? (
                      <div
                        className={`w-full max-w-80 rounded-[9px] ${messageData.myMessage ? "primary-gradient rounded-br-none" : "rounded-bl-none bg-pdfBg"} px-1 pb-3 pt-1 ${location.pathname != "/video-call" ? "lg:min-w-80" : "lg:min-w-44"} `}
                      >
                        <a
                          href={messageData.url}
                          target="_blank"
                          className={`flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className="h-10 w-10 object-cover"
                              src="/DarkIcons/pdf_icons.png"
                              alt=""
                            />
                            <div
                              className={`w-full ${theme == "dark" ? "text-white" : "text-black"} line-clamp-2 max-w-56 overflow-hidden`}
                            >
                              {messageData?.url
                                ?.split("/")
                                .pop()
                                ?.split("-")
                                .slice(1)
                                .join("-") || ""}
                            </div>
                          </div>
                          <img
                            src="/DarkIcons/Download_icon.png"
                            className="h-8 w-8 cursor-pointer"
                            alt=""
                          />
                        </a>
                      </div>
                    ) : messageData.message_type === "audio" ? (
                      <AudioPlayer
                        src={messageData.url}
                        minimal={true}
                        width={350}
                        trackHeight={50}
                        barWidth={3}
                        gap={1}
                        visualise={true}
                        backgroundColor={
                          messageData.myMessage
                            ? theme == "dark"
                              ? "#FFEDAB"
                              : "#FFEDAB"
                            : theme == "dark"
                              ? "#787878"
                              : "#DDDDDD"
                        }
                        barColor="#CCCCCC"
                        barPlayedColor="#000"
                        skipDuration={2}
                        seekBarColor="black"
                        // volumeControlColor="blue"
                        hideSeekBar={true}
                        hideTrackKnobWhenPlaying={true}
                      />
                    ) : messageData.message_type === "location" ? (
                      <div
                        className={`h-52 w-full max-w-80 rounded-[9px] ${messageData.myMessage ? "primary-gradient rounded-br-none" : "rounded-bl-none bg-pdfBg"} min-w-64 pt-1 ${location.pathname != "/video-call" ? "sm:min-w-80" : "sm:min-w-72"}`}
                      >
                        <div className="mx-auto mt-1 h-40 w-[98%] max-w-80">
                          <GoogleMapReact
                            bootstrapURLKeys={{
                              key: "AIzaSyAMZ4GbRFYSevy7tMaiH5s0JmMBBXc0qBA",
                            }}
                            defaultCenter={{
                              lat: Number(messageData.latitude),
                              lng: Number(messageData.longitude),
                            }}
                            defaultZoom={13}
                            draggable={false}
                          >
                            <MdLocationPin className="text-3xl text-black" />
                          </GoogleMapReact>
                        </div>
                        <div className="grid place-content-center">
                          <a
                            target="_blank"
                            href={`http://maps.google.com/maps?z=12&t=m&q=loc:${messageData.latitude}+${messageData.longitude}`}
                            className="mt-3 w-full cursor-pointer font-medium"
                          >
                            View Location
                          </a>
                        </div>
                      </div>
                    ) : messageData.message_type === "video_call" ||
                      messageData.message_type === "audio_call" ? (
                      <CallInMessageList messageData={messageData} />
                    ) : messageData.message_type === "contact" ? (
                      <SharedContact messageData={messageData} />
                    ) : messageData.message_type === "poll" ? (
                      <PollMessages messageData={messageData} />
                    ) : (
                      messageData.message_type
                    )}

                    {messageData.message_type == "audio_call" ||
                      messageData.message_type == "video_call" ||
                      messageData.message_type === "delete_from_everyone" ||
                      messageData.delete_from_everyone ||
                      messageData.delete_for_me
                        .split(",")
                        .includes(String(userData.user_id)) ? (
                      ""
                    ) : (
                      <div
                        className={`absolute ${messageData.message_type == "text" ? "right-0 top-1" : "right-3 top-3"} pl-2 opacity-100 ${MessageOptions.selectMessage ? "opacity-100" : "opacity-100"}`}
                      >
                        <SelectedMessageOption messageData={messageData} />
                      </div>
                    )}
                    {messageData.message_type == "audio_call" ||
                      messageData.message_type == "video_call" ||
                      messageData.message_type === "delete_from_everyone" ||
                      messageData.delete_from_everyone ||
                      messageData.delete_for_me
                        .split(",")
                        .includes(String(userData.user_id)) ? (
                      ""
                    ) : (
                      <>
                        {showReactions && (
                          <ReactionPicker messageData={messageData} />
                        )}
                      </>
                    )}
                  </>
                }
              </div>
            </div>

            <div
              className={`flex ${messageData.myMessage ? "flex-row-reverse" : ""} mt-2 items-center gap-x-2`}
            >
              <div className="text-xs text-lightText">
                {formatTimeOnly(messageData.createdAt)}
              </div>
              {messageData.myMessage && (
                <LiaCheckDoubleSolid
                  title={messageData.message_read ? "Seen" : "Unseen"}
                  className={`h-5 w-5 ${messageData.message_read
                    ? "text-[#54E0FF]"
                    : "text-gray-400"
                    } `}
                />
              )}
              {messageData.is_star_message && (
                <img
                  className="h-3 w-3"
                  src="/Home/Star - Iconly Pro.png"
                  alt=""
                />
              )}
              {PinMessagesData?.PinMessageList?.find(
                (item) => item.message_id == messageData.message_id,
              ) && (
                  <img
                    className="h-4 w-4 object-contain"
                    src={theme == "dark" ? PinDarkIcon : PinIcon}
                    alt=""
                  />
                )}
            </div>
          </div>
        </div>

        {(() => {
          const validUrl = getValidImageUrl(messageData.senderData?.profile_image || "");
          const displayName = messageData.senderData?.user_name || "";

          if (validUrl) {
            return (
              <img
                src={validUrl}
                alt="My profile"
                className={`h-7 w-7 rounded-full object-cover ${messageData.myMessage ? "order-2" : "order-1"
                  } mt-auto ${["video", "image"].includes(messageData.message_type!)
                    ? "mb-7"
                    : "mb-5"
                  }`}
              />
            );
          } else {
            return (
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-white font-semibold text-xs ${getAvatarColor(displayName)} ${messageData.myMessage ? "order-2" : "order-1"
                  } mt-auto ${["video", "image"].includes(messageData.message_type!)
                    ? "mb-7"
                    : "mb-5"
                  }`}
              >
                {getInitial(displayName)}
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

export default MyMessage;
