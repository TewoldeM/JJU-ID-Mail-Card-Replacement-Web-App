import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Toolbar from "./Toolbar";

const Tiptap = ({
  description,
  onChange,
}: {
  description: string;
  onChange: (richtext: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "min-h-[150px] border border-client", // add border-client class
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[200px] lg:min-w-[450px] max-w-[500px] text-black dark:text-gray-300">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="rounded-none border-none" />
    </div>
  );
};

export default Tiptap;
