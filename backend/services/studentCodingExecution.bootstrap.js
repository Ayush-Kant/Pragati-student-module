/*
 * Judge0 execution adapter for the student coding challenge editor.
 *
 * The editor intentionally presents interview-style Solution methods/classes.
 * Judge0, however, executes complete programs. This bootstrap wraps the
 * student's source only for execution; the original source remains unchanged
 * in challenge_submissions history.
 */

const LANGUAGE_IDS = Object.freeze({ javascript: 63, python: 71, java: 62, cpp: 54 });
const originalFetch = globalThis.fetch;

const encode = (value) => Buffer.from(String(value ?? ''), 'utf8').toString('base64');
const decode = (value) => {
  if (!value) return '';
  try { return Buffer.from(value, 'base64').toString('utf8'); } catch { return String(value); }
};

const splitInputLines = (stdin) => String(stdin ?? '').trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const javascriptWrapper = (source) => {
  if (/process\.stdin|readFileSync\s*\(\s*0\)|require\s*\(\s*['"]fs['"]\s*\)/.test(source)) return source;
  return `${source}\n\nconst __input = require('fs').readFileSync(0, 'utf8').trim().split(/\\r?\\n/).map((line) => line.trim()).filter(Boolean);\nconst __parse = (line) => {\n  try { return JSON.parse(line); }\n  catch {\n    const n = Number(line);\n    return Number.isNaN(n) ? line : n;\n  }\n};\nconst __args = __input.map(__parse);\nconst __result = solution(...__args);\nprocess.stdout.write(typeof __result === 'string' ? __result : JSON.stringify(__result));\n`;
};

const pythonWrapper = (source) => {
  if (/if\s+__name__\s*==\s*['"]__main__['"]/.test(source) || /sys\.stdin|input\s*\(/.test(source)) return source;
  return `import ast\nimport json\n\n${source}\n\n__lines = [line.strip() for line in __import__('sys').stdin.read().splitlines() if line.strip()]\ndef __parse(line):\n    try:\n        return ast.literal_eval(line)\n    except Exception:\n        try:\n            return int(line)\n        except ValueError:\n            try:\n                return float(line)\n            except ValueError:\n                return line\n__args = [__parse(line) for line in __lines]\n__result = Solution().solution(*__args)\nif isinstance(__result, (list, dict, tuple, bool, int, float)) or __result is None:\n    print(json.dumps(__result, separators=(',', ':')))\nelse:\n    print(__result)\n`;
};

const javaParser = `\n  private static Object parseValue(Class<?> type, String raw) {\n    String value = raw.trim();\n    if (type == int.class || type == Integer.class) return Integer.parseInt(value);\n    if (type == long.class || type == Long.class) return Long.parseLong(value);\n    if (type == double.class || type == Double.class) return Double.parseDouble(value);\n    if (type == float.class || type == Float.class) return Float.parseFloat(value);\n    if (type == boolean.class || type == Boolean.class) return Boolean.parseBoolean(value);\n    if (type == char.class || type == Character.class) return value.isEmpty() ? '\\0' : value.charAt(0);\n    if (type == String.class) {\n      if (value.length() >= 2 && value.startsWith(\"\\\"\") && value.endsWith(\"\\\"\")) return value.substring(1, value.length() - 1);\n      return value;\n    }\n    if (type.isArray()) {\n      String body = value.replaceAll(\"^\\\\[|\\\\]$\", \"\").trim();\n      String[] parts = body.isEmpty() ? new String[0] : body.split(\",\\\\s*\");\n      Class<?> component = type.getComponentType();\n      Object array = java.lang.reflect.Array.newInstance(component, parts.length);\n      for (int i = 0; i < parts.length; i++) java.lang.reflect.Array.set(array, i, parseValue(component, parts[i]));\n      return array;\n    }\n    throw new IllegalArgumentException(\"Unsupported Solution parameter type: \" + type.getName());\n  }\n\n  private static String formatValue(Object value) {\n    if (value == null) return \"null\";\n    if (!value.getClass().isArray()) return String.valueOf(value);\n    int length = java.lang.reflect.Array.getLength(value);\n    StringBuilder out = new StringBuilder(\"[\");\n    for (int i = 0; i < length; i++) {\n      if (i > 0) out.append(',');\n      out.append(formatValue(java.lang.reflect.Array.get(value, i)));\n    }\n    return out.append(']').toString();\n  }\n`;

const javaWrapper = (source) => {
  if (/\bstatic\s+void\s+main\s*\(/.test(source) || /\bclass\s+Main\b/.test(source)) return source;
  const normalized = source.replace(/public\s+class\s+Solution\b/, 'class Solution');
  return `${normalized}\n\npublic class Main {${javaParser}\n  public static void main(String[] args) throws Exception {\n    String raw = new String(System.in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).trim();\n    String[] lines = raw.isEmpty() ? new String[0] : raw.split(\"\\\\R\");\n    java.lang.reflect.Method target = null;\n    for (java.lang.reflect.Method method : Solution.class.getDeclaredMethods()) {\n      if (method.getName().equals(\"solution\")) { target = method; break; }\n    }\n    if (target == null) throw new IllegalStateException(\"Solution.solution(...) was not found\");\n    Class<?>[] types = target.getParameterTypes();\n    Object[] values = new Object[types.length];\n    for (int i = 0; i < types.length; i++) values[i] = parseValue(types[i], i < lines.length ? lines[i] : \"\");\n    target.setAccessible(true);\n    Object result = target.invoke(new Solution(), values);\n    System.out.print(formatValue(result));\n  }\n}\n`;
};

const cppType = (parameter) => parameter.replace(/\/\/.*$/, '').trim();
const cppArgument = (parameter, index) => {
  const type = cppType(parameter);
  const line = `__lines[${index}]`;
  if (/vector\s*</.test(type)) {
    const scalar = /long\s+long/.test(type) ? 'long long' : /double|float/.test(type) ? 'double' : 'int';
    return `__parseVector<${scalar}>(${line})`;
  }
  if (/string/.test(type)) return `__parseString(${line})`;
  if (/bool/.test(type)) return `((${line} == \"true\") || (${line} == \"1\"))`;
  if (/char/.test(type)) return `(${line}.empty() ? '\\0' : ${line}[0])`;
  if (/double|float/.test(type)) return `std::stod(${line})`;
  if (/long\s+long/.test(type)) return `std::stoll(${line})`;
  return `std::stoi(${line})`;
};

const cppWrapper = (source) => {
  if (/\bmain\s*\(/.test(source)) return source;
  const signature = source.match(/\bsolution\s*\(([^)]*)\)\s*\{/s);
  if (!signature) return source;
  const parameters = signature[1].trim() ? signature[1].split(',').map((item) => item.trim()) : [];
  const args = parameters.map(cppArgument);
  const makeArgs = args.length ? args.join(', ') : '';
  const publicized = /\bpublic\s*:/.test(source) ? source : source.replace(/class\s+Solution\s*\{/, 'class Solution {\npublic:');
  return `#include <bits/stdc++.h>\nusing namespace std;\n\n${publicized}\n\nstatic vector<string> __splitLines(const string& raw) {\n  vector<string> lines; string line; stringstream ss(raw); while (getline(ss, line)) { if (!line.empty()) lines.push_back(line); } return lines;\n}\ntemplate <typename T> static vector<T> __parseVector(const string& raw) {\n  string body = raw; if (!body.empty() && body.front() == '[') body.erase(body.begin()); if (!body.empty() && body.back() == ']') body.pop_back();\n  for (char& c : body) if (c == ',') c = ' ';\n  stringstream ss(body); vector<T> values; T value; while (ss >> value) values.push_back(value); return values;\n}\nstatic string __parseString(const string& raw) {\n  if (raw.size() >= 2 && raw.front() == '\"' && raw.back() == '\"') return raw.substr(1, raw.size() - 2); return raw;\n}\ntemplate <typename T> static void __printResult(const vector<T>& values) { cout << '['; for (size_t i = 0; i < values.size(); ++i) { if (i) cout << ','; cout << values[i]; } cout << ']'; }\ntemplate <typename T> static void __printResult(const T& value) { cout << value; }\n\nint main() {\n  const string __raw((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());\n  const vector<string> __lines = __splitLines(__raw);\n  if (__lines.size() < ${parameters.length}) { cerr << \"Insufficient input lines for Solution parameters\"; return 1; }\n  Solution __solution;\n  auto __result = __solution.solution(${makeArgs});\n  __printResult(__result);\n  return 0;\n}\n`;
};

const buildExecutionSource = (language, sourceCode) => {
  const source = String(sourceCode ?? '');
  switch (language) {
    case LANGUAGE_IDS.javascript: return javascriptWrapper(source);
    case LANGUAGE_IDS.python: return pythonWrapper(source);
    case LANGUAGE_IDS.java: return javaWrapper(source);
    case LANGUAGE_IDS.cpp: return cppWrapper(source);
    default: return source;
  }
};

if (typeof originalFetch === 'function') {
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    const isJudgeSubmission = typeof url === 'string' && /\/submissions(?:\?|$)/.test(url) && init?.method?.toUpperCase?.() === 'POST';
    if (!isJudgeSubmission || typeof init.body !== 'string') return originalFetch(input, init);

    try {
      const body = JSON.parse(init.body);
      const languageId = Number(body.language_id);
      if (body.source_code && [63, 71, 62, 54].includes(languageId)) {
        const originalSource = decode(body.source_code);
        body.source_code = encode(buildExecutionSource(languageId, originalSource));
        return originalFetch(input, { ...init, body: JSON.stringify(body) });
      }
    } catch {
      // Preserve the original Judge0 request if it is not JSON.
    }
    return originalFetch(input, init);
  };
}
