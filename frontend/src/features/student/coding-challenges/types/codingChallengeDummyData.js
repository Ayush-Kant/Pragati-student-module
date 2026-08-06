/**
 * Dummy data for the Coding Challenges feature.
 *
 * To switch to a real backend, replace each service function body
 * with a `fetch(...)` or `axios.get(...)` call.  No other files change.
 */

import {
  DIFFICULTY,
  LANGUAGE,
  VERDICT,
  CHALLENGE_STATUS,
} from '../constants/codingChallengeConstants';

// ─── Challenges ────────────────────────────────────────────────────────────────

export const dummyChallenges = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: DIFFICULTY.EASY,
    status: CHALLENGE_STATUS.SOLVED,
    topics: ['Array', 'Hash Table'],
    acceptanceRate: 52.3,
    totalSubmissions: 8_240_000,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices* of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        id: 'ex-1',
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        id: 'ex-2',
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        id: 'ex-3',
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: null,
      },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    hints: [
      'A brute-force approach iterates over all pairs in O(n²). Can you do better?',
      'Think about using a hash map to store elements you have already seen.',
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
}
`,
      [LANGUAGE.PYTHON]: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass
`,
      [LANGUAGE.JAVA]: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}
`,
      [LANGUAGE.CPP]: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { id: 'tc-2', input: '[3,2,4]\n6',      expectedOutput: '[1,2]' },
    ],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.ATTEMPTED,
    topics: ['String', 'Sliding Window', 'Hash Table'],
    acceptanceRate: 33.7,
    totalSubmissions: 6_100_000,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        id: 'ex-1',
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        id: 'ex-2',
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        id: 'ex-3',
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    hints: [
      'Use the sliding window technique.',
      'Track the last seen position of each character using a hash map.',
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
}
`,
      [LANGUAGE.PYTHON]: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        pass
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '"abcabcbb"', expectedOutput: '3' },
      { id: 'tc-2', input: '"bbbbb"',   expectedOutput: '1' },
    ],
  },
  {
    id: 'median-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: DIFFICULTY.HARD,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 37.5,
    totalSubmissions: 3_500_000,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be **O(log(m + n))**.`,
    examples: [
      {
        id: 'ex-1',
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        id: 'ex-2',
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 ≤ m ≤ 1000',
      '0 ≤ n ≤ 1000',
      '1 ≤ m + n ≤ 2000',
      '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    ],
    hints: ['Think binary search on the partition index.'],
    timeLimit: 2000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[1,3]\n[2]',   expectedOutput: '2.00000' },
      { id: 'tc-2', input: '[1,2]\n[3,4]', expectedOutput: '2.50000' },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: DIFFICULTY.EASY,
    status: CHALLENGE_STATUS.SOLVED,
    topics: ['String', 'Stack'],
    acceptanceRate: 40.2,
    totalSubmissions: 5_900_000,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { id: 'ex-1', input: 's = "()"',     output: 'true',  explanation: null },
      { id: 'ex-2', input: 's = "()[]{}"', output: 'true',  explanation: null },
      { id: 'ex-3', input: 's = "(]"',     output: 'false', explanation: null },
    ],
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      "s consists of parentheses only '()[]{}'",
    ],
    hints: ['Use a stack to track unmatched opening brackets.'],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '"()"',     expectedOutput: 'true'  },
      { id: 'tc-2', input: '"()[]{}"', expectedOutput: 'true'  },
      { id: 'tc-3', input: '"(]"',     expectedOutput: 'false' },
    ],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Sorting'],
    acceptanceRate: 46.8,
    totalSubmissions: 4_200_000,
    description: `Given an array of \`intervals\` where \`intervals[i] = [startᵢ, endᵢ]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        id: 'ex-1',
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        id: 'ex-2',
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 ≤ intervals.length ≤ 10⁴',
      'intervals[i].length == 2',
      '0 ≤ startᵢ ≤ endᵢ ≤ 10⁴',
    ],
    hints: ['Sort intervals by start time first.'],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { id: 'tc-2', input: '[[1,4],[4,5]]',                expectedOutput: '[[1,5]]' },
    ],
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Backtracking', 'Graph'],
    acceptanceRate: 40.1,
    totalSubmissions: 2_800_000,
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      {
        id: 'ex-1',
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        explanation: null,
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 ≤ m, n ≤ 6',
      '1 ≤ word.length ≤ 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    hints: ['Use DFS + backtracking.'],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board, word) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      {
        id: 'tc-1',
        input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"',
        expectedOutput: 'true',
      },
    ],
  },
];

// ─── Submissions ───────────────────────────────────────────────────────────────

export const dummySubmissions = [
  {
    id: 'sub-001',
    challengeId: 'two-sum',
    challengeTitle: 'Two Sum',
    language: LANGUAGE.JAVASCRIPT,
    verdict: VERDICT.ACCEPTED,
    runtime: 68,
    memory: 42.3,
    submittedAt: '2026-07-28T10:15:00Z',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`,
    testResults: [
      { id: 'tc-1', passed: true,  input: '[2,7,11,15]\n9', expected: '[0,1]', actual: '[0,1]',  runtime: 1 },
      { id: 'tc-2', passed: true,  input: '[3,2,4]\n6',      expected: '[1,2]', actual: '[1,2]',  runtime: 1 },
    ],
  },
  {
    id: 'sub-002',
    challengeId: 'two-sum',
    challengeTitle: 'Two Sum',
    language: LANGUAGE.PYTHON,
    verdict: VERDICT.WRONG_ANSWER,
    runtime: 120,
    memory: 14.7,
    submittedAt: '2026-07-27T09:00:00Z',
    code: `class Solution:
    def twoSum(self, nums, target):
        for i in range(len(nums)):
            for j in range(i+1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]`,
    testResults: [
      { id: 'tc-1', passed: true,  input: '[2,7,11,15]\n9', expected: '[0,1]', actual: '[0,1]',  runtime: 2 },
      { id: 'tc-2', passed: false, input: '[3,2,4]\n6',      expected: '[1,2]', actual: '[2,1]',  runtime: 3 },
    ],
  },
  {
    id: 'sub-003',
    challengeId: 'longest-substring',
    challengeTitle: 'Longest Substring Without Repeating Characters',
    language: LANGUAGE.JAVASCRIPT,
    verdict: VERDICT.ACCEPTED,
    runtime: 84,
    memory: 44.1,
    submittedAt: '2026-07-25T14:30:00Z',
    code: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let max = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) left = Math.max(left, map.get(s[right]) + 1);
    map.set(s[right], right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
    testResults: [
      { id: 'tc-1', passed: true, input: '"abcabcbb"', expected: '3', actual: '3', runtime: 1 },
      { id: 'tc-2', passed: true, input: '"bbbbb"',   expected: '1', actual: '1', runtime: 1 },
    ],
  },
  {
    id: 'sub-004',
    challengeId: 'valid-parentheses',
    challengeTitle: 'Valid Parentheses',
    language: LANGUAGE.CPP,
    verdict: VERDICT.ACCEPTED,
    runtime: 0,
    memory: 6.1,
    submittedAt: '2026-07-20T08:45:00Z',
    code: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c=='(' || c=='{' || c=='[') st.push(c);
            else {
                if (st.empty()) return false;
                char top = st.top(); st.pop();
                if ((c==')' && top!='(') || (c=='}' && top!='{') || (c==']' && top!='['))
                    return false;
            }
        }
        return st.empty();
    }
};`,
    testResults: [
      { id: 'tc-1', passed: true, input: '"()"',     expected: 'true',  actual: 'true',  runtime: 0 },
      { id: 'tc-2', passed: true, input: '"()[]{}"', expected: 'true',  actual: 'true',  runtime: 0 },
      { id: 'tc-3', passed: true, input: '"(]"',     expected: 'false', actual: 'false', runtime: 0 },
    ],
  },
];

// ─── Leaderboard ───────────────────────────────────────────────────────────────

export const dummyLeaderboard = [
  { rank: 1,  userId: 'u-001', name: 'Aarav Mehta',    avatar: 'AM', solved: 142, score: 9850, streak: 30, languages: ['javascript', 'python'] },
  { rank: 2,  userId: 'u-002', name: 'Priya Sharma',   avatar: 'PS', solved: 138, score: 9620, streak: 25, languages: ['cpp', 'java']           },
  { rank: 3,  userId: 'u-003', name: 'Rohan Gupta',    avatar: 'RG', solved: 131, score: 9210, streak: 20, languages: ['python', 'go']          },
  { rank: 4,  userId: 'u-004', name: 'Sneha Patel',    avatar: 'SP', solved: 124, score: 8900, streak: 18, languages: ['javascript']            },
  { rank: 5,  userId: 'u-005', name: 'Kiran Kumar',    avatar: 'KK', solved: 118, score: 8540, streak: 15, languages: ['java', 'cpp']           },
  { rank: 6,  userId: 'u-006', name: 'Divya Nair',     avatar: 'DN', solved: 110, score: 8100, streak: 12, languages: ['python']                },
  { rank: 7,  userId: 'u-007', name: 'Arjun Singh',    avatar: 'AS', solved: 104, score: 7870, streak: 10, languages: ['rust', 'cpp']           },
  { rank: 8,  userId: 'u-008', name: 'Meera Reddy',    avatar: 'MR', solved: 98,  score: 7410, streak: 8,  languages: ['typescript']            },
  { rank: 9,  userId: 'u-009', name: 'Varun Joshi',    avatar: 'VJ', solved: 91,  score: 6950, streak: 7,  languages: ['javascript', 'python'] },
  { rank: 10, userId: 'u-010', name: 'Ananya Das',     avatar: 'AD', solved: 85,  score: 6480, streak: 5,  languages: ['java']                  },
  { rank: 11, userId: 'u-011', name: 'Rahul Verma',    avatar: 'RV', solved: 79,  score: 6020, streak: 4,  languages: ['python', 'c']           },
  { rank: 12, userId: 'u-012', name: 'Ishaan Choudhary', avatar: 'IC', solved: 72, score: 5500, streak: 3, languages: ['cpp']                   },
  // Current student (highlighted)
  { rank: 13, userId: 'current-user', name: 'You',     avatar: 'ME', solved: 68,  score: 5120, streak: 6,  languages: ['javascript', 'python'], isCurrentUser: true },
];
