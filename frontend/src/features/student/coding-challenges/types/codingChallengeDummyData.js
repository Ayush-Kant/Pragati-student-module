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
    topics: ['Array', 'Binary Search'],
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
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: DIFFICULTY.EASY,
    status: CHALLENGE_STATUS.SOLVED,
    topics: ['Dynamic Programming', 'Math', 'Recursion'],
    acceptanceRate: 51.8,
    totalSubmissions: 7_100_000,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { id: 'ex-1', input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { id: 'ex-2', input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1 steps.' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    hints: [
      'This is essentially the Fibonacci sequence.',
      'climbStairs(n) = climbStairs(n-1) + climbStairs(n-2)',
    ],
    timeLimit: 500,
    memoryLimit: 128,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your solution here
}
`,
      [LANGUAGE.PYTHON]: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your solution here
        pass
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '2', expectedOutput: '2' },
      { id: 'tc-2', input: '3', expectedOutput: '3' },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: DIFFICULTY.EASY,
    status: CHALLENGE_STATUS.SOLVED,
    topics: ['Array', 'Binary Search'],
    acceptanceRate: 55.4,
    totalSubmissions: 4_600_000,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    examples: [
      { id: 'ex-1', input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { id: 'ex-2', input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    hints: ['Maintain left and right pointers and compute mid = (left + right) >> 1.'],
    timeLimit: 500,
    memoryLimit: 128,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[-1,0,3,5,9,12]\n9',  expectedOutput: '4' },
      { id: 'tc-2', input: '[-1,0,3,5,9,12]\n2',  expectedOutput: '-1' },
    ],
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: DIFFICULTY.EASY,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Linked List', 'Recursion'],
    acceptanceRate: 73.6,
    totalSubmissions: 5_800_000,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { id: 'ex-1', input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: null },
      { id: 'ex-2', input: 'head = [1,2]',       output: '[2,1]',       explanation: null },
      { id: 'ex-3', input: 'head = []',           output: '[]',          explanation: null },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    hints: ['Try iterative first, then try recursive.'],
    timeLimit: 500,
    memoryLimit: 128,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { id: 'tc-2', input: '[1,2]',       expectedOutput: '[2,1]' },
    ],
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.ATTEMPTED,
    topics: ['Array', 'Dynamic Programming'],
    acceptanceRate: 50.2,
    totalSubmissions: 6_900_000,
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return *its sum*.`,
    examples: [
      { id: 'ex-1', input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { id: 'ex-2', input: 'nums = [1]',                     output: '1', explanation: null },
      { id: 'ex-3', input: 'nums = [5,4,-1,7,8]',            output: '23', explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    hints: ["Kadane's algorithm. At each position decide: extend the current subarray or start a new one?"],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { id: 'tc-2', input: '[1]',                       expectedOutput: '1' },
    ],
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Graph', 'Two Pointers'],
    acceptanceRate: 57.4,
    totalSubmissions: 5_300_000,
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        id: 'ex-1',
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
        explanation: null,
      },
      {
        id: 'ex-2',
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
        explanation: null,
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 300',
      "grid[i][j] is '0' or '1'.",
    ],
    hints: ['Use BFS or DFS to mark all connected land cells as visited.'],
    timeLimit: 1500,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      {
        id: 'tc-1',
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        expectedOutput: '1',
      },
      {
        id: 'tc-2',
        input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        expectedOutput: '3',
      },
    ],
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Dynamic Programming', 'Array'],
    acceptanceRate: 41.7,
    totalSubmissions: 4_100_000,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an **infinite number** of each kind of coin.`,
    examples: [
      { id: 'ex-1', input: 'coins = [1,5,11], amount = 11', output: '2', explanation: '11 = 11.' },
      { id: 'ex-2', input: 'coins = [2], amount = 3',       output: '-1', explanation: null },
      { id: 'ex-3', input: 'coins = [1], amount = 0',       output: '0',  explanation: null },
    ],
    constraints: [
      '1 ≤ coins.length ≤ 12',
      '1 ≤ coins[i] ≤ 2³¹ - 1',
      '0 ≤ amount ≤ 10⁴',
    ],
    hints: [
      'Build a dp array where dp[i] = minimum coins to reach amount i.',
      'Initialize dp[0] = 0 and dp[i] = Infinity for i > 0.',
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[1,5,11]\n11', expectedOutput: '2' },
      { id: 'tc-2', input: '[2]\n3',       expectedOutput: '-1' },
    ],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: DIFFICULTY.HARD,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Hash Table', 'Linked List'],
    acceptanceRate: 41.5,
    totalSubmissions: 3_100_000,
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size capacity.
- \`int get(int key)\` Return the value of the key if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        id: 'ex-1',
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
        explanation: null,
      },
    ],
    constraints: [
      '1 ≤ capacity ≤ 3000',
      '0 ≤ key ≤ 10⁴',
      '0 ≤ value ≤ 10⁵',
      'At most 2 × 10⁵ calls will be made to get and put.',
    ],
    hints: [
      'Combine a doubly-linked list with a hash map.',
      'The hash map gives O(1) key lookup; the linked list maintains usage order.',
    ],
    timeLimit: 2000,
    memoryLimit: 512,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    // Write your solution here
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    // Write your solution here
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    // Write your solution here
};
`,
    },
    sampleTestCases: [
      {
        id: 'tc-1',
        input: 'capacity=2\nput(1,1)\nput(2,2)\nget(1)',
        expectedOutput: '1',
      },
    ],
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: DIFFICULTY.HARD,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Two Pointers', 'Stack'],
    acceptanceRate: 60.3,
    totalSubmissions: 4_700_000,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        id: 'ex-1',
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.',
      },
      {
        id: 'ex-2',
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: null,
      },
    ],
    constraints: [
      'n == height.length',
      '1 ≤ n ≤ 2 × 10⁴',
      '0 ≤ height[i] ≤ 10⁵',
    ],
    hints: [
      'For each position, water level = min(max left height, max right height).',
      'Use two pointers to achieve O(n) time and O(1) space.',
    ],
    timeLimit: 1000,
    memoryLimit: 256,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { id: 'tc-2', input: '[4,2,0,3,2,5]',              expectedOutput: '9' },
    ],
  },
  {
    id: 'rotate-image',
    title: 'Rotate Image',
    difficulty: DIFFICULTY.MEDIUM,
    status: CHALLENGE_STATUS.UNSOLVED,
    topics: ['Array', 'Math'],
    acceptanceRate: 72.8,
    totalSubmissions: 3_400_000,
    description: `You are given an \`n x n\` 2D \`matrix\` representing an image. Rotate the image by **90 degrees (clockwise)**.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.`,
    examples: [
      {
        id: 'ex-1',
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[[7,4,1],[8,5,2],[9,6,3]]',
        explanation: null,
      },
      {
        id: 'ex-2',
        input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
        output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]',
        explanation: null,
      },
    ],
    constraints: [
      'n == matrix.length == matrix[i].length',
      '1 ≤ n ≤ 20',
      '-1000 ≤ matrix[i][j] ≤ 1000',
    ],
    hints: [
      'Transpose the matrix first (swap matrix[i][j] with matrix[j][i]).',
      'Then reverse each row.',
    ],
    timeLimit: 500,
    memoryLimit: 128,
    starterCode: {
      [LANGUAGE.JAVASCRIPT]: `/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
function rotate(matrix) {
  // Write your solution here
}
`,
    },
    sampleTestCases: [
      { id: 'tc-1', input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]' },
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
  {
    id: 'sub-005',
    challengeId: 'climbing-stairs',
    challengeTitle: 'Climbing Stairs',
    language: LANGUAGE.JAVASCRIPT,
    verdict: VERDICT.ACCEPTED,
    runtime: 45,
    memory: 38.2,
    submittedAt: '2026-08-01T16:22:00Z',
    code: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    testResults: [
      { id: 'tc-1', passed: true, input: '2', expected: '2', actual: '2', runtime: 0 },
      { id: 'tc-2', passed: true, input: '3', expected: '3', actual: '3', runtime: 0 },
    ],
  },
  {
    id: 'sub-006',
    challengeId: 'binary-search',
    challengeTitle: 'Binary Search',
    language: LANGUAGE.PYTHON,
    verdict: VERDICT.ACCEPTED,
    runtime: 110,
    memory: 16.4,
    submittedAt: '2026-08-05T09:11:00Z',
    code: `class Solution:
    def search(self, nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1`,
    testResults: [
      { id: 'tc-1', passed: true, input: '[-1,0,3,5,9,12]\n9', expected: '4', actual: '4', runtime: 1 },
      { id: 'tc-2', passed: true, input: '[-1,0,3,5,9,12]\n2', expected: '-1', actual: '-1', runtime: 1 },
    ],
  },
  {
    id: 'sub-007',
    challengeId: 'maximum-subarray',
    challengeTitle: 'Maximum Subarray',
    language: LANGUAGE.JAVASCRIPT,
    verdict: VERDICT.WRONG_ANSWER,
    runtime: 95,
    memory: 51.7,
    submittedAt: '2026-08-10T11:45:00Z',
    code: `function maxSubArray(nums) {
  return Math.max(...nums); // incorrect — doesn't handle subarray
}`,
    testResults: [
      { id: 'tc-1', passed: false, input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', actual: '4', runtime: 2 },
    ],
  },
];

// ─── Leaderboard ───────────────────────────────────────────────────────────────

export const dummyLeaderboard = [
  { rank: 1,  userId: 'u-001', name: 'Aarav Mehta',       avatar: 'AM', solved: 142, score: 9850, streak: 30, languages: ['javascript', 'python'] },
  { rank: 2,  userId: 'u-002', name: 'Priya Sharma',      avatar: 'PS', solved: 138, score: 9620, streak: 25, languages: ['cpp', 'java']           },
  { rank: 3,  userId: 'u-003', name: 'Rohan Gupta',       avatar: 'RG', solved: 131, score: 9210, streak: 20, languages: ['python', 'go']          },
  { rank: 4,  userId: 'u-004', name: 'Sneha Patel',       avatar: 'SP', solved: 124, score: 8900, streak: 18, languages: ['javascript']            },
  { rank: 5,  userId: 'u-005', name: 'Kiran Kumar',       avatar: 'KK', solved: 118, score: 8540, streak: 15, languages: ['java', 'cpp']           },
  { rank: 6,  userId: 'u-006', name: 'Divya Nair',        avatar: 'DN', solved: 110, score: 8100, streak: 12, languages: ['python']                },
  { rank: 7,  userId: 'u-007', name: 'Arjun Singh',       avatar: 'AS', solved: 104, score: 7870, streak: 10, languages: ['rust', 'cpp']           },
  { rank: 8,  userId: 'u-008', name: 'Meera Reddy',       avatar: 'MR', solved: 98,  score: 7410, streak: 8,  languages: ['typescript']            },
  { rank: 9,  userId: 'u-009', name: 'Varun Joshi',       avatar: 'VJ', solved: 91,  score: 6950, streak: 7,  languages: ['javascript', 'python'] },
  { rank: 10, userId: 'u-010', name: 'Ananya Das',        avatar: 'AD', solved: 85,  score: 6480, streak: 5,  languages: ['java']                  },
  { rank: 11, userId: 'u-011', name: 'Rahul Verma',       avatar: 'RV', solved: 79,  score: 6020, streak: 4,  languages: ['python', 'c']           },
  { rank: 12, userId: 'u-012', name: 'Ishaan Choudhary',  avatar: 'IC', solved: 72,  score: 5500, streak: 3,  languages: ['cpp']                   },
  // Current student (highlighted)
  { rank: 13, userId: 'current-user', name: 'You',        avatar: 'ME', solved: 68,  score: 5120, streak: 6,  languages: ['javascript', 'python'], isCurrentUser: true },
];
