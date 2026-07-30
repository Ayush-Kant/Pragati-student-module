import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssignmentSchema, submitAssignmentSchema } from '../validators/assignmentValidator.js';

test('create assignment schema accepts valid payload', () => {
    const payload = {
        title: 'React Basics',
        subject: 'Frontend',
        description: 'Build a component',
        dueDate: '2026-08-15',
        totalMarks: 100,
        status: 'Open',
    };

    const { error, value } = createAssignmentSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.title, payload.title);
    assert.equal(value.totalMarks, 100);
});

test('submit assignment schema allows content and file url', () => {
    const payload = {
        content: 'Implemented the dashboard',
        fileUrl: 'https://example.com/submission.pdf',
    };

    const { error, value } = submitAssignmentSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.fileUrl, payload.fileUrl);
});
