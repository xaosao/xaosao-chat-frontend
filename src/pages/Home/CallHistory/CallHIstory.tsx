import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import CallHistoryTabs from "./CallHistoryTabs";
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";

export default function CallHIstory() {
  // @ts-ignore
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-primary pb-6 shadow-inner lg:max-w-md">
      <div className="w-full px-4">
        <div className="mb-10 flex items-center gap-3 pt-10 font-semibold">
          <FaChevronLeft
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <span className="text-lg font-semibold">
            <TextTranslate text="Call History" />
          </span>
        </div>
      </div>
      <CallHistoryTabs />
    </div>
  );
}
