/** @type {import('tailwindcss').Config} */
export default {
  content: ["/src/main.tsx", "./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefinSans: ["Josefin Sans"],
        Poppins: ["Poppins"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        borderColor: "var(--border-color)",
        lightText: "var(--light-text)",
        darkText: "var(--dark-text)",
        selectedChat: "#fff1f2",
        messageHead: "#fff1f2",
        otherMessageBg: "var(--other-message-bg)",
        modalBg: "var(--modal-bg)",
        dropdownOptionHover: "var(--dropdown-option-hover)",
        selectedMessage: "var(--selected-message)",
        otherProfileSidebar: "var(--other-profile-sidebar)",
        pdfBg: "var(--pdf-bg)",
        attachIconBg: "var(--attachfile-icon-bg)",
        pinMessageListHeader: "var(--pin-messagelist-header)",
        pinMessageList: "var(--pin-messagelist)",
      },
    },
  },
};