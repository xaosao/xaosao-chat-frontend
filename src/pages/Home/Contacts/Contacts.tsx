import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { IoSearchOutline, IoClose } from "react-icons/io5";

import ContactList from "./ContactList";
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useTranslateText } from "../../../hooks/useTranslateText";

export default function Contacts() {
  const [searchUser, setsearchUser] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // @ts-ignore
  const { theme } = useTheme();
  const navigate = useNavigate();
  const translate = useTranslateText();

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

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden shadow-inner lg:max-w-md bg-primary">
      <div className="flex items-center justify-between w-full px-4 py-3">
        <div className={`flex items-center gap-2 font-semibold transition-all duration-300 ${isSearchOpen ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}>
          <FaChevronLeft
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <span className="text-md sm:text-lg font-normal sm:font-semibold whitespace-nowrap">
            <TextTranslate text="Contact Lists" />
          </span>
        </div>

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
      <ContactList searchUser={searchUser} />
    </div>
  );
}
