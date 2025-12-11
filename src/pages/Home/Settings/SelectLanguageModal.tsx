import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { RxCross2, RxRadiobutton } from "react-icons/rx";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// context
import TextTranslate from "../../../utils/TextTranslate";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useFetchLanguageList } from "../../../store/api/useFetchLanguageList";

const SelectLanguageModal: React.FC = () => {
  const dispatch = useAppDispatch();
  let { data: languageListRes } = useFetchLanguageList();
  const [status_id, setStatus_id] = useState(1);

  // @ts-ignore
  const { theme } = useTheme();

  const handleCloseModal = () => {
    dispatch(
      updateViewState({
        show_select_language_modal: false,
      }),
    );
  };
  useEffect(() => {
    let tempStatus_id = Cookies.get("status_id");
    if (tempStatus_id) {
      setStatus_id(Number(tempStatus_id));
    } else {
      setStatus_id(1);
    }
  }, []);

  const ViewManager = useAppSelector((state) => state.ViewManager);

  return (
    <Dialog
      open={ViewManager.show_select_language_modal}
      onClose={() => { }}
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
              <div className="flex items-center gap-3 py-7 font-semibold ">
                <RxCross2
                  onClick={handleCloseModal}
                  className="cursor-pointer text-2xl"
                />
                <span className="">
                  <TextTranslate text="Language" />
                </span>
              </div>
            </DialogTitle>

            <div className="relative mx-4 mt-2 h-fit pb-5">
              <div className="my-4 max-h-96 divide-y divide-borderColor overflow-auto rounded-lg border border-borderColor">
                {(languageListRes?.languages ?? [])
                  .filter((language) => language.status === true)
                  .map((e, index: number) => (
                    <div
                      key={index + 1}
                      onClick={() => setStatus_id(e.status_id)}
                      className="flex cursor-pointer items-center px-4"
                    >
                      {e.status_id === status_id ? (
                        <div className="w-3">
                          <RxRadiobutton className="text-lg text-rose-500" />
                        </div>
                      ) : (
                        <div className="w-3"></div>
                      )}
                      <div className="px-5 py-3">{e.language}</div>
                    </div>
                  ))}

              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    Cookies.set("status_id", status_id.toString());
                    location.reload();
                  }}
                  className={`bg-rose-500 text-white relative mx-auto w-44 rounded-lg px-4 py-2 text-sm font-medium outline-none lg:px-9`}
                >
                  <span className="">Save</span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectLanguageModal;
