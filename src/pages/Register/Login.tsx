import toast from "react-hot-toast";
import { Loader, Send } from "lucide-react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/high-res.css";
import { useNavigate } from "react-router-dom";

// components
import useApiPost from "../../hooks/PostData";
import PhoneInputField from "./PhoneInputField";
import LoginLeftSections from "./LoginLeftSections";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";

export default function Login() {
  const navigate = useNavigate();
  const { loading, postData } = useApiPost();
  const [formData, setFormData] = useState({
    country_code: "",
    phone_number: "",
    country: "",
    country_full_name: "",
  });
  const { data: websiteSettings } = useWebsiteSettings();
  const [bothLoginEnabled, setBothLoginEnabled] = useState(false);
  const [currentLoginField, setCurrentLoginField] = useState<"email" | "phone">(
    "phone",
  );

  useEffect(() => {
    if (
      websiteSettings?.settings[0].email_auth &&
      websiteSettings?.settings[0].phone_auth
    ) {
      setBothLoginEnabled(true);
    } else if (websiteSettings?.settings[0].phone_auth) {
      setCurrentLoginField("phone");
      setBothLoginEnabled(false);
    } else if (websiteSettings?.settings[0].email_auth) {
      setCurrentLoginField("email");
    }
  }, [websiteSettings?.settings]);

  async function postPhoneNumber() {
    if (!formData.phone_number) {
      toast.error("Please Enter Phone Number", { position: "bottom-center" });
      return;
    }

    sessionStorage.setItem("country", formData.country.toUpperCase());
    sessionStorage.setItem("country_full_name", formData.country_full_name);

    try {
      const phone_number = formData.phone_number.replace(
        formData.country_code,
        "",
      );
      const dataToSend = {
        ...formData,
        phone_number,
      };

      let registerPhoneRes = await postData("register-phone", dataToSend);

      if (registerPhoneRes.success) {
        toast.success("OTP sent successfully!");
        sessionStorage.setItem("dataToSend", JSON.stringify(dataToSend));
        navigate("/otp-verification");
      }
    } catch (error: any) {
      console.error("SMS not sent", error);
      toast.error(error.message || "Failed to send OTP");
    }
  }

  return (
    <>
      <div id="recaptcha-container"></div>
      <div className="grid min-h-screen w-screen bg-white text-black lg:grid-cols-2">
        <LoginLeftSections />

        <div
          className="relative col-span-1 flex h-full w-full flex-col items-center justify-center bg-cover bg-center"
        >
          <div className="mx-auto w-[90%] max-w-[30rem] space-y-8 rounded-2xl p-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] lg:p-10 2xl:max-w-[35rem] 2xl:p-16">
            <div className="space-y-2">
              <div className="flex">
                <h4 className="mr-3 text-xl font-medium">Welcome!</h4>
              </div>
              <div className="text-sm sm:text-md">
                Hello, welcome to Xaosao Chat
              </div>
            </div>

            <div>
              {bothLoginEnabled && (
                <div className="grid grid-cols-2 text-center">
                  <div
                    onClick={() => {
                      setCurrentLoginField("phone");
                    }}
                    className={`flex h-12 cursor-pointer items-center justify-center gap-2 ${currentLoginField == "phone" ? "primary-gradient" : "border"
                      } rounded-t-lg py-3`}
                  >
                    <span className="hidden lg:block"> Continue with </span>
                    <span>Phone</span>
                  </div>
                  <div
                    onClick={() => {
                      setCurrentLoginField("email");
                    }}
                    className={`flex h-12 cursor-pointer items-center justify-center gap-2 ${currentLoginField == "email" ? "primary-gradient" : "border"
                      } rounded-t-lg py-3`}
                  >
                    <span className="hidden lg:block"> Continue with</span>
                    <span>Email</span>
                  </div>
                </div>
              )}

              <div>
                <PhoneInputField
                  postPhoneNumber={postPhoneNumber}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>

            <button
              onClick={postPhoneNumber}
              className={`bg-rose-500 border relative w-full overflow-hidden rounded-lg px-4 py-2 font-medium outline-none lg:px-9 lg:text-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center px-5 space-x-2 text-white">
                  <Loader color="white" size={22} className="animate-spin" />&nbsp;
                  <p className="text-xs">SENDING OTP....</p>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Send color="white" size={16} />&nbsp;
                  <p className="text-xs uppercase">Send OTP</p>
                </div>
              )}
            </button>

            <div className="mt-2 text-center text-xs text-gray-500 sm:text-sm leading-relaxed">
              For your security, we will send a one-time password (OTP) to verify your
              identity. Never share this code with anyone — Xaosao will never ask for it.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
