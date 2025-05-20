"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function MyTiptapEditor({ value, onChange }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!isClient || !editor) return null;

  const btnStyle = {
    marginRight: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  };

  const activeBtnStyle = {
    ...btnStyle,
    backgroundColor: "#ddd",
    fontWeight: "bold",
  };

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={editor.isActive("bold") ? activeBtnStyle : btnStyle}
          aria-label="Bold"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={editor.isActive("italic") ? activeBtnStyle : btnStyle}
          aria-label="Italic"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={editor.isActive("strike") ? activeBtnStyle : btnStyle}
          aria-label="Strike"
        >
          Strike
        </button>
      </div>

      <EditorContent
        editor={editor}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          minHeight: "300px",
          padding: "8px",
        }}
      />
    </div>
  );
}
