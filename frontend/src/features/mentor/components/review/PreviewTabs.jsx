import { useState } from "react";
import { Code2, Eye, FileText, ExternalLink } from "lucide-react";

const sampleCode = `const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

// Middleware

app.use(express.json());

// Routes

app.get("/api/products", (req, res) => {
    res.json({ message: "Products List" });
});

app.listen(port, () => {
    console.log("Server running");
});`;

export default function PreviewTabs() {
  const [active, setActive] = useState("code");

  const tabClass = (value) =>
    `flex items-center gap-2 px-4 py-3 border-b-2 transition ${
      active === value
        ? "border-blue-600 text-blue-600 font-semibold"
        : "border-transparent text-gray-600 hover:text-blue-600"
    }`;

  return (
    <div className="flex flex-col h-full">

      <div className="flex border-b">

        <button
          onClick={() => setActive("code")}
          className={tabClass("code")}
        >
          <Code2 size={16}/>
          Source Code
        </button>

        <button
          onClick={() => setActive("preview")}
          className={tabClass("preview")}
        >
          <Eye size={16}/>
          Live Preview
        </button>

        <button
          onClick={() => setActive("pdf")}
          className={tabClass("pdf")}
        >
          <FileText size={16}/>
          PDF Report
        </button>

        <button className="ml-auto flex items-center gap-2 text-blue-600 px-4">
          <ExternalLink size={16}/>
          Open Full
        </button>

      </div>

      <div className="flex-1 overflow-auto bg-black">

        {active === "code" && (
          <pre className="text-gray-100 text-sm p-8 whitespace-pre-wrap">
            {sampleCode}
          </pre>
        )}

        {active === "preview" && (
          <iframe
            title="preview"
            src="https://example.com"
            className="w-full h-full bg-white"
          />
        )}

        {active === "pdf" && (
          <iframe
            title="pdf"
            src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
            className="w-full h-full bg-white"
          />
        )}

      </div>

    </div>
  );
}