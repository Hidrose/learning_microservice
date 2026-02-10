import { memo, useEffect, useState } from "react";
import Image from "../../../Image";
import ToolTip from "../../ToolTip";
type Props = {
  onClose: () => void;
  onExpand: () => void;
  isExpanded: boolean;
};

function ChatHeader({ onClose, onExpand, isExpanded }: Props) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Image
          source="/assets/troly.png"
          alt="troly"
          className="w-12 h-12 rounded-full"
          loading="eager"
        />
        <h5 className="font-medium">Trợ lý AI</h5>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <ToolTip
            text={isExpanded ? "Thu nhỏ khung chat" : "Mở rộng khung chat"}
          />

          {!isMobile && (
            <button
              onClick={onExpand}
              className="p-2 hover:bg-gray-200 rounded-sm"
              title={isExpanded ? "Thu nhỏ khung chat" : "Mở rộng khung chat"}
            >
              {isExpanded ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="11 11 18 18"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M27.2929 11.2929C27.6834 10.9024 28.3166 10.9024 28.7071 11.2929C29.0976 11.6834 29.0976 12.3166 28.7071 12.7071L24.4142 17H27C27.5523 17 28 17.4477 28 18C28 18.5523 27.5523 19 27 19H22C21.4477 19 21 18.5523 21 18V13C21 12.4477 21.4477 12 22 12C22.5523 12 23 12.4477 23 13V15.5858L27.2929 11.2929ZM12 22C12 21.4477 12.4477 21 13 21H18C18.5523 21 19 21.4477 19 22V27C19 27.5523 18.5523 28 18 28C17.4477 28 17 27.5523 17 27V24.4142L12.7071 28.7071C12.3166 29.0976 11.6834 29.0976 11.2929 28.7071C10.9024 28.3166 10.9024 27.6834 11.2929 27.2929L15.5858 23H13C12.4477 23 12 22.5523 12 22Z"
                    fill="#27272A"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="11 11 18 18"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 13C11 11.8954 11.8954 11 13 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V27H27V23C27 22.4477 27.4477 22 28 22C28.5523 22 29 22.4477 29 23V27C29 28.1046 28.1046 29 27 29H13C11.8954 29 11 28.1046 11 27V13ZM22 13C21.4477 13 21 12.5523 21 12C21 11.4477 21.4477 11 22 11H28C28.5523 11 29 11.4477 29 12V18C29 18.5523 28.5523 19 28 19C27.4477 19 27 18.5523 27 18V14.4142L18.7071 22.7071C18.3166 23.0976 17.6834 23.0976 17.2929 22.7071C16.9024 22.3166 16.9024 21.6834 17.2929 21.2929L25.5858 13H22Z"
                    fill="#27272A"
                  ></path>
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="relative group">
          <ToolTip text={"Đóng khung chat"} />

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="3.33 3.33 13.33 13.33"
            >
              <path
                d="M3.57739 15.2441C3.25195 15.5695 3.25195 16.0971 3.57739 16.4226C3.90283 16.748 4.43047 16.748 4.7559 16.4226L9.99998 11.1785L15.2441 16.4226C15.5695 16.748 16.0971 16.748 16.4226 16.4226C16.748 16.0971 16.748 15.5695 16.4226 15.2441L11.1785 9.99998L16.4226 4.7559C16.748 4.43047 16.748 3.90283 16.4226 3.57739C16.0971 3.25195 15.5695 3.25195 15.2441 3.57739L9.99998 8.82147L4.7559 3.57739C4.43047 3.25196 3.90283 3.25196 3.57739 3.57739C3.25195 3.90283 3.25195 4.43047 3.57739 4.7559L8.82147 9.99998L3.57739 15.2441Z"
                className="fill-gray-600"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatHeader);
