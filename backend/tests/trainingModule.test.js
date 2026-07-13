import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateProgressPercent, summarizeProgress } from '../src/utils/trainingHelpers.js';

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
