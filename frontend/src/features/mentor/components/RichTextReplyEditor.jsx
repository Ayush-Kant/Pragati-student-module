import React, { useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Code, 
  Link, 
  Image, 
  Send 
} from "lucide-react";

export default function RichTextReplyEditor({ onPostReply }) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onPostReply(content, isAnonymous);
    setContent("");
  };

  const handleToolbarClick = (tag) => {
    // Basic rich text tag insertion helper
    const textarea = document.getElementById("reply-textarea");
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(startPos, endPos);
    
    let replacement = "";
    switch (tag) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "underline":
        replacement = `<u>${selectedText || "underlined text"}</u>`;
        break;
      case "code":
        replacement = `\`${selectedText || "code"}\``;
        break;
      case "bullet":
        replacement = `\n- ${selectedText || "bullet item"}`;
        break;
      case "number":
        replacement = `\n1. ${selectedText || "numbered item"}`;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://example.com)`;
        break;
      case "image":
        replacement = `![${selectedText || "image description"}](https://example.com/image.png)`;
        break;
      default:
        break;
    }

    const newContent = text.substring(0, startPos) + replacement + text.substring(endPos);
    setContent(newContent);
    
    // Focus back on textarea after dynamic insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + replacement.length, startPos + replacement.length);
    }, 50);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col flex-shrink-0"
    >
      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2 select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleToolbarClick("bold")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleToolbarClick("italic")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleToolbarClick("underline")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4 stroke-[2.5]" />
          </button>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => handleToolbarClick("bullet")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Bulleted List"
          >
            <List className="w-4 h-4 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={() => handleToolbarClick("number")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4 stroke-[2.2]" />
          </button>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => handleToolbarClick("code")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Insert Code"
          >
            <Code className="w-4 h-4 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={() => handleToolbarClick("link")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={() => handleToolbarClick("image")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Editor Body Textarea */}
      <div className="flex items-start gap-3 p-4">
        {/* Mentor Avatar icon */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 select-none">
          JS
        </div>
        
        <textarea
          id="reply-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply here... (Markdown tags supported)"
          rows={3}
          className="flex-1 resize-none border-0 p-0 text-sm text-slate-700 placeholder-slate-400 focus:ring-0 focus:outline-none leading-relaxed font-medium"
        />
      </div>

      {/* Editor Footer Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
            Post anonymously
          </span>
        </label>
        
        <button
          type="submit"
          disabled={!content.trim()}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all ${
            content.trim() 
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Reply</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
