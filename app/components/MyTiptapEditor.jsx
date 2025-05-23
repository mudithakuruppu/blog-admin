"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import History from "@tiptap/extension-history";
import Highlight from "@tiptap/extension-highlight";
import HardBreak from "@tiptap/extension-hard-break";

import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, 
  Image as ImageIcon, Undo2, Redo2, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, 
  Heading3, Code, Highlighter
} from "lucide-react";

export default function EnhancedEditor({ value, onChange }) {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      History,
      Underline,
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      HardBreak,
      Placeholder.configure({
        placeholder: "Start writing your amazing content here...",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose max-w-full min-h-[400px] p-4 outline-none",
      },
      handleKeyDown(view, event) {
        if (event.key === "Enter" && event.shiftKey) {
          editor.commands.setHardBreak();
          return true;
        }
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length);
      localStorage.setItem("editor-draft", html);
    },
  });

  // Load draft from localStorage
  useEffect(() => {
    if(!value){
      const saved = localStorage.getItem("editor-draft");
      if (saved && editor) editor.commands.setContent(saved);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);


  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) localStorage.setItem("editor-draft", editor.getHTML());
    }, 5000);
    return () => clearInterval(interval);
  }, [editor]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          editor?.chain().focus().setImage({ src: reader.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const iconButton = (onClick, Icon, active = false, label = "") => (
    <button
      title={label}
      onClick={onClick}
      className={`p-2 rounded-md ${active ? "bg-gray-300" : "hover:bg-gray-100"} transition`}
    >
      <Icon size={18} />
    </button>
  );

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-md max-w-4xl mx-auto mt-6 p-4">
      {/* Bubble Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-2 bg-white border rounded p-2 shadow-md">
        {iconButton(() => editor.chain().focus().toggleBold().run(), Bold, editor.isActive("bold"), "Bold")}
        {iconButton(() => editor.chain().focus().toggleItalic().run(), Italic, editor.isActive("italic"), "Italic")}
        {iconButton(() => editor.chain().focus().toggleStrike().run(), Strikethrough, editor.isActive("strike"), "Strikethrough")}
        {iconButton(() => editor.chain().focus().toggleUnderline().run(), UnderlineIcon, editor.isActive("underline"), "Underline")}
        {iconButton(() => editor.chain().focus().toggleHighlight().run(), Highlighter, editor.isActive("highlight"), "Highlight")}
        {iconButton(() => editor.chain().focus().toggleCodeBlock().run(), Code, editor.isActive("codeBlock"), "Code Block")}
      </BubbleMenu>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 sticky top-0 bg-white z-10 border-b pb-2">
        {/* Headings */}
        {iconButton(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), Heading1, editor.isActive("heading", { level: 1 }), "Heading 1")}
        {iconButton(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, editor.isActive("heading", { level: 2 }), "Heading 2")}
        {iconButton(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, editor.isActive("heading", { level: 3 }), "Heading 3")}

        {/* Lists */}
        {iconButton(() => editor.chain().focus().toggleBulletList().run(), List, editor.isActive("bulletList"), "Bullet List")}
        {iconButton(() => editor.chain().focus().toggleOrderedList().run(), ListOrdered, editor.isActive("orderedList"), "Numbered List")}

        {/* Alignment */}
        {iconButton(() => editor.chain().focus().setTextAlign("left").run(), AlignLeft, editor.isActive({ textAlign: "left" }), "Align Left")}
        {iconButton(() => editor.chain().focus().setTextAlign("center").run(), AlignCenter, editor.isActive({ textAlign: "center" }), "Align Center")}
        {iconButton(() => editor.chain().focus().setTextAlign("right").run(), AlignRight, editor.isActive({ textAlign: "right" }), "Align Right")}

        {/* Image */}
        {iconButton(handleImageUpload, ImageIcon, false, "Insert Image")}

        {/* Undo/Redo */}
        {iconButton(() => editor.chain().focus().undo().run(), Undo2, false, "Undo")}
        {iconButton(() => editor.chain().focus().redo().run(), Redo2, false, "Redo")}
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} className="bg-gray-50 rounded border min-h-[400px] p-4" />

      {/* Footer Info */}
      <div className="text-sm text-gray-500 mt-2 flex justify-between">
        <span>📝 Word Count: {wordCount}</span>
        <span className="italic">Draft auto-saved</span>
      </div>
    </div>
  );
}
