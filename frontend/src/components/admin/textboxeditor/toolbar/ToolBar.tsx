import { memo } from "react";
import { Editor } from "@tiptap/react";
import BlockStyleTool from "./BlockStyleTool";
import ButtonTool from "./ButtonTool";
import TableTool from "./TableTool";
import LinkTool from "./LinkTool";

function ToolBar({ editor }: { editor: Editor | null }) {
  return (
    <div className="border border-gray-300 border-b-0 bg-gray-50 w-full">
      <div className="flex items-center flex-wrap gap-x-0.5">
        <BlockStyleTool editor={editor} />

        <ButtonTool editor={editor} />

        <LinkTool editor={editor} />

        <TableTool editor={editor} />
      </div>
    </div>
  );
}

export default memo(ToolBar);
