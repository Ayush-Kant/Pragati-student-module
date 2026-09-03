import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeQuestion, gradeAssessment } from '../services/studentAssessment.grader.js';

test('MCQ grading respects randomized option order', () => {
  const question = { type: 'MCQ', options: ['A', 'B', 'C'], correct_option: 2, marks: 10 };
  assert.equal(gradeQuestion(question, { optionIndex: 0 }, [2, 0, 1]), true);
  assert.equal(gradeQuestion(question, { optionIndex: 1 }, [2, 0, 1]), false);
});

test('True/False grading is normalized', () => {
  const question = { type: 'TRUE_FALSE', correct_answer: true, marks: 5 };
  assert.equal(gradeQuestion(question, { value: 'true' }), true);
  assert.equal(gradeQuestion(question, { value: 'false' }), false);
});

test('Fill blank accepts configured alternatives case-insensitively', () => {
  const question = { type: 'FILL_BLANK', correct_answer: ['map', 'Array.map'], marks: 5 };
  assert.equal(gradeQuestion(question, { text: 'MAP' }), true);
  assert.equal(gradeQuestion(question, { text: 'filter' }), false);
});

test('Match-the-following compares complete mappings', () => {
  const question = { type: 'MATCH', correct_answer: { A: '1', B: '2' }, marks: 10 };
  assert.equal(gradeQuestion(question, { matches: { A: '1', B: '2' } }), true);
  assert.equal(gradeQuestion(question, { matches: { A: '2', B: '1' } }), false);
});

test('Assessment aggregate grading reports score and correctness', () => {
  const questions = [
    { id: 1, type: 'MCQ', options: ['A', 'B'], correct_option: 1, marks: 10, option_order: [1, 0] },
    { id: 2, type: 'FILL_BLANK', correct_answer: ['node'], marks: 5, option_order: [] },
  ];
  const answers = new Map([[1, { optionIndex: 0 }], [2, { text: 'NODE' }]]);
  const result = gradeAssessment(questions, answers);
  assert.equal(result.score, 15);
  assert.equal(result.totalMarks, 15);
  assert.equal(result.correctAnswers, 2);
  assert.equal(result.totalQuestions, 2);
});
