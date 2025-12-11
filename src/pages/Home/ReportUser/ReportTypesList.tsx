import { useState } from "react";
import toast from "react-hot-toast";
import { MdReport } from "react-icons/md";
import { ClipLoader } from "react-spinners";

// hooks and utils:
import useApiPost from "../../../hooks/PostData";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

// store and context
import { useTheme } from "../../../context/ThemeProvider";
import { useReportTypeList } from "../../../store/api/useReportTypeList";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

export default function ReportTypesList() {
  // @ts-ignore
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useReportTypeList();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const [selectedReportId, setSelectedReportId] = useState(0);

  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();

  async function reportUser({ report_id }: { report_id: number }) {
    await postData("report-user", {
      conversation_id: currentConversationData.conversation_id,
      reported_user_id: currentConversationData.is_group
        ? ""
        : currentConversationData.user_id,
      report_id,
    });

    dispatch(
      updateMessageOptions({
        showModal: false,
        selectMessage: false,
        delete_message: false,
        delete_only_from_me: false,
        message_list: [],
        modalName: "",
      }),
    );
    toast.success(
      ` ${currentConversationData.is_group
        ? currentConversationData.group_name
        : currentConversationData.user_name
      } is Reported`,
    );
    refetch();
  }

  return (
    <div className="relative my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : data?.reportType?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Report Types </div>
        </div>
      ) : (
        data?.reportType?.map((e) => {
          return (
            <>
              <div
                onClick={() => {
                  setSelectedReportId(e.report_id);
                }}
                className={`hover:bg-selectedChatdata flex cursor-pointer items-center justify-start px-3 py-4`}
              >
                <div>
                  <div className="text-sm font-medium capitalize text-darkText">
                    {e?.report_title}
                  </div>
                </div>

                {e.report_id == selectedReportId && (
                  <div className="ml-auto mr-4">
                    <MdReport className="text-xl" />
                  </div>
                )}
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })
      )}

      <div className="absolute bottom-5 grid w-full place-content-center">
        <button
          onClick={() => {
            reportUser({ report_id: selectedReportId });
          }}
          className={`h-9 min-w-60 overflow-hidden rounded-full border border-rose-500 px-4 text-sm font-medium outline-none hover:bg-rose-500 hover:text-white`}
        >
          {loading ? (
            <ClipLoader size={21} color={theme == "dark" ? "white" : "black"} />
          ) : (
            "Report"
          )}
        </button>
      </div>
    </div>
  );
}
