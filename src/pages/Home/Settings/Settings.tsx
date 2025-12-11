import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

// icons:
import {
  MdOutlineStarBorderPurple500,
} from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { RiUserUnfollowLine } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa6";

// conponents:
import BlockUserListModal from "./BlockUserListModal";
import ReusableProfileCard from "../Profile/ReusableProfileCard";

// utils:
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useTranslateText } from "../../../hooks/useTranslateText";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

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

export default function Setting() {
  const theme = useTheme()
  const navigate = useNavigate();
  const translate = useTranslateText();
  const userData = useAppSelector((state) => state.userData);

  let dispatch = useAppDispatch();
  const handleValueChange = (newValue: string) => {
    console.log(newValue);
  };

  // let LanguageTextList = useAppSelector((state) => state.LanguageTextList);

  // function translateTextFunc(text: string) {
  //   if (!LanguageTextList || !LanguageTextList.results) {
  //     return <>{text}</>;
  //   }

  //   const results = LanguageTextList.results;
  //   const translation = results.find((element: any) => element.key === text);
  //   if (translation) {
  //     return translation.Translation;
  //   } else {
  //     return text;
  //   }
  // }

  return (
    <>
      <BlockUserListModal />
      <div className="flex h-screen w-full min-w-80 max-w-md flex-col overflow-auto bg-secondary shadow-inner 2xl:min-w-96">
        <div
          style={{
            backgroundSize: "100%",
          }}
          className={`h-auto w-full space-y-3 px-4 pb-4 ${theme.theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#F1F1F1]"}`}
        >
          <div className="flex items-center gap-3 pt-6 font-semibold text-black 2xl:pt-16">
            <FaChevronLeft
              className={`cursor-pointer ${theme.theme === "dark" ? "text-white" : "text-black"}`}
              onClick={() => {
                navigate(-1);
              }}
            />
            <span className={`${theme.theme === "dark" ? "text-white" : "text-black"}`}>
              <TextTranslate text="Settings" />
            </span>
          </div>

          <div className="relative mx-auto h-fit w-fit pt-16 lg:pt-3">
            {(() => {
              const validUrl = getValidImageUrl(userData.profile_image || "");
              const displayName = userData.first_name || userData.user_name || "";

              if (validUrl) {
                return (
                  <img
                    src={validUrl}
                    className={`mx-auto h-32 w-32 rounded-full bg-rose-500 object-cover p-0.5`}
                    alt=""
                  />
                );
              } else {
                return (
                  <div className={`mx-auto h-32 w-32 rounded-full flex items-center justify-center text-white font-bold text-4xl ${getAvatarColor(displayName)}`}>
                    {getInitial(displayName)}
                  </div>
                );
              }
            })()}
            {/* <div
              onClick={() => {
                dispatch(updateViewState({ showChangeProfileModal: true }));
              }}
              className="absolute bottom-1 right-2 z-10 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-primary"
            >
              <FaPlus className="primary-gradient rounded-full p-1 text-xl" />
            </div> */}
          </div>

          <div className="space-y-2 text-center">
            <span className="text-lg font-semibold">
              {userData.first_name} {userData.last_name}
            </span>
            <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-2 py-1 shadow-2xl text-sm">
              <GoDotFill className="text-[#2AAC7A]" />
              Online
            </div>
          </div>
        </div>


        <div className="mt-10 flex flex-col gap-4 px-4">
          {/* <div
            onClick={() => {
              dispatch(updateMessageOptions({ show_all_star_messages: true }));
              navigate("/profile");
            }}
          >
            <ReusableProfileCard
              icon={<MdOutlineStarBorderPurple500 className="text-xl" />}
              value={translate("Profile")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div> */}

          <ReusableProfileCard
            onClick={() => {
              dispatch(
                updateMessageOptions({
                  show_select_about_modal: true,
                }),
              );
            }}
            icon={<BsInfoCircle className="text-lg" />}
            value={userData.bio}
            onChange={handleValueChange}
            isDisabled={true}
          />

          {/* Starred Messages ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(updateMessageOptions({ show_all_star_messages: true }));
              navigate("/star-messages");
            }}
          >
            <ReusableProfileCard
              icon={<MdOutlineStarBorderPurple500 className="text-xl" />}
              value={translate("Starred Messages")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Block Contacts ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(updateViewState({ showBlockUserList: true }));
            }}
          >
            <ReusableProfileCard
              icon={<RiUserUnfollowLine className="text-xl" />}
              value={translate("Block Contacts")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Share a link ====================================================================================*/}
          {/* <RWebShare
            data={{
              text: "Xaosao Chat",
              url: `${window.location.origin}`,
              title: "Xaosao Chat",
            }}
          >
            <ReusableProfileCard
              icon={<RxShare2 className="text-lg" />}
              value={translate("Share a link")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </RWebShare> */}

          {/* Language ====================================================================================*/}
          {/* <div
            onClick={() => {
              dispatch(
                updateViewState({
                  show_select_language_modal: true,
                }),
              );
            }}
          >
            <ReusableProfileCard
              icon={<HiLanguage className="text-xl" />}
              value={translate("Language")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div> */}
        </div>

        <div className="text-sm my-4 pt-16 text-center font-semibold lg:pb-0"></div>
      </div>
    </>
  );
}
