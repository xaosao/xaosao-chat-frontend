import { useQuery } from "react-query";
import axios from "axios";
import { getAuthToken } from "../../utils/getAuthToken";
import { LanguageListRes } from "../../types/ResType";

export const useFetchLanguageList = () => {
  const token = getAuthToken();

  return useQuery<LanguageListRes, Error>(
    ["List-Language"],
    async () => {
      const response = await axios.post<LanguageListRes>(
        `${import.meta.env.VITE_API_URL}List-Language`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
