import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateProgressPercent, summarizeProgress } from '../src/utils/trainingHelpers.js';
import { serializeLearningData } from '../src/utils/learningUtils.js';

test('calculateProgressPercent returns a percentage bounded between 0 and 100', () => {
    assert.equal(calculateProgressPercent(3, 10), 30);
    assert.equal(calculateProgressPercent(10, 10), 100);
    assert.equal(calculateProgressPercent(0, 10), 0);
    assert.equal(calculateProgressPercent(12, 10), 100);
});

test('summarizeProgress returns completed and remaining lesson counts', () => {
    const summary = summarizeProgress(4, 10);
    assert.deepEqual(summary, {
        completedLessons: 4,
        totalLessons: 10,
        remainingLessons: 6,
        progressPercent: 40,
    });
});

test('serializeLearningData recursively serializes nested arrays and objects without mutating input', () => {
    const input = {
        courses: [{
            courseId: 1,
            modules: [{
                moduleId: 2,
                lessons: [{ lessonId: 3, durationSeconds: '45', password: 'secret' }],
            }],
        }],
        summary: { watchPercentage: '90.5', passwordHash: 'x' },
    };

    const result = serializeLearningData(input);

    assert.notStrictEqual(result, input);
    assert.deepEqual(result, {
        courses: [{
            courseId: 1,
            modules: [{
                moduleId: 2,
                lessons: [{ lessonId: 3, durationSeconds: 45 }],
            }],
        }],
        summary: { watchPercentage: 90.5 },
    });
    assert.equal(input.courses[0].modules[0].lessons[0].durationSeconds, '45');
    assert.equal(input.summary.passwordHash, 'x');
});
