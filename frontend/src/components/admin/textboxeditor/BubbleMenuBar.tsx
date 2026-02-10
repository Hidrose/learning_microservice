import { memo } from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import BlockStyleTool from "./toolbar/BlockStyleTool";
import ButtonTool from "./toolbar/ButtonTool";
import EditTableTool from "./toolbar/EditTableTool";

function BubbleMenuBar({ editor }: { editor: Editor | null }) {
  return (
    <>
      {editor && (
        <BubbleMenu
          options={{
            strategy: "absolute",
            placement: "top-end",
          }}
          shouldShow={({ editor }) =>
            editor.isActive("table") ||
            editor.isActive("heading", { level: 1 }) ||
            editor.isActive("heading", { level: 2 }) ||
            editor.isActive("heading", { level: 3 }) ||
            editor.isActive("heading", { level: 4 }) ||
            editor.isActive("paragraph")
          }
          editor={editor}
        >
          <div className="bg-white flex items-center flex-wrap gap-x-0.5 border border-gray-300 shadow-md">
            <BlockStyleTool editor={editor} />

            <ButtonTool editor={editor} visibleTools={[2, 3, 4, 5, 6, 7]} />

            <EditTableTool editor={editor} />
          </div>
        </BubbleMenu>
      )}
    </>
  );
}

export default memo(BubbleMenuBar);
