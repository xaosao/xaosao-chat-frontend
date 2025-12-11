import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Login from "./Register/Login";
import EnterOtp from "./Register/EnterOtp";
import Chat from "./Home/Chat/Chat";
import Home from "./Home/Home";
import { useEffect } from "react";
import StatusList from "./Home/Status/StatusList";
import Profile from "./Home/Profile/Profile";
import Setting from "./Home/Settings/Settings";
import ImageViewer from "../components/ImageViewer";
import ListenAllEvents from "../socket/ListenAllEvents";
import { useUserProfile } from "../store/api/useUserProfile";
import Contacts from "./Home/Contacts/Contacts";
import CreateGroup from "./Home/Group/CreateGroup";
import AddMemberToGroup from "./Home/Group/AddMemberToGroup";
import AddMemberModal from "./Home/GroupInfo/AddMemberModal";
import ForwardMessageModal from "./Home/MessageList/SelectedMessageOption/ForwardMessageModal";
import StarMessage from "./Home/StarMessage/StarMessage";
import NavigateToSpesificMessage from "../utils/NavigateToSpesificMessage";
import SelectAboutModal from "./Home/Settings/SelectAboutModal";
import UserDetails from "./Register/UserDetails";
import SelectProfilePic from "./Home/Profile/SelectProfilePic";
import ChangeProfileImageModal from "./Home/Profile/ChangeProfileImageModal";
import LoadInitialData from "../components/LoadInitialData";
import ReportUserModal from "./Home/ReportUser/ReportUserModal";
import changeFavicon from "../utils/changeFavicon";
import { useWebsiteSettings } from "../store/api/useWebsiteSettings";
import { Helmet } from "react-helmet";
import PrivacyPolicyDrawer from "./Home/Settings/PrivacyPolicyDrawer";
import { useAppSelector } from "../utils/hooks";
import Cookies from "js-cookie";
import AdminBlockedYou from "../components/AdminBlockedYou";

import SelectLanguageModal from "./Home/Settings/SelectLanguageModal";
import { useFetchLanguageList } from "../store/api/useFetchLanguageList";
import PrivacyPolicyPage from "./Home/Settings/PrivacyPolicyPage";
import VideoCall from "./Home/VideoCall/VideoCall";
import PinMessageModal from "./Home/MessageList/SelectedMessageOption/PinMessageModal";
import CreatePollModal from "./Home/MessageList/SendMessage/CreatePollModal";
import ViewPollVoteModal from "./Home/MessageList/SendMessage/ViewPollVoteModal";
import SendLocationModal from "./Home/Location/SendLocationModal";
import AcceptVideoCall from "./Home/VideoCall/AcceptVideoCall";
// import { updateCurrentConversation } from "../store/Slices/CurrentConversationSlice";
// import { updateViewState } from "../store/Slices/ViewManagerSlice";
import CallDeclinedModal from "./Home/VideoCall/CallDeclinedModal";
import CallHIstory from "./Home/CallHistory/CallHIstory";
import StatusModal from "./Home/Status/StatusModal/StatusModal";
import ViewReactionModal from "./Home/MessageList/SelectedMessageOption/ViewReactionModal";
import LoginWithoutOTP from "./Register/loginWithoutOTP";

const AppRoutes = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { data: websiteSettings } = useWebsiteSettings();
  const userData = useAppSelector((state) => state.userData);
  const { data: languageListRes } = useFetchLanguageList();

  useEffect(() => {
    languageListRes?.languages?.filter((language) => language.language_alignment == "rtl")?.map((e) => {
      const tempStatus_id = Cookies.get("status_id");
      if (e.status_id == Number(tempStatus_id)) {
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
      }
    });
  }, [languageListRes]);

  useEffect(() => {
    if (pathname == "/") {
      navigate("/chat");
    }
  }, [pathname]);
  let { } = useUserProfile();

  useEffect(() => {
    if (!websiteSettings?.settings) {
      return;
    }
    changeFavicon(websiteSettings?.settings[0].website_logo);
  }, [websiteSettings]);

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   const conversationData =
  //     JSON.parse(sessionStorage.getItem("currentConversation")!) || {};

  //   console.log("conversationData:::", conversationData);

  //   dispatch(updateCurrentConversation(conversationData));

  //   if (Object.keys(conversationData).length > 0) {
  //     dispatch(
  //       updateViewState({
  //         show_chats_sidebar: false,
  //       }),
  //     );
  //   }
  // }, []);

  return (
    <>
      {userData.Blocked_by_admin ? (
        <AdminBlockedYou />
      ) : (
        <>
          <div className="">
            <Helmet>
              <title>
                {websiteSettings?.settings
                  ? websiteSettings.settings[0].website_name
                  : ""}
              </title>
            </Helmet>
            <LoadInitialData />
            <ListenAllEvents />
            <ImageViewer />
            <AddMemberModal />
            <ForwardMessageModal />
            <PinMessageModal />
            <SelectAboutModal />
            <NavigateToSpesificMessage />
            <ChangeProfileImageModal />
            <ReportUserModal />
            <PrivacyPolicyDrawer />
            <SelectLanguageModal />
            <CreatePollModal />
            <ViewPollVoteModal />
            <SendLocationModal />
            <AcceptVideoCall />
            <CallDeclinedModal />
            <StatusModal />
            <ViewReactionModal />

            <Routes>
              <Route path="/" element={<Home />}>
                <Route path="profile" element={<Profile />} />
                <Route path="chat" element={<Chat />} />
                <Route path="status" element={<StatusList />} />
                <Route
                  path="add-member-to-group"
                  element={<AddMemberToGroup />}
                />
                <Route path="contact-list" element={<Contacts />} />
                <Route path="setting" element={<Setting />} />
                <Route path="call-history" element={<CallHIstory />} />
                <Route path="star-messages" element={<StarMessage />} />
                <Route path="create-group" element={<CreateGroup />} />
              </Route>
              <Route path="video-call" element={<VideoCall />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-without-otp" element={<LoginWithoutOTP />} />
              <Route path="/user-details" element={<UserDetails />} />
              <Route path="/select-profile" element={<SelectProfilePic />} />
              <Route path="/otp-verification" element={<EnterOtp />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
};

export default AppRoutes;
