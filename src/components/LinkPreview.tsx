import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { fetchMetadata } from "./fetchMetadata";
import "react-loading-skeleton/dist/skeleton.css";
import { useTheme } from "../context/ThemeProvider";

const LinkPreview = ({ url, right }: { url: any; right: boolean }) => {
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const { theme } = useTheme();

  useEffect(() => {
    const getMetadata = async () => {
      setLoading(true);
      const data = await fetchMetadata(url);
      setMetadata(data);

      setLoading(false);
    };

    getMetadata();
  }, [url]);

  return (
    <>
      <div className="w-full rounded-[9px]">
        <a
          target="_blank"
          href={url}
          className={`flex flex-col items-center justify-between gap-2 rounded-xl p-1 text-sm ${right ? "bg-[#FFEDAB]" : "bg-otherMessageBg"} ${theme == "dark" ? "text-white" : "text-black"}`}
        >
          {loading ? (
            <div className="flex h-full w-full gap-2">
              <div className="h-full">
                <Skeleton
                  duration={1}
                  baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
                  highlightColor={theme == "dark" ? "#252525" : "#fff"}
                  className="h-[4.5rem] min-w-20 object-cover"
                />
              </div>
              <div className="h-full w-full">
                <Skeleton
                  duration={1}
                  baseColor={theme == "dark" ? "#1d1d1d" : "#DFDFDF"}
                  highlightColor={theme == "dark" ? "#252525" : "#fff"}
                  className="h-[4.5rem] object-cover"
                />
              </div>
            </div>
          ) : (
            metadata.title && (
              <div className="flex w-full items-center rounded-xl bg-secondary p-1">
                {metadata.image && (
                  <img
                    className="h-16 w-16 min-w-16 rounded-xl object-cover"
                    src={metadata.image}
                    alt={metadata.title}
                  />
                )}
                <div className="p-3 py-1">
                  {metadata.title && (
                    <h3 className="line-clamp-1 text-sm font-medium">
                      {metadata.title}
                    </h3>
                  )}
                  {metadata.description && (
                    <h3 className="line-clamp-3 text-[10px] font-medium leading-[12px] opacity-50">
                      {metadata.description}
                    </h3>
                  )}
                </div>
              </div>
            )
          )}

          <div className="ml-0 mr-auto line-clamp-1 px-3 text-xs text-[#027EB5]">
            {url}
          </div>
        </a>
      </div>
    </>
  );
};

export default LinkPreview;
