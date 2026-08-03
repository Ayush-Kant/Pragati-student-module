import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createAssignmentSchema,
    updateAssignmentSchema,
    submitAssignmentSchema,
    assignmentIdSchema,
    assignmentIdAndStudentIdSchema,
    feedbackSchema,
    gradeSchema
} from '../validations/assignmentValidation.js';
import assignmentModel from '../models/assignmentModel.js';
import assignmentSubmissionModel from '../models/assignmentSubmissionModel.js';
import assignmentFeedbackModel from '../models/assignmentFeedbackModel.js';
import assignmentGradeModel from '../models/assignmentGradeModel.js';
import assignmentRoutes from '../routes/assignmentRoutes.js';
import { normalizeError } from '../utils/assignmentHelpers.js';
import { pool } from '../../config/db.js';

// 8. Validation tests
test('Validation: create assignment schema accepts valid payload', () => {
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

test('Validation: submit assignment schema allows content and file url', () => {
    const payload = {
        content: 'Implemented the dashboard',
        fileUrl: 'https://example.com/submission.pdf',
    };

    const { error, value } = submitAssignmentSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.fileUrl, payload.fileUrl);
});

test('Validation: update assignment schema allows optional fields', () => {
    const payload = {
        title: 'New React Basics',
    };

    const { error, value } = updateAssignmentSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.title, 'New React Basics');
});

test('Validation: assignmentIdAndStudentIdSchema validates parameters', () => {
    const payload = {
        id: 12,
        studentId: 34,
    };

    const { error, value } = assignmentIdAndStudentIdSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.id, 12);
    assert.equal(value.studentId, 34);
});

test('Validation: feedbackSchema rejects invalid fields', () => {
    const payload = {
        remarks: '',
        grade: 'A',
    };

    const { error } = feedbackSchema.validate(payload);
    assert.ok(error);
});

test('Validation: gradeSchema accepts valid grade payload', () => {
    const payload = {
        score: 95,
        remarks: 'Excellent work!',
    };

    const { error, value } = gradeSchema.validate(payload);
    assert.equal(error, undefined);
    assert.equal(value.score, 95);
});

// 1. Assignment Listing model test
test('Model: listAssignments constructs correct query and filters', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [] };
    };

    try {
        await assignmentModel.listAssignments({ studentId: 10, status: 'Open' });
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /student_id = \$1/);
    assert.match(capturedQuery, /status = \$2/);
    assert.deepEqual(capturedValues, [10, 'Open']);
});

// 2. Assignment Details model test
test('Model: getAssignmentById queries correct table and parameters', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [] };
    };

    try {
        await assignmentModel.getAssignmentById(42);
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /FROM assignments/);
    assert.match(capturedQuery, /WHERE id = \$1/);
    assert.deepEqual(capturedValues, [42]);
});

// 3. Assignment Submission model test
test('Model: submitAssignment uses ON CONFLICT clause', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [{ id: 1, assignment_id: 2, student_id: 3, content: 'Text', file_url: null, status: 'Submitted', submitted_at: new Date() }] };
    };

    try {
        await assignmentSubmissionModel.submitAssignment(2, 3, { content: 'Text' });
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /INSERT INTO assignment_submissions/);
    assert.match(capturedQuery, /ON CONFLICT/);
    assert.match(capturedQuery, /DO UPDATE SET/);
    assert.equal(capturedValues[0], 2);
    assert.equal(capturedValues[1], 3);
});

// 4. Resubmission / Submission History model test
test('Model: getSubmissionByAssignment queries submissions table', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [] };
    };

    try {
        await assignmentSubmissionModel.getSubmissionByAssignment(5, 6);
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /FROM assignment_submissions/);
    assert.match(capturedQuery, /assignment_id = \$1 AND student_id = \$2/);
    assert.deepEqual(capturedValues, [5, 6]);
});

