import Cookies from "js-cookie";
import { useState } from "react";
import { Loader, Send } from "lucide-react";
import "react-phone-input-2/lib/high-res.css";
import { useNavigate } from "react-router-dom";

// components
import { TextField } from "@mui/material";
import LoginLeftSections from "./LoginLeftSections";

export default function LoginWithoutOTP() {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      phone_number: "",
   });
   const [isLoading, setIsLoding] = useState(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
      console.log("Handle login")
      event.preventDefault();
      const url = `${import.meta.env.VITE_API_URL}login-with-phone`;

      try {
         setIsLoding(true);
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });
         const data = await response.json();

         if (!data.success) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
         }

         Cookies.set("whoxa_auth_token", data.token, { expires: 30 });
         navigate("/chat");

      } catch (error) {
         console.error("Login on xaosao-chat-frontend failed:", error);
         setErrorMessage("Login failed. Please try again.");
      } finally {
         setIsLoding(false);
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
               <form onSubmit={handleLogin} className="mx-auto w-[90%] max-w-[30rem] space-y-8 rounded-2xl p-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] lg:p-10 2xl:max-w-[35rem] 2xl:p-16">
                  <div className="space-y-2">
                     <div className="flex">
                        <h4 className="mr-3 text-xl font-medium">Welcome!</h4>
                     </div>
                     <div className="text-sm sm:text-md">
                        Hello, welcome to Xaosao Chat
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p>Enter your phone number <span className="text-rose-500">*</span></p>
                     <TextField
                        id="standard-basic"
                        variant="standard"
                        placeholder="2078856194"
                        fullWidth
                        required
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                     />
                  </div>

                  {errorMessage &&
                     <p className="text-sm text-rose-500">{errorMessage}</p>
                  }

                  <button
                     type="submit"
                     className={`bg-rose-500 border relative w-full overflow-hidden rounded-lg px-4 py-2 font-medium outline-none lg:px-9 lg:text-lg`}
                  >
                     {isLoading ? (
                        <div className="flex items-center justify-center px-5 space-x-2 text-white">
                           <Loader color="white" size={22} className="animate-spin" />&nbsp;
                           <p className="text-xs uppercase">Loging In....</p>
                        </div>
                     ) : (
                        <div className="flex items-center justify-center space-x-2 text-white">
                           <Send color="white" size={16} />&nbsp;
                           <p className="text-xs uppercase">Login</p>
                        </div>
                     )}
                  </button>
               </form>
            </div>
         </div>
      </>
   );
}
