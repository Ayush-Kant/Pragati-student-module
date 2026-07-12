import React, { useRef, useState } from "react";
import { Bold, Italic, Underline, Code, GitCommit, Link, Image as ImageIcon, FileUp, List, Table, FolderOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function RichTextEditor({ register, errors, setValue, watch, templates }) {
  const textareaRef = useRef(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const currentContent = watch("problemStatement") || "";

  // Set reference to register return to capture element ref
  const { ref, ...problemStatementProps } = register("problemStatement");

  const insertFormatting = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue("problemStatement", newValue);

    // Reposition cursor after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleTemplateSelect = (templateContent) => {
    setValue("problemStatement", templateContent);
    setShowTemplates(false);
    toast.success("Template applied successfully!");
  };

  const handleMockFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload
      toast.loading("Uploading file...", { duration: 1000 });
      setTimeout(() => {
        const fileMarkdown = `\n[📎 Attached File: ${file.name}](https://storage.uptoskills.com/uploads/${file.name})\n`;
        setValue("problemStatement", currentContent + fileMarkdown);
        toast.success(`Uploaded ${file.name} successfully!`);
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Project Statement</h3>
          <p className="text-xs text-gray-500">Provide the detailed prompt, setup instructions, and parameters.</p>
        </div>
        
        {/* Templates Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-3 py-1.5 border border-blue-200 text-blue-600 bg-blue-50 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Templates
          </button>
          
          {showTemplates && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
              <h4 className="px-4 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                Select Project Template
              </h4>
              {templates && templates.length > 0 ? (
                templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.content)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs transition-colors flex flex-col gap-0.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="font-semibold text-gray-800">{tpl.title}</span>
                    <span className="text-gray-400 line-clamp-1">{tpl.description}</span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-xs text-gray-400 text-center">No templates loaded.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-gray-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white border-b border-gray-200 p-2.5">
          <button
            type="button"
            title="Bold"
            onClick={() => insertFormatting("**", "**")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => insertFormatting("*", "*")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline"
            onClick={() => insertFormatting("~u_", "_u~")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-gray-200 mx-1" />

          {/* Heading Helpers */}
          <button
            type="button"
            title="Header 1"
            onClick={() => insertFormatting("\n# ", "\n")}
            className="px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            H1
          </button>
          <button
            type="button"
            title="Header 2"
            onClick={() => insertFormatting("\n## ", "\n")}
            className="px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            H2
          </button>
          <button
            type="button"
            title="Header 3"
            onClick={() => insertFormatting("\n### ", "\n")}
            className="px-2 py-1 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            H3
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1" />

          <button
            type="button"
            title="List"
            onClick={() => insertFormatting("\n- ", "\n")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            title="Insert Table"
            onClick={() => insertFormatting("\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Table className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            title="Code Block"
            onClick={() => insertFormatting("\n```javascript\n", "\n```\n")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Mermaid Diagram"
            onClick={() => insertFormatting("\n```mermaid\nflowchart TD\n  Start[Start] --> End(End)\n```\n")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1"
          >
            <GitCommit className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-gray-400">Diagram</span>
          </button>

          <button
            type="button"
            title="Hyperlink"
            onClick={() => insertFormatting("[", "](https://example.com)")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Link className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Insert Image"
            onClick={() => insertFormatting("![Image Description](", ")")}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1" />

          {/* File Upload Trigger */}
          <label
            title="Attach File"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer flex items-center"
          >
            <FileUp className="w-4 h-4" />
            <input
              type="file"
              onChange={handleMockFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.json,.png,.jpg,.jpeg"
            />
          </label>
        </div>

        {/* Text Area Input */}
        <textarea
          {...problemStatementProps}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          rows={12}
          className="w-full p-4 border-0 bg-transparent resize-y focus:ring-0 focus:outline-none text-sm leading-relaxed text-gray-800 font-mono"
          placeholder="Start writing the detailed project requirements, setup instructions, and goals here... Use Markdown or the toolbar."
        />
      </div>

      {errors.problemStatement && (
        <p className="text-xs text-red-500 font-medium">{errors.problemStatement.message}</p>
      )}
    </div>
  );
}
