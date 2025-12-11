import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader, LogIn } from "lucide-react";
import "react-phone-input-2/lib/high-res.css";
import { useNavigate } from "react-router-dom";

// Hooks and API
import OtpInputField from "./OtpInputField";
import { OtpRes } from "../../types/ResType";
import useApiPost from "../../hooks/PostData";
import Countdown from "../../utils/Countdown";
import { useAppDispatch } from "../../utils/hooks";
import LoginLeftSections from "./LoginLeftSections";
import { updateUserData } from "../../store/Slices/UserSlice";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";

export default function EnterOtp() {
  const navigate = useNavigate();
  // @ts-ignore
  const dataToSend = JSON.parse(sessionStorage.getItem("dataToSend"));
  const [otp, setotp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();
  const { data: websiteSettings } = useWebsiteSettings();

  async function checkOtp() {
    if (otp.length != 6) {
      toast.error("Please Enter Otp");
      return;
    }
    try {
      let res: OtpRes;
      if (dataToSend?.email_id) {
        res = await postData("verify-email-otp", {
          country_code: dataToSend.country_code,
          email_id: dataToSend.email_id,
          otp: otp,
        });
      } else {
        res = await postData("verify-phone-otp", {
          country_code: dataToSend.country_code,
          phone_number: dataToSend.phone_number,
          otp: otp,
        });
      }

      if (res.success == true) {
        if (rememberMe) {
          Cookies.set("whoxa_auth_token", res.token, { expires: 30 });
        } else {
          Cookies.set("whoxa_auth_token", res.token);
        }

        console.log("Chat user data:::", res?.resData);

        dispatch(updateUserData(res?.resData));
        toast.success("Otp Verified");
        if (
          res.resData.first_name == "" ||
          res.resData.last_name == "" ||
          res.resData.user_name == "" ||
          res.resData.gender == ""
        ) {
          navigate("/user-details");
        } else if (res.resData.profile_image == "") {
          navigate("/select-profile");
        } else {
          window.location.pathname = "/chat";
        }
      } else {
        toast.error("Invalid Otp!");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }
  const handleReset = () => {
    console.log("OTP Resend triggered");
  };

  return (
    <div className="grid min-h-screen w-screen bg-white text-black lg:grid-cols-2">
      <LoginLeftSections />

      <div
        className="relative col-span-1 flex h-full w-full flex-col items-center justify-center bg-cover bg-center"
      >
        <div className="mx-auto w-[90%] max-w-[30rem] space-y-7 rounded-2xl p-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] lg:p-10 2xl:max-w-[35rem] 2xl:p-16">
          <div className="space-y-2">
            <div className="flex">
              <h4 className="mr-3 text-xl font-medium">Welcome </h4>
              <img className="h-8 w-8" src="/LightIcons/hii.png" alt="" />
            </div>
            <div className="text-sm lg:text-md">
              Hello welcome to {websiteSettings?.settings[0].website_name}
            </div>
          </div>

          <div className="text-[#3A3A3A] space-y-2">
            <p className="text-sm">Enter the 6-digit OTP sent to{" "}</p>
            <div className="flex gap-4 text-sm">
              {dataToSend?.email_id ? (
                <div className="font-bold"> {dataToSend.email_id}</div>
              ) : (
                <>
                  <div className="font-bold">
                    {" "}
                    {dataToSend.country_code} {dataToSend.phone_number}
                  </div>
                  <div
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="cursor-pointer text-primary underline"
                  >
                    Change Number
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <OtpInputField
              checkOtp={checkOtp}
              setotpPerant={setotp}
              externalOtp={otp}
            />
            <Countdown time={120} onReset={handleReset} />
            <div>
              <label className="flex items-center">
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="select-none pl-2 text-sm">Remember Me</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              checkOtp();
            }}
            className={`flex items-center justify-center bg-rose-500 relative w-full overflow-hidden rounded-lg px-4 py-3 text-white font-medium outline-none lg:px-9 lg:text-sm`}
          >
            {loading ? (
              <div className="flex items-center justify-center px-5 text-white gap-3">
                <Loader color="white" className="animate-spin" size={23} />
                <p className="text-xs text-normal uppercase">LOGING IN....</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white">
                <LogIn size={16} />
                <p className="text-xs text-normal uppercase">LOGIN</p>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
