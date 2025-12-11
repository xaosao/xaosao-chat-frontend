import { RxCross2 } from "react-icons/rx";
import { useTheme } from "../../../../context/ThemeProvider";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";

export default function DeleteSelectedMessage() {
  const theme = useTheme()
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  let dispatch = useAppDispatch();
  const translate = useTranslateText();
  return (
    <div className={`flex h-20 w-full items-center justify-between  px-10 pb-[1.3rem] xl:px-20 ${theme.theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#F1F1F1]"}`}>
      <div className="flex items-center gap-3">
        <RxCross2
          onClick={() => {
            dispatch(
              updateMessageOptions({
                message_list: [],
                delete_from_every_one: false,
                delete_message: false,
                selectMessage: false,
              }),
            );
          }}
          className="cursor-pointer text-xl"
        />
        <div>
          {MessageOptions.message_list?.length} {translate("messages")}
        </div>
      </div>
      <button
        onClick={() => {
          dispatch(
            updateMessageOptions({
              showModal: true,
              title: translate("Are you sure you want Delete the message?"),
              description: translate(
                "Choose the option below to clear the message",
              ),
              modalName: "delete_chat",
            }),
          );
        }}
        className={
          "relative h-9 w-fit overflow-hidden rounded-lg !bg-rose-500 px-4 text-base text-black outline-none lg:px-9 text-sm text-white"
        }
      >
        {translate("Delete")}
      </button>
    </div>
  );
}
