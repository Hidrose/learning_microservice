import { memo } from "react";

type Props = {
  onCopy: () => void;
};

function MessageAction({ onCopy }: Props) {
  return (
    <div className="flex gap-1 items-center">
      <button onClick={onCopy}>
        <svg
          color="#808089"
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_79_58146)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.33333 1.33325C4.96514 1.33325 4.66667 1.63173 4.66667 1.99992V11.3333C4.66667 11.7014 4.96514 11.9999 5.33333 11.9999H13.3333C13.7015 11.9999 14 11.7014 14 11.3333V1.99992C14 1.63173 13.7015 1.33325 13.3333 1.33325H5.33333ZM6 10.6666V2.66659H12.6667V10.6666H6Z"
              fill="currentColor"
            ></path>
            <path
              d="M3.33333 4.66659C3.33333 4.2984 3.03486 3.99992 2.66667 3.99992C2.29848 3.99992 2 4.2984 2 4.66659V13.9999C2 14.3681 2.29848 14.6666 2.66667 14.6666H10.6667C11.0349 14.6666 11.3333 14.3681 11.3333 13.9999C11.3333 13.6317 11.0349 13.3333 10.6667 13.3333H3.33333V4.66659Z"
              fill="currentColor"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_79_58146">
              <rect
                width="13.3333"
                height="13.3333"
                fill="white"
                transform="translate(1.33337 1.33325)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
}

export default memo(MessageAction);
