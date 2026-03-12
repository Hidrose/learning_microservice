import React from "react";
import { Link } from "react-router-dom";

interface Props {
  items: {
    name: string;
    href?: string;
  }[];
}

const BreadCrumb = ({ items }: Props) => {
  return (
    <div className="px-[15px]">
      <div className="w-full mx-auto max-w-[1200px] overflow-x-auto">
        <nav className="py-4">
          <ol className="flex items-center gap-1.5 text-[0.9rem] text-gray-500 font-medium whitespace-nowrap">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <li className="flex items-center gap-1">
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="!inline-flex items-center gap-1 hover:text-black"
                    >
                      {index === 0 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-house"
                          aria-hidden="true"
                        >
                          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        </svg>
                      )}
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-black">{item.name}</span>
                  )}
                </li>

                {index < items.length - 1 && (
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="10"
                      height="10"
                      className="lucide lucide-chevron-right"
                      aria-hidden="true"
                      viewBox="8 5 8 14"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadCrumb;
