export const DIFFICULTY = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };
export const DIFFICULTY_COLORS = { [DIFFICULTY.EASY]: 'bg-emerald-50 text-emerald-700 border border-emerald-200', [DIFFICULTY.MEDIUM]: 'bg-amber-50 text-amber-700 border border-amber-200', [DIFFICULTY.HARD]: 'bg-rose-50 text-rose-700 border border-rose-200' };

export const LANGUAGE = { JAVASCRIPT: 'javascript', PYTHON: 'python', JAVA: 'java', CPP: 'cpp' };
export const SUPPORTED_LANGUAGES = [
  { value: LANGUAGE.JAVASCRIPT, label: 'JavaScript', monacoLang: 'javascript', judge0Id: 63 },
  { value: LANGUAGE.PYTHON, label: 'Python 3', monacoLang: 'python', judge0Id: 71 },
  { value: LANGUAGE.JAVA, label: 'Java', monacoLang: 'java', judge0Id: 62 },
  { value: LANGUAGE.CPP, label: 'C++', monacoLang: 'cpp', judge0Id: 54 },
];
export const DEFAULT_LANGUAGE = LANGUAGE.JAVASCRIPT;

export const STARTER_TEMPLATES = {
  [LANGUAGE.JAVASCRIPT]: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction solution(nums) {\n  // Write your solution here\n}\n`,
  [LANGUAGE.PYTHON]: `class Solution:\n    def solution(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass\n`,
  [LANGUAGE.JAVA]: `class Solution {\n    public int solution(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n`,
  [LANGUAGE.CPP]: `#include <bits/stdc++.h>\nusing namespace std;\nclass Solution {\npublic:\n    int solution(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};\n`,
};

export const VERDICT = { ACCEPTED: 'Accepted', WRONG_ANSWER: 'Wrong Answer', TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded', MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded', RUNTIME_ERROR: 'Runtime Error', COMPILATION_ERROR: 'Compilation Error', PENDING: 'Pending' };
export const VERDICT_COLORS = { [VERDICT.ACCEPTED]: 'bg-emerald-50 text-emerald-700 border border-emerald-200', [VERDICT.WRONG_ANSWER]: 'bg-rose-50 text-rose-700 border border-rose-200', [VERDICT.TIME_LIMIT_EXCEEDED]: 'bg-amber-50 text-amber-700 border border-amber-200', [VERDICT.MEMORY_LIMIT_EXCEEDED]: 'bg-amber-50 text-amber-700 border border-amber-200', [VERDICT.RUNTIME_ERROR]: 'bg-rose-50 text-rose-700 border border-rose-200', [VERDICT.COMPILATION_ERROR]: 'bg-rose-50 text-rose-700 border border-rose-200', [VERDICT.PENDING]: 'bg-slate-100 text-slate-600 border border-slate-200' };
export const VERDICT_SHORT = { [VERDICT.ACCEPTED]: 'AC', [VERDICT.WRONG_ANSWER]: 'WA', [VERDICT.TIME_LIMIT_EXCEEDED]: 'TLE', [VERDICT.MEMORY_LIMIT_EXCEEDED]: 'MLE', [VERDICT.RUNTIME_ERROR]: 'RE', [VERDICT.COMPILATION_ERROR]: 'CE', [VERDICT.PENDING]: '...' };
export const CHALLENGE_STATUS = { UNSOLVED: 'Unsolved', ATTEMPTED: 'Attempted', SOLVED: 'Solved' };
export const CHALLENGE_STATUS_COLORS = { [CHALLENGE_STATUS.UNSOLVED]: 'text-slate-400', [CHALLENGE_STATUS.ATTEMPTED]: 'text-amber-600', [CHALLENGE_STATUS.SOLVED]: 'text-emerald-600' };
export const TOPICS = ['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Tree', 'Graph', 'Binary Search', 'Two Pointers', 'Sliding Window', 'Stack', 'Queue', 'Linked List', 'Recursion', 'Backtracking', 'Greedy', 'Sorting', 'Math', 'Bit Manipulation'];
export const PAGE_SIZE = 12;
export const EDITOR_THEME = 'pragati-light';
export const EDITOR_MIN_HEIGHT = 400;
export const TOP_CODERS_COUNT = 3;
