import { useState } from "react";

import AllCallsHIstory from "./AllCallsHIstory";
import { Phone, PhoneMissed } from "lucide-react";
import MissedCallHIstory from "./MissedCallHIstory";
import TextTranslate from "../../../utils/TextTranslate";

export default function CallHistoryTabs() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="max-h-[90dvh] w-full">
      <div className="mb-3 flex w-full flex-col items-center gap-4 sm:mb-10 sm:justify-between">
        <div className="mt-2 flex w-full justify-center gap-4 bg-secondary px-2 py-2 lg:gap-6">
          <div
            onClick={() => {
              setSelectedTab(0);
            }}
            className={`p-2 ${selectedTab == 0 ? "bg-rose-500 text-white" : ""
              } flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg text-center text-sm font-medium`}
          >
            <Phone size={20} className={`${selectedTab == 0 ? "bg-rose-500 text-white" : ""}`} />
            <span className="w-fit"><TextTranslate text="All Calls" /></span>
          </div>
          <div
            onClick={() => {
              setSelectedTab(1);
            }}
            className={`p-2 ${selectedTab == 1 ? "bg-rose-500 text-white" : ""
              } flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg text-center text-sm font-medium`}
          >
            <PhoneMissed size={20} className={`${selectedTab == 1 ? "bg-rose-500 text-white" : ""}`} />
            <span className="w-fit"><TextTranslate text="Missed Call" /></span>
          </div>
        </div>

        {selectedTab == 0 && <AllCallsHIstory />}

        {selectedTab == 1 && <MissedCallHIstory />}
      </div>
    </div>
  );
}
