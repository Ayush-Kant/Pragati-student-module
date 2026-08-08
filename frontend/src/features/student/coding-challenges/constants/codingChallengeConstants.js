/**
 * Central constants for the Coding Challenges feature.
 * Keep all magic strings, mappings, and static data here so components
 * never hardcode values.
 */

// ─── Difficulty ────────────────────────────────────────────────────────────────

/** @enum {string} Valid difficulty levels for coding challenges. */
export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

/**
 * Tailwind badge classes per difficulty level.
 * @type {Record<string, string>}
 */
export const DIFFICULTY_COLORS = {
  [DIFFICULTY.EASY]:
    'bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-teal-500/10',
  [DIFFICULTY.MEDIUM]:
    'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-orange-500/10',
  [DIFFICULTY.HARD]:
    'bg-red-500/15 text-red-400 border border-red-500/30 shadow-red-500/10',
};

// ─── Programming Languages ─────────────────────────────────────────────────────

/** @enum {string} Supported programming languages (Judge0 language names). */
export const LANGUAGE = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  JAVA: 'java',
  CPP: 'cpp',
  C: 'c',
  TYPESCRIPT: 'typescript',
  GO: 'go',
  RUST: 'rust',
};

/**
 * Display metadata for each supported language.
 * `judge0Id` maps to the Judge0 language_id.
 * @type {Array<{ value: string, label: string, monacoLang: string, judge0Id: number }>}
 */
export const SUPPORTED_LANGUAGES = [
  { value: LANGUAGE.JAVASCRIPT, label: 'JavaScript', monacoLang: 'javascript', judge0Id: 63 },
  { value: LANGUAGE.PYTHON,     label: 'Python 3',   monacoLang: 'python',     judge0Id: 71 },
  { value: LANGUAGE.JAVA,       label: 'Java',       monacoLang: 'java',       judge0Id: 62 },
  { value: LANGUAGE.CPP,        label: 'C++',        monacoLang: 'cpp',        judge0Id: 54 },
  { value: LANGUAGE.C,          label: 'C',          monacoLang: 'c',          judge0Id: 50 },
  { value: LANGUAGE.TYPESCRIPT, label: 'TypeScript', monacoLang: 'typescript', judge0Id: 74 },
  { value: LANGUAGE.GO,         label: 'Go',         monacoLang: 'go',         judge0Id: 60 },
  { value: LANGUAGE.RUST,       label: 'Rust',       monacoLang: 'rust',       judge0Id: 73 },
];

/** Default language shown when opening the editor. */
export const DEFAULT_LANGUAGE = LANGUAGE.JAVASCRIPT;

/**
 * Starter code templates keyed by language value.
 * Reset-to-template always uses these.
 * @type {Record<string, string>}
 */
export const STARTER_TEMPLATES = {
  [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} nums
 * @return {number}
 */
function solution(nums) {
  // Write your solution here
}
`,
  [LANGUAGE.PYTHON]: `class Solution:
    def solution(self, nums: list[int]) -> int:
        # Write your solution here
        pass
`,
  [LANGUAGE.JAVA]: `class Solution {
    public int solution(int[] nums) {
        // Write your solution here
        return 0;
    }
}
`,
  [LANGUAGE.CPP]: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int solution(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};
`,
  [LANGUAGE.C]: `#include <stdio.h>
#include <stdlib.h>

int solution(int* nums, int numsSize) {
    // Write your solution here
    return 0;
}
`,
  [LANGUAGE.TYPESCRIPT]: `function solution(nums: number[]): number {
  // Write your solution here
  return 0;
}
`,
  [LANGUAGE.GO]: `package main

func solution(nums []int) int {
    // Write your solution here
    return 0
}
`,
  [LANGUAGE.RUST]: `impl Solution {
    pub fn solution(nums: Vec<i32>) -> i32 {
        // Write your solution here
        0
    }
}
`,
};

// ─── Verdict / Submission Status ───────────────────────────────────────────────

/** @enum {string} Possible verdicts after code execution or submission. */
export const VERDICT = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compilation Error',
  PENDING: 'Pending',
};

/**
 * Tailwind badge classes per verdict.
 * @type {Record<string, string>}
 */
export const VERDICT_COLORS = {
  [VERDICT.ACCEPTED]:
    'bg-teal-500/15 text-teal-400 border border-teal-500/30',
  [VERDICT.WRONG_ANSWER]:
    'bg-red-500/15 text-red-400 border border-red-500/30',
  [VERDICT.TIME_LIMIT_EXCEEDED]:
    'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  [VERDICT.MEMORY_LIMIT_EXCEEDED]:
    'bg-orange-600/15 text-orange-500 border border-orange-600/30',
  [VERDICT.RUNTIME_ERROR]:
    'bg-red-600/15 text-red-500 border border-red-600/30',
  [VERDICT.COMPILATION_ERROR]:
    'bg-red-700/15 text-red-600 border border-red-700/30',
  [VERDICT.PENDING]:
    'bg-gray-700/15 text-gray-400 border border-gray-700/30',
};

/**
 * Short label for display in compact UI.
 * @type {Record<string, string>}
 */
export const VERDICT_SHORT = {
  [VERDICT.ACCEPTED]: 'AC',
  [VERDICT.WRONG_ANSWER]: 'WA',
  [VERDICT.TIME_LIMIT_EXCEEDED]: 'TLE',
  [VERDICT.MEMORY_LIMIT_EXCEEDED]: 'MLE',
  [VERDICT.RUNTIME_ERROR]: 'RE',
  [VERDICT.COMPILATION_ERROR]: 'CE',
  [VERDICT.PENDING]: '...',
};

// ─── Challenge Status ──────────────────────────────────────────────────────────

/** @enum {string} Whether a student has attempted / solved a challenge. */
export const CHALLENGE_STATUS = {
  UNSOLVED: 'Unsolved',
  ATTEMPTED: 'Attempted',
  SOLVED: 'Solved',
};

/**
 * Tailwind color classes per challenge status (used in cards/badges).
 * @type {Record<string, string>}
 */
export const CHALLENGE_STATUS_COLORS = {
  [CHALLENGE_STATUS.UNSOLVED]: 'text-gray-500',
  [CHALLENGE_STATUS.ATTEMPTED]: 'text-orange-400',
  [CHALLENGE_STATUS.SOLVED]: 'text-teal-400',
};

// ─── Topic Tags ────────────────────────────────────────────────────────────────

/** Common algorithm / data-structure topic tags shown as filter chips. */
export const TOPICS = [
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Tree',
  'Graph',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Recursion',
  'Backtracking',
  'Greedy',
  'Sorting',
  'Math',
  'Bit Manipulation',
];

// ─── Pagination ────────────────────────────────────────────────────────────────

/** Default page size for the challenges list. */
export const PAGE_SIZE = 12;

// ─── Editor Config ─────────────────────────────────────────────────────────────

/** Monaco editor theme name — matches the custom theme defined in MonacoEditor.jsx. */
export const EDITOR_THEME = 'pragati-dark';

/** Minimum editor height in pixels (used in responsive layout). */
export const EDITOR_MIN_HEIGHT = 400;

// ─── Leaderboard ──────────────────────────────────────────────────────────────

/** Number of top coders shown in the podium / TopCoders component. */
export const TOP_CODERS_COUNT = 3;
