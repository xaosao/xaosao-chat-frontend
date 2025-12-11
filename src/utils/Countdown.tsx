import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";

import useApiPost from "../hooks/PostData";

interface CountdownProps {
  time: number;
  onReset: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ time, onReset }) => {
  const [seconds, setSeconds] = useState<number>(time);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { postData } = useApiPost();

  // Convert seconds into MM:SS format and handle NaN cases
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      onReset();
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [seconds, isActive, onReset]);

  const handleReset = () => {
    setSeconds(time);
    setIsActive(true);
  };
  let dataToSend = JSON.parse(sessionStorage.getItem("dataToSend")!);

  async function resendOtp() {
    try {
      let registerPhoneRes = await postData("register-phone", {
        country_code: dataToSend.country_code,
        phone_number: dataToSend.phone_number,
      });

      if (registerPhoneRes.success) {
        toast.success("OTP has been resent successfully!");
      }
      handleReset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        onClick={() => {
          if (isActive) {
            toast.error("You can resend otp after 2 minutes");
            return;
          }
          resendOtp();
        }}
        className={`text-sm ml-auto mr-3 w-fit cursor-pointer ${isActive ? "text-[#D8D8D8]" : "text-rose-500"}`}
      >
        Resend OTP
      </div>
      <div className="text-sm text-center text-black">
        <p>Resend OTP in {formatTime(seconds)}</p>
      </div>
    </>
  );
};

export default Countdown;
