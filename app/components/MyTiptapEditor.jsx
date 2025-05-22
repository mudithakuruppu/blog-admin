"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";

export default function MyTiptapEditor({ value, onChange }) {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      History,
      Underline,
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length);
      localStorage.setItem("editor-draft", html);
    },
  });

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem("editor-draft");
    if (saved && editor) {
      editor.commands.setContent(saved);
    }
  }, [editor]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        localStorage.setItem("editor-draft", editor.getHTML());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [editor]);

  if (!editor) return null;

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const buttonStyle = (active) => ({
    marginRight: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: active ? "#ddd" : "#f9f9f9",
    fontWeight: active ? "bold" : "normal",
  });

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        Width: "1200px",
        margin: "0 auto",
        backgroundColor: "#fafafa",
        boxSizing: "border-box",
        minHeight: "500px"
      }}
    >
      {/* Floating Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button
          style={buttonStyle(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          style={buttonStyle(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          style={buttonStyle(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          style={buttonStyle(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
      </BubbleMenu>

      {/* Toolbar */}
      <div style={{ marginBottom: "8px", flexWrap: "wrap", display: "flex" }}>
        {/* Heading Levels */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={buttonStyle(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={buttonStyle(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={buttonStyle(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={buttonStyle(editor.isActive("bulletList"))}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={buttonStyle(editor.isActive("orderedList"))}
        >
          Numbered List
        </button>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          style={buttonStyle(editor.isActive({ textAlign: "left" }))}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          style={buttonStyle(editor.isActive({ textAlign: "center" }))}
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          style={buttonStyle(editor.isActive({ textAlign: "right" }))}
        >
          Right
        </button>

        {/* Image Upload */}
        <button onClick={handleImageUpload} style={buttonStyle(false)}>
          Image
        </button>

        {/* Undo / Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          style={buttonStyle(false)}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          style={buttonStyle(false)}
        >
          Redo
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          minHeight: "500px",
          padding: "12px",
          backgroundColor: "#fff",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      />

      {/* Word Count */}
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        📝 Word Count: {wordCount}
        <span style={{ float: "right" }}>Draft auto-saved…</span>
      </div>
    </div>
  );
}
