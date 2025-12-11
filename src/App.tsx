import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { store } from "./store/store";
import { Provider } from "react-redux";
import AppRoutes from "./pages/Routes";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { getAuthToken } from "./utils/getAuthToken";

import { FileProvider } from "./context/FileProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StreamProvider } from "./context/StreamProvider";
import ScrrollToTop from "../src/components/ScrrollToTop";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // ✅ disable retries
        refetchOnWindowFocus: false, // optional: disable on window focus
        refetchOnReconnect: false, // optional
        refetchOnMount: false, // optional
      },
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();

    // apao_edit
    if (!token) {
      navigate("/login-without-otp")
    }

    // if (!token) {
    //   if (
    //     location.pathname != "/privacy-policy" &&
    //     location.pathname != "/otp-verification"
    //   ) {
    //     navigate("/login");
    //   }
    // }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("callStartTime");
  }, []);

  return (
    <>
      {/* Set meta tags with react-helmet ====================================================================================*/}
      <Helmet>
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Whoxa web chat" />
        <meta
          property="og:description"
          content="Boost your business with an affordable, customizable WhatsApp Web clone that enhances communication and drives growth effortlessly."
        />
        <meta property="og:url" content="https://whoxachat.com/" />
        <meta property="og:site_name" content="Whoxa web chat" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/primocys/image/upload/v1732606603/Chat_web_banner/Overview_kq7dcg.jpg"
        />
      </Helmet>
      <ScrrollToTop />
      <Provider store={store}>
        <ThemeProvider>
          <StreamProvider>
            <QueryClientProvider client={queryClient}>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_Google_Client_ID}
              >
                <FileProvider>
                  <AppRoutes />
                </FileProvider>
              </GoogleOAuthProvider>
            </QueryClientProvider>
          </StreamProvider>
        </ThemeProvider>
      </Provider>
      <Toaster
        toastOptions={{ duration: 3000 }}
        position="bottom-right"
        reverseOrder={false}
      />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
