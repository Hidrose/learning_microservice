import { Editor } from "@tiptap/react";
import { memo, useEffect, useState } from "react";
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuItalic,
  LuList,
  LuListOrdered,
  LuRedo,
  LuUnderline,
  LuUndo,
} from "react-icons/lu";
import { GoHorizontalRule } from "react-icons/go";
import { BsQuote } from "react-icons/bs";
function ButtonTool({
  editor,
  visibleTools,
}: {
  editor: Editor | null;
  visibleTools?: number[];
}) {
  const [activeMarks, setActiveMarks] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateActiveMarks = () => {
      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
      });
    };

    editor.on("selectionUpdate", updateActiveMarks);
    editor.on("transaction", updateActiveMarks);

    // clean up
    return () => {
      editor.off("selectionUpdate", updateActiveMarks);
      editor.off("transaction", updateActiveMarks);
    };
  }, [editor]);

  const handleUndo = () => {
    editor?.chain().focus().undo().run();
  };

  const handleRedo = () => {
    editor?.chain().focus().redo().run();
  };

  const handleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const handleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const handleUnderline = () => {
    editor?.chain().focus().toggleUnderline().run();
  };

  const handleAlign = (pos: "left" | "center" | "right") => {
    editor?.chain().focus().setTextAlign(pos).run();
  };

  const handleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const handleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const handleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run();
  };

  const handleHorizontalRule = () => {
    editor?.chain().focus().setHorizontalRule().run();
  };

  const buttonTools = [
    {
      label: <LuUndo size={18} />,
      onClick: handleUndo,
      active: false,
      title: "Undo",
    },
    {
      label: <LuRedo size={18} />,
      onClick: handleRedo,
      active: false,
      title: "Redo",
    },
    {
      label: <LuBold size={18} />,
      onClick: handleBold,
      active: activeMarks.bold,
      title: "Bold (Ctrl + B)",
    },
    {
      label: <LuItalic size={18} />,
      onClick: handleItalic,
      active: activeMarks.italic,
      title: "Italic (Ctrl + I)",
    },
    {
      label: <LuUnderline size={18} />,
      onClick: handleUnderline,
      active: activeMarks.underline,
      title: "Underline (Ctrl + U)",
    },
    {
      label: <LuAlignLeft size={18} />,
      onClick: () => handleAlign("left"),
      active: editor?.isActive({ textAlign: "left" }),
      title: "Justify left",
    },
    {
      label: <LuAlignCenter size={18} />,
      onClick: () => handleAlign("center"),
      active: editor?.isActive({ textAlign: "center" }),
      title: "Justify center",
    },
    {
      label: <LuAlignRight size={18} />,
      onClick: () => handleAlign("right"),
      active: editor?.isActive({ textAlign: "right" }),
      title: "Justify right",
    },
    {
      label: <LuList size={18} />,
      onClick: handleBulletList,
      active: editor?.isActive("bulletList"),
      title: "Bullet list",
    },
    {
      label: <LuListOrdered size={18} />,
      onClick: handleOrderedList,
      active: editor?.isActive("orderedList"),
      title: "Ordered list",
    },
    {
      label: <BsQuote size={18} />,
      onClick: handleBlockquote,
      active: editor?.isActive("blockquote"),
      title: "Block quote",
    },
    {
      label: <GoHorizontalRule size={18} />,
      onClick: handleHorizontalRule,
      active: editor?.isActive("horizontalRule"),
      title: "Horizontal rule",
    },
  ];

  const tools =
    visibleTools && visibleTools.length > 0
      ? buttonTools.filter((_, index) => visibleTools.includes(index))
      : buttonTools;

  return (
    <>
      {tools.map((tool, index) => (
        <button
          key={`btn-tool-${index}`}
          type="button"
          onClick={tool.onClick}
          title={tool.title}
          className={`p-2 rounded-md transition ${
            tool.active ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          {tool.label}
        </button>
      ))}
    </>
  );
}

export default memo(ButtonTool);