// 5. Submission History listing test
test('Model: listAllSubmissions filters by assignment, student and status', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [] };
    };

    try {
        await assignmentSubmissionModel.listAllSubmissions({ assignmentId: 10, studentId: 20, status: 'Submitted' });
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /FROM assignment_submissions/);
    assert.match(capturedQuery, /assignment_id = \$1/);
    assert.match(capturedQuery, /student_id = \$2/);
    assert.match(capturedQuery, /status = \$3/);
    assert.deepEqual(capturedValues, [10, 20, 'Submitted']);
});

// 6. Feedback/grades retrieval / persistence model test
test('Model: addFeedback uses ON CONFLICT clause', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [{ assignment_id: 1, student_id: 2, remarks: 'Nice', grade: 'A', created_at: new Date() }] };
    };

    try {
        await assignmentFeedbackModel.addFeedback(1, 2, { remarks: 'Nice', grade: 'A' });
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /INSERT INTO assignment_feedback/);
    assert.match(capturedQuery, /ON CONFLICT/);
    assert.deepEqual(capturedValues, [1, 2, 'Nice', 'A']);
});

test('Model: addGrade inserts grade and score', async () => {
    const originalQuery = pool.query;
    let capturedQuery = '';
    let capturedValues = [];

    pool.query = async (text, values) => {
        capturedQuery = text;
        capturedValues = values;
        return { rows: [{ assignment_id: 1, student_id: 2, score: 90, remarks: 'Good', created_at: new Date() }] };
    };

    try {
        await assignmentGradeModel.addGrade(1, 2, { score: 90, remarks: 'Good' });
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQuery, /INSERT INTO assignment_grades/);
    assert.deepEqual(capturedValues, [1, 2, 90, 'Good']);
});

// 7. Statistics model test
test('Model: getAssignmentStatistics queries both single student and all students stats', async () => {
    const originalQuery = pool.query;
    let capturedQueries = [];

    pool.query = async (text, values) => {
        capturedQueries.push(text);
        return { rows: [{}] };
    };

    try {
        await assignmentModel.getAssignmentStatistics({ studentId: 100 });
        await assignmentModel.getAssignmentStatistics({});
    } finally {
        pool.query = originalQuery;
    }

    assert.match(capturedQueries[0], /WHERE a\.student_id = \$1 OR a\.student_id IS NULL/);
    assert.match(capturedQueries[1], /LEFT JOIN assignment_grades/);
});

// 9. Route structure / registration / middleware configuration test
test('Routes: assignment routes stack contains all expected routes and ordering', () => {
    const stack = assignmentRoutes.stack || [];
    const routes = stack
        .filter(layer => layer.route)
        .map(layer => ({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods),
        }));

    // Verify ordering
    const paths = routes.map(r => r.path);

    // Statistics & Submissions should be defined BEFORE /:id to prevent being captured
    const statisticsIndex = paths.indexOf('/statistics');
    const submissionsIndex = paths.indexOf('/submissions');
    const idIndex = paths.indexOf('/:id');

    assert.ok(statisticsIndex !== -1);
    assert.ok(submissionsIndex !== -1);
    assert.ok(idIndex !== -1);

    assert.ok(statisticsIndex < idIndex, 'statistics route must precede /:id route');
    assert.ok(submissionsIndex < idIndex, 'submissions route must precede /:id route');

    // Verify submit route has multiple middlewares (multer and validator)
    const submitLayer = stack.find(layer => layer.route && layer.route.path === '/:id/submit');
    assert.ok(submitLayer);
    // There should be multiple middlewares attached
    assert.ok(submitLayer.route.stack.length >= 3);
});

// 10. Upload middleware behavior / helper tests
test('Helpers: normalizeError creates Error with status', () => {
    const error = normalizeError('Bad request', 400);
    assert.ok(error instanceof Error);
    assert.equal(error.status, 400);
    assert.equal(error.message, 'Bad request');
});
