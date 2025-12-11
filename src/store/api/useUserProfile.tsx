import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { getAuthToken, removeAuthTokens } from "../../utils/getAuthToken";
import { UserDataRes } from "../../types/UserDataType";
import { updateUserData } from "../Slices/UserSlice";

export const useUserProfile = () => {
  const dispatch = useDispatch();
  const token = getAuthToken();

  return useQuery<UserDataRes, AxiosError>(
    ["user-details", token],
    async () => {
      try {
        const response = await axios.post<UserDataRes>(
          `${import.meta.env.VITE_API_URL}user-details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-custom-header": "Web",
            },
          },
        );

        // Check if account deleted
        if (
          response.data.resData?.is_account_deleted ||
          !response.data.resData
        ) {
          removeAuthTokens(); // clear token
          localStorage.clear();
          sessionStorage.clear();
          if (window.location.pathname !== "/login-without-otp") {
            window.location.href = "/login-without-otp";
          }
        }

        // Dispatch user data into Redux
        dispatch(updateUserData(response.data.resData));

        return response.data;
      } catch (error) {
        // Handle unauthorized (expired/invalid token)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          removeAuthTokens();
          localStorage.clear();
          sessionStorage.clear();
          if (window.location.pathname !== "/login-without-otp") {
            window.location.href = "/login-without-otp";
          }
        }
        throw error; // rethrow so React Query can handle error states
      }
    },
    {
      staleTime: Infinity, // never stale
      cacheTime: Infinity, // never garbage collected
    },
  );
};
