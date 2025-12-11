import { useState } from "react";
import { GoChevronLeft } from "react-icons/go";

// utils and store
import { useAppDispatch } from "../../../utils/hooks";
import TextTranslate from "../../../utils/TextTranslate";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";

// components
import Media from "./Media";
import Links from "./Links";
import Documents from "./Documents";

export default function MediaLinksDocsTabs() {
  const [selectedTab, setSelectedTab] = useState(0);
  let dispatch = useAppDispatch();
  return (
    <div>
      <div className="flex items-center gap-3 bg-otherProfileSidebar px-3 py-10">
        <GoChevronLeft
          className="cursor-pointer text-xl"
          onClick={() => {
            dispatch(updateViewState({ showMediaDocLinks: false }));
          }}
        />
        <span className="">
          <TextTranslate text="Contact Info" />
        </span>
      </div>
      <div className="mt-4 flex w-full gap-4 bg-otherProfileSidebar text-sm lg:w-96 lg:gap-6">
        <div
          onClick={() => {
            setSelectedTab(0);
          }}
          className={`p-2 ${selectedTab == 0
            ? "border-b border-rose-500 text-rose-500"
            : "opacity-50"
            } ml-4 cursor-pointer text-center font-medium lg:w-36`}
        >
          Media
        </div>

        <div
          onClick={() => {
            setSelectedTab(1);
          }}
          className={`p-2 ${selectedTab == 1
            ? "border-b border-rose-500 text-rose-500"
            : "opacity-50"
            } mx-2 cursor-pointer text-center font-medium lg:w-36`}
        >
          Docs
        </div>
        <div
          onClick={() => {
            setSelectedTab(2);
          }}
          className={`p-2 ${selectedTab == 2
            ? "border-b border-rose-500 text-rose-500"
            : "opacity-50"
            } mr-4 cursor-pointer text-center font-medium lg:w-36`}
        >
          Links
        </div>
      </div>
      <div className="px-7 py-5">
        {selectedTab == 0 && <Media />}
        {selectedTab == 1 && <Documents />}
        {selectedTab == 2 && <Links />}
      </div>
    </div>
  );
}