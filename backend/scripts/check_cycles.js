import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesDir = path.join(__dirname, ".");
const importedModules = new Set();
const moduleStack = [];

function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const imports = [];
    
    // ESM imports
    const esmRegex = /import\s+(?:(?:\{[^}]*\}|\w+|\*\s+as\s+\w+)[^"';]*\s+)?from\s+["']([^"']+)["']/g;
    let match;
    while ((match = esmRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // CommonJS requires
    const cjsRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
    while ((match = cjsRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  } catch (error) {
    return [];
  }
}

function resolveModule(importPath, currentDir) {
  // Skip node_modules imports
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    return null;
  }

  let resolvedPath;
  if (importPath.startsWith(".")) {
    resolvedPath = path.resolve(currentDir, importPath);
  } else {
    resolvedPath = importPath;
  }

  // Try with .js extension
  if (fs.existsSync(resolvedPath + ".js")) {
    return resolvedPath + ".js";
  }
  // Try as directory with index.js
  if (fs.existsSync(path.join(resolvedPath, "index.js"))) {
    return path.join(resolvedPath, "index.js");
  }
  // Try without extension
  if (fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }

  return null;
}

function checkCycles(filePath, stack = []) {
  if (stack.includes(filePath)) {
    return `CYCLE DETECTED: ${[...stack, filePath].join(" -> ")}`;
  }

  const imports = extractImports(filePath);
  const dir = path.dirname(filePath);

  for (const importPath of imports) {
    const resolved = resolveModule(importPath, dir);
    if (resolved && !resolved.includes("node_modules")) {
      const cycle = checkCycles(resolved, [...stack, filePath]);
      if (cycle) return cycle;
    }
  }

  return null;
}

function analyzeModule(filePath) {
  const relPath = path.relative(__dirname, filePath);
  if (relPath.includes("node_modules") || relPath.includes("coverage")) return;

  console.log(`\n📦 ${relPath}`);
  const imports = extractImports(filePath);
  
  if (imports.length > 0) {
    console.log("  Imports:");
    imports.forEach(imp => {
      if (imp.startsWith(".")) {
        console.log(`    → ${imp}`);
      }
    });
  }
}

// Check specific assessment files
const assessmentFiles = [
  "./services/student.assessment.service.js",
  "./controllers/student.assessment.controller.js",
  "./routes/student.assessment.routes.js",
  "./validators/student.assessment.validator.js",
];

console.log("🔍 Checking for circular dependencies in Student Assessment Module...\n");

let cycleFound = false;
assessmentFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const cycle = checkCycles(fullPath);
    if (cycle) {
      console.log(`❌ ${cycle}`);
      cycleFound = true;
    } else {
      console.log(`✅ ${file} - No cycles detected`);
    }
    analyzeModule(fullPath);
  }
});

console.log("\n" + (cycleFound ? "⚠️  Circular dependencies found!" : "✅ No circular dependencies detected"));
