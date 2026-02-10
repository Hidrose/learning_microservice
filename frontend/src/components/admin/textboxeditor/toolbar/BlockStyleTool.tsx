import type { Level } from "@tiptap/extension-heading";
import { Editor } from "@tiptap/react";
import { memo, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";

function BlockStyleTool({ editor }: { editor: Editor | null }) {
  const [openBlockStyle, setOpenBlockStyle] = useState<boolean>(false);
  const [currentBlock, setCurrentBlock] = useState<string>("Paragraph");

  useEffect(() => {
    if (!editor) return;

    const handlerBlockStyle = ({ editor }: any) => {
      const level = [1, 2, 3, 4].find((lvl) =>
        editor.isActive("heading", { level: lvl })
      );
      setCurrentBlock(level ? `Heading ${level}` : "Paragraph");
    };

    editor.on("selectionUpdate", handlerBlockStyle);

    // clean up
    return () => {
      editor.off("selectionUpdate", handlerBlockStyle);
    };
  }, [editor]);

  const toggleBlockStyle = () => {
    setOpenBlockStyle((prev) => !prev);
  };

  const handleSetParagraph = () => {
    editor?.chain().focus().setParagraph().run();
    setCurrentBlock("Paragraph");
  };

  const handleSetHeading = (level: Level) => {
    editor?.chain().focus().toggleHeading({ level }).run();
    setCurrentBlock(`Heading ${level}`);
  };

  const blockStyles = [
    {
      label: "Paragraph",
      onClick: () => handleSetParagraph,
      active: editor?.isActive("paragraph"),
    },
    {
      label: "Heading 1",
      onClick: () => handleSetHeading(1),
      active: editor?.isActive("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      onClick: () => handleSetHeading(2),
      active: editor?.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      onClick: () => handleSetHeading(3),
      active: editor?.isActive("heading", { level: 3 }),
    },
    {
      label: "Heading 4",
      onClick: () => handleSetHeading(4),
      active: editor?.isActive("heading", { level: 4 }),
    },
  ];

  return (
    <div
      className="relative"
      onMouseOver={toggleBlockStyle}
      onMouseOut={toggleBlockStyle}
    >
      <button
        type="button"
        title={"Block style"}
        className="w-[130px] border-r border-gray-300 px-[6px] flex items-center gap-1.5 justify-between hover:bg-gray-100 bg-gray-50"
      >
        {currentBlock} <IoIosArrowDown size={14} />
      </button>

      {openBlockStyle && (
        <div className="absolute left-0 top-full bg-white w-[130px] z-10 border border-gray-200 shadow-md">
          {blockStyles?.map((block, index) => (
            <div key={`block-${index}`}>
              <button
                type="button"
                onClick={block.onClick}
                className={`flex items-center justify-between w-full p-1.5  ${
                  block.active ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <span>{block.label}</span>
                {block.active && <IoCheckmark size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(BlockStyleTool);
