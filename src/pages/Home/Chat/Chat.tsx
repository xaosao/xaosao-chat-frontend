import { jwtDecode } from "jwt-decode";
import { FolderDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { getAuthToken } from "../../../utils/getAuthToken";

// components
import ConversationList from "./ConversationList";
import ArchiveConversationList from "./ArchiveConversationList";

// utils, hooks and context
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useTranslateText } from "../../../hooks/useTranslateText";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

// store or redux
import { ResData } from "../../../types/UserDataType";
import { updateUserData } from "../../../store/Slices/UserSlice";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";

export default function Chat() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const translate = useTranslateText();
  const [searchUser, setsearchUser] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryParams = new URLSearchParams(location.search);
  const fullname = queryParams.get("id");

  useEffect(() => {
    if (fullname) {
      setsearchUser(fullname);
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setsearchUser("");
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login-without-otp");
      return;
    }
    try {
      const decoded = jwtDecode<ResData & { iat?: number }>(token);
      const { iat, ...userDataWithoutIat } = decoded;
      dispatch(updateUserData(userDataWithoutIat as ResData));

    } catch (error) {
      navigate("/login-without-otp");
    }
  }, [dispatch]);

  const ViewManager = useAppSelector((state) => state.ViewManager);
  const archiveList = useAppSelector((state) => state.archiveList);

  return (
    <>
      <div className="relative flex h-screen w-full min-w-[21rem] flex-col bg-secondary py-4 shadow-inner lg:max-w-md 2xl:min-w-[22rem]">
        <div className="w-full px-4">
          <div className="flex items-center justify-between">
            <h4 className={`text-lg font-semibold transition-all duration-300 ${isSearchOpen ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}>
              <TextTranslate text="My Chats" />
            </h4>
            <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${isSearchOpen ? "w-full" : "w-auto"}`}>
              {isSearchOpen ? (
                <>
                  <IoClose
                    className="cursor-pointer text-2xl text-gray-600 flex-shrink-0 p-1 hover:bg-gray-100 rounded-full"
                    onClick={handleCloseSearch}
                  />
                  <div className="relative flex items-center w-full">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
                    <input
                      ref={inputRef}
                      value={searchUser}
                      onChange={(e) => {
                        setsearchUser(e.target.value);
                      }}
                      className={`${theme == "dark" ? "bg-gray-200" : "bg-[#F2F2F2]"} text-sm rounded-xl py-2 pl-10 pr-3 w-full placeholder-lightText outline-none`}
                      type="text"
                      placeholder={translate("Search User")}
                    />
                  </div>
                </>
              ) : (
                <div
                  className="p-2 rounded-full bg-gray-100 cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <IoSearchOutline className="text-xl text-gray-600" />
                </div>
              )}
            </div>
          </div>
          <div
            onClick={() => {
              ViewManager.showArchiveList
                ? dispatch(updateViewState({ showArchiveList: false }))
                : dispatch(updateViewState({ showArchiveList: true }));
            }}
            className="my-4 ml-4 flex cursor-pointer items-center gap-3"
          >
            {ViewManager.showArchiveList ? (
              <MdArrowBackIos />
            ) : (
              <FolderDown size={20} className="text-rose-500" />
            )}
            <div className="flex w-full justify-between">
              <TextTranslate
                text={ViewManager.showArchiveList ? "Back to chat" : "Archived"}
              />
              {archiveList.length > 0 && (
                <div className="bg-rose-500 z-10 grid h-5 w-5 place-content-center rounded-full text-xs text-white">
                  {archiveList?.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {ViewManager.showArchiveList ? (
          <ArchiveConversationList searchUser={searchUser} />
        ) : (
          <ConversationList searchUser={searchUser} />
        )}
      </div>
    </>
  );
}
