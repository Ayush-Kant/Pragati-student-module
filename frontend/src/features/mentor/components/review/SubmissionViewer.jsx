import { useState } from "react";

import PreviewTabs from "./PreviewTabs";
import CodeViewer from "./CodeViewer";
import FileExplorer from "./FileExplorer";

export default function SubmissionViewer({ selectedFile, onSelect }) {
  const [activeTab, setActiveTab] = useState("code");

  const fileContent = {
    "app.js": `const express = require("express");

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
});
`,

    "routes.js": `const router = require("express").Router();

router.get("/users", (req, res) => {
    res.json(["John", "Alex"]);
});

module.exports = router;
`,

    "package.json": `{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^5.0.0"
  }
}`
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden flex flex-col h-full min-h-0">

      <PreviewTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* SOURCE CODE */}
      {activeTab === "code" && (
        <div className="grid grid-cols-[260px_1fr] flex-1 min-h-0 overflow-hidden">

          <FileExplorer
            selectedFile={selectedFile}
            onSelect={onSelect}
          />

          <CodeViewer
            code={fileContent[selectedFile]}
            selectedFile={selectedFile}
          />

        </div>
      )}

      {/* LIVE PREVIEW */}
      {activeTab === "preview" && (
        <iframe
          title="preview"
          src="https://example.com"
          className="w-full flex-1 bg-white"
        />
      )}

      {/* PDF REPORT */}
      {activeTab === "pdf" && (
        <iframe
          title="pdf"
          src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          className="w-full flex-1 bg-white"
        />
      )}

    </div>
  );
}