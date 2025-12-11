import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// utils:
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import BlockUserList from "./BlockUserList";

const BlockUserListModal: React.FC = () => {
  const ViewManager = useAppSelector((state) => state.ViewManager);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const { theme } = useTheme();
  const handleCloseModal = () => {
    dispatch(updateViewState({ showBlockUserList: false }));
  };
  return (
    <Dialog
      open={ViewManager.showBlockUserList}
      onClose={handleCloseModal}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative max-h-[80vh] w-full max-w-sm overflow-hidden rounded-xl bg-primary transition-transform duration-300 ease-out">
            <DialogTitle
              as="h3"
              style={{
                backgroundSize: "100%",
              }}
              className="w-full space-y-5 bg-no-repeat px-4 xl:space-y-7"
            >
              <div className="flex items-center gap-3 py-10 font-semibold text-black">
                <RxCross2
                  onClick={handleCloseModal}
                  className={`cursor-pointer text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}
                />
                <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                  <TextTranslate text="Blocked account" />
                </span>
              </div>
            </DialogTitle>
            <BlockUserList />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default BlockUserListModal;
