export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const DIFFICULTY_COLORS = {
  [DIFFICULTY.EASY]: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  [DIFFICULTY.MEDIUM]: 'bg-amber-50 text-amber-700 border border-amber-200',
  [DIFFICULTY.HARD]: 'bg-rose-50 text-rose-700 border border-rose-200',
};

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

export const SUPPORTED_LANGUAGES = [
  { value: LANGUAGE.JAVASCRIPT, label: 'JavaScript', monacoLang: 'javascript', judge0Id: 63 },
  { value: LANGUAGE.PYTHON, label: 'Python 3', monacoLang: 'python', judge0Id: 71 },
  { value: LANGUAGE.JAVA, label: 'Java', monacoLang: 'java', judge0Id: 62 },
  { value: LANGUAGE.CPP, label: 'C++', monacoLang: 'cpp', judge0Id: 54 },
  { value: LANGUAGE.C, label: 'C', monacoLang: 'c', judge0Id: 50 },
  { value: LANGUAGE.TYPESCRIPT, label: 'TypeScript', monacoLang: 'typescript', judge0Id: 74 },
  { value: LANGUAGE.GO, label: 'Go', monacoLang: 'go', judge0Id: 60 },
  { value: LANGUAGE.RUST, label: 'Rust', monacoLang: 'rust', judge0Id: 73 },
];

export const DEFAULT_LANGUAGE = LANGUAGE.JAVASCRIPT;

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

export const VERDICT = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compilation Error',
  PENDING: 'Pending',
};

export const VERDICT_COLORS = {
  [VERDICT.ACCEPTED]: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  [VERDICT.WRONG_ANSWER]: 'bg-rose-50 text-rose-700 border border-rose-200',
  [VERDICT.TIME_LIMIT_EXCEEDED]: 'bg-amber-50 text-amber-700 border border-amber-200',
  [VERDICT.MEMORY_LIMIT_EXCEEDED]: 'bg-amber-50 text-amber-700 border border-amber-200',
  [VERDICT.RUNTIME_ERROR]: 'bg-rose-50 text-rose-700 border border-rose-200',
  [VERDICT.COMPILATION_ERROR]: 'bg-rose-50 text-rose-700 border border-rose-200',
  [VERDICT.PENDING]: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export const VERDICT_SHORT = {
  [VERDICT.ACCEPTED]: 'AC',
  [VERDICT.WRONG_ANSWER]: 'WA',
  [VERDICT.TIME_LIMIT_EXCEEDED]: 'TLE',
  [VERDICT.MEMORY_LIMIT_EXCEEDED]: 'MLE',
  [VERDICT.RUNTIME_ERROR]: 'RE',
  [VERDICT.COMPILATION_ERROR]: 'CE',
  [VERDICT.PENDING]: '...',
};

export const CHALLENGE_STATUS = {
  UNSOLVED: 'Unsolved',
  ATTEMPTED: 'Attempted',
  SOLVED: 'Solved',
};

export const CHALLENGE_STATUS_COLORS = {
  [CHALLENGE_STATUS.UNSOLVED]: 'text-slate-400',
  [CHALLENGE_STATUS.ATTEMPTED]: 'text-amber-600',
  [CHALLENGE_STATUS.SOLVED]: 'text-emerald-600',
};

export const TOPICS = [
  'Array', 'String', 'Hash Table', 'Dynamic Programming', 'Tree', 'Graph',
  'Binary Search', 'Two Pointers', 'Sliding Window', 'Stack', 'Queue',
  'Linked List', 'Recursion', 'Backtracking', 'Greedy', 'Sorting', 'Math',
  'Bit Manipulation',
];

export const PAGE_SIZE = 12;
export const EDITOR_THEME = 'pragati-light';
export const EDITOR_MIN_HEIGHT = 400;
export const TOP_CODERS_COUNT = 3;
