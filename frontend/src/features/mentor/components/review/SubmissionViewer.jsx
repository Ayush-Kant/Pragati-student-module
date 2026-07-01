import PreviewTabs from "./PreviewTabs";
import CodeViewer from "./CodeViewer";

export default function SubmissionViewer({ selectedFile }) {

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

    <div className="bg-white border rounded-xl overflow-hidden">

      <PreviewTabs />

      <CodeViewer
        code={fileContent[selectedFile]}
      />

    </div>

  );

}