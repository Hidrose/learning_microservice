import { Editor } from "@tiptap/react";
import { useState } from "react";

function EditTableTool({ editor }: { editor: Editor | null }) {
  const [openTableEditRow, setOpenTableEditRow] = useState<boolean>(false);
  const [openTableEditCol, setOpenTableEditCol] = useState<boolean>(false);
  const [openTableEditTable, setOpenTableEditTable] = useState<boolean>(false);

  const toggleTableEditRow = () => {
    setOpenTableEditRow((prev) => !prev);
  };

  const toggleTableEditCol = () => {
    setOpenTableEditCol((prev) => !prev);
  };

  const toggleTableEditTable = () => {
    setOpenTableEditTable((prev) => !prev);
  };

  const editTableTools = [
    {
      label: (
        <svg fill="#5F6368" className="w-4.5 h-4.5" viewBox="2 2 13 12">
          <path
            fillRule="evenodd"
            d="M2,2v12h13V2H2z M6,13H3v-2h3V13z M6,10H3V8h3V10z M6,7H3V5h3V7z M10,13H7v-2h3V13z M10,10H7V8h3V10z M10,7H7V5h3V7z M14,13h-3v-2h3V13z M14,10h-3V8h3V10z M14,7h-3V5h3V7z"
          ></path>
        </svg>
      ),
      title: "Table",
      onClick: () => toggleTableEditTable(),
      isOpen: openTableEditTable,
      children: [
        {
          label: (
            <>
              <svg fill="#444" viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path d="M14,5h-3V4h-1v1H7V4H6v1H3V4H2v11h13V4h-1V5z M6,14H3v-2h3V14z M6,11H3V9h3V11z M6,8H3V6h3V8z M10,14H7v-2h3V14z M10,11H7V9h3V11z M10,8H7V6h3V8z M14,14h-3v-2h3V14z M14,11h-3V9h3V11z M14,8h-3V6h3V8z M2,1h13v2H2V1z" />
              </svg>

              <span>Header table</span>
            </>
          ),
          onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
          active: editor?.isActive("tableHeader"),
        },
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M9.4,3H7.5l-1,1l2,2H10v2H7V7.4L5.9,8.5L5.5,8H3V7.5l-1,1V15h13V3H9.4z M6,14H3v-2h3V14z M6,11H3V9 h3V11z M10,14H7v-2h3V14z M10,11H7V9h3V11z M14,14h-3v-2h3V14z M14,11h-3V9h3V11z M14,7.8V8h-3V6h3V7.8z"
                ></path>
                <path
                  fill="#A1260D"
                  d="M5,4l2,2L5.9,7.1l-2-2l-2,2L0.9,6l2-2l-2-2L2,1l2,2l2-2L7,2.1L5,4z"
                ></path>
              </svg>

              <span>Delete table</span>
            </>
          ),
          onClick: () => editor?.chain().focus().deleteTable().run(),
        },
      ],
    },
    {
      label: (
        <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
          <path
            fill="#F0EFF1"
            d="M7,13h3v-2H7V13z M7,10h3V8H7V10z M7,7h3V5H7V7z M11,13h3v-2h-3V13z M11,10h3V8h-3V10z M11,5v2h3V5H11z"
          ></path>
          <path
            fill="#666666"
            d="M11,8h3v2h-3V8z M7,10h3V8H7V10z M3,8v2h3V8H3z"
          ></path>
          <path
            fill="#5F6368"
            d="M2,2v12h13V2H2z M6,13H3v-2h3V13z M6,10H3V8h3V10z M6,7H3V5h3V7z M10,13H7v-2h3V13z M10,10H7V8h3V10z M10,7H7V5h3V7z M14,13h-3v-2h3V13z M14,10h-3V8h3V10z M14,7h-3V5h3V7z"
          ></path>
        </svg>
      ),
      title: "Table row",
      onClick: () => toggleTableEditRow(),
      isOpen: openTableEditRow,
      children: [
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M11,4v4H6V4H2v11h13V4H11z M5,14H3v-2h2V14z M5,8H3V6h2V8z M8,14H6v-2h2V14z M11,14H9v-2h2V14z M14,14h-2v-2h2V14z M14,8h-2V6h2V8z"
                ></path>
                <path
                  fill="#A1260D"
                  d="M8,3L7,4V2.5L8.5,1L10,2.5V4L9,3v4H8V3z"
                ></path>
              </svg>

              <span>Insert row above</span>
            </>
          ),
          onClick: () => editor?.chain().focus().addRowBefore().run(),
        },
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M2,1v11h4V9h1V8h3v1h1v3h4V1H2z M5,11H3V9h2V11z M5,5H3V3h2V5z M8,5H6V3h2V5z M11,5H9V3h2V5z M14,11h-2V9h2V11z M14,5h-2V3h2V5z"
                ></path>
                <path
                  fill="#A1260D"
                  d="M9,13l1-1v1.5L8.5,15L7,13.5V12l1,1V9h1V13z"
                ></path>
              </svg>

              <span>Insert row below</span>
            </>
          ),
          onClick: () => editor?.chain().focus().addRowAfter().run(),
        },
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M10,8.5V10H2V7h6.5l-1-1H7V2H1v13h6v-4h4V7.5L10,8.5z M2,3h4v3H2V3z M6,14H2v-3h4V14z"
                ></path>
                <path
                  fill="#A1260D"
                  d="M13,4l2,2l-1.1,1.1l-2-2l-2,2L8.9,6l2-2l-2-2L10,1l2,2l2-2L15,2.1C15,2.1,13,4,13,4z"
                ></path>
              </svg>

              <span>Delete row</span>
            </>
          ),
          onClick: () => editor?.chain().focus().deleteRow().run(),
        },
      ],
    },
    {
      label: (
        <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
          <g>
            <path
              fill="#F0EFF1"
              d="M7,13h3v-2H7V13z M7,10h3V8H7V10z M7,7h3V5H7V7z M11,13h3v-2h-3V13z M11,10h3V8h-3V10z M11,5v2h3V5H11z"
            ></path>
            <path
              fill="#666666"
              d="M7,11h3v2H7V11z M7,10h3V8H7V10z M7,5v2h3V5H7z"
            ></path>
          </g>
          <g>
            <path
              fill="#5F6368"
              d="M2,2v12h13V2H2z M6,13H3v-2h3V13z M6,10H3V8h3V10z M6,7H3V5h3V7z M10,13H7v-2h3V13z M10,10H7V8h3V10z M10,7H7V5h3V7z M14,13h-3v-2h3V13z M14,10h-3V8h3V10z M14,7h-3V5h3V7z"
            ></path>
          </g>
        </svg>
      ),
      title: "Table column",
      onClick: () => toggleTableEditCol(),
      isOpen: openTableEditCol,
      children: [
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M5,1v5h3v5H5v4h10V1H5z M8,14H6v-2h2V14z M8,5H6V3h2V5z M14,14h-2v-2h2V14z M14,11h-2V9h2V11z M14,8h-2V6h2V8z M14,5h-2V3h2V5z"
                ></path>
                <path
                  fill="#00539C"
                  d="M3,9l1,1H2.5L1,8.5L2.5,7H4L3,8h4v1H3z"
                ></path>
              </svg>

              <span>Insert column left</span>
            </>
          ),
          onClick: () => editor?.chain().focus().addColumnBefore().run(),
        },
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M11,1H1v14h10v-4H9.6H8v-1V7V6h1.6H11V1z M4,14H2v-2h2V14z M4,11H2V9h2V11z M4,8H2V6h2V8z M4,5H2V3h2V5z M10,12v2H8v-2H10z M10,5H8V3h2V5z"
                ></path>
                <path
                  fill="#00539C"
                  d="M15,8.5L13.5,10H12l1-1H9V8h4l-1-1h1.5L15,8.5z"
                ></path>
              </svg>

              <span>Insert column right</span>
            </>
          ),
          onClick: () => editor?.chain().focus().addColumnAfter().run(),
        },
        {
          label: (
            <>
              <svg viewBox="2 2 13 12" className="w-4.5 h-4.5">
                <path
                  fill="#5F6368"
                  d="M2,1v6h4v0.6l1,1V2h3v8H8.4l0.1,0.1L7.5,11H11V7h4V1H2z M6,6H3V2h3V6z M14,6h-3V2h3V6z"
                ></path>
                <path
                  fill="#A1260D"
                  d="M5,12l2,2l-1.1,1.1l-2-2l-2,2L0.9,14l2-2l-2-2L2,9l2,2l2-2L7,10.1L5,12z"
                ></path>
              </svg>

              <span>Delete column</span>
            </>
          ),

          onClick: () => editor?.chain().focus().deleteColumn().run(),
        },
      ],
    },
  ];
  return (
    <>
      {editTableTools.map((tool, i) => (
        <div
          key={`bb-${i}`}
          title={tool.title}
          className="relative"
          onMouseEnter={tool.onClick}
          onMouseLeave={tool.onClick}
        >
          <button
            type="button"
            className="p-2 flex items-center gap-1 hover:bg-gray-100 bg-gray-50"
          >
            {tool.label}
          </button>

          {tool.isOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full  min-w-max bg-white z-10 border border-gray-200 shadow-md">
              {tool.children.map((child, index) => (
                <button
                  key={`cc-${index}`}
                  type="button"
                  onClick={child.onClick}
                  className={`flex items-center w-full p-2 gap-1.5 bg-gray-50 ${
                    child.active ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default EditTableTool;
