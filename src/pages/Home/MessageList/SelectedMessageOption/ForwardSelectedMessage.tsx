import { RxCross2 } from "react-icons/rx";
import TextTranslate from "../../../../utils/TextTranslate";
import { useTheme } from "../../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";

export default function ForwardSelectedMessage() {
  const theme = useTheme();
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  let dispatch = useAppDispatch();

  return (
    <div className={`flex h-20 w-full items-center justify-between px-10 pb-[1.3rem] xl:px-20 ${theme.theme === "dark" ? "bg-[#2A2A2A]" : "bg-[#F1F1F1]"}`}>
      <div className="flex items-center gap-3">
        <RxCross2
          onClick={() => {
            dispatch(
              updateMessageOptions({
                message_list: [],
                forward_message: false,
                selectMessage: false,
              }),
            );
          }}
          className="cursor-pointer text-xl text-rose-500"
        />
        <div>{MessageOptions.message_list?.length} messages</div>
      </div>
      <button
        onClick={() => {
          dispatch(
            updateMessageOptions({
              show_forward_message_modal: true,
            }),
          );
        }}
        className={
          "relative min-h-10 w-fit overflow-hidden rounded-lg !bg-rose-500 px-4 text-base text-black outline-none lg:px-9 text-sm text-white"
        }
      >
        <TextTranslate text="Forward To" />
      </button>
    </div>
  );
}
