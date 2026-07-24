import { pool } from "../../config/db.js";
import {
  assignmentSeedData,
  submissionSeedData,
  feedbackSeedData,
  gradeSeedData,
  deadlineSeedData,
} from "./seeders/assignmentSeedData.js";

export const seedAssignments = async () => {
  for (const assignment of assignmentSeedData) {
    await pool.query(
      `
      INSERT INTO assignments (title, subject, description, due_date, total_marks, status, student_id)
      SELECT $1::text, $2::text, $3::text, $4::date, $5::integer, $6::text, $7::integer
      WHERE NOT EXISTS (
        SELECT 1 FROM assignments WHERE title = $1 AND subject = $2 AND due_date = $4
      )
      `,
      [
        assignment.title,
        assignment.subject,
        assignment.description || null,
        assignment.dueDate,
        assignment.totalMarks,
        assignment.status || "Open",
        null,
      ]
    );
  }

  for (const submission of submissionSeedData) {
    await pool.query(
      `
      INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status, submitted_at)
      SELECT $1::integer, $2::integer, $3::text, $4::text, $5::text, COALESCE($6::timestamptz, NOW())
      WHERE NOT EXISTS (
        SELECT 1 FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2
      )
      `,
      [submission.assignmentId, submission.studentId, submission.content || null, submission.fileUrl || null, submission.status || "Submitted", submission.submittedAt || null]
    );
  }

  for (const feedback of feedbackSeedData) {
    await pool.query(
      `
      INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade)
      SELECT $1::integer, $2::integer, $3::text, $4::text
      WHERE NOT EXISTS (
        SELECT 1 FROM assignment_feedback WHERE assignment_id = $1 AND student_id = $2
      )
      `,
      [feedback.assignmentId, feedback.studentId, feedback.remarks, feedback.grade]
    );
  }

  for (const grade of gradeSeedData) {
    await pool.query(
      `
      INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
      SELECT $1::integer, $2::integer, $3::numeric, $4::text
      WHERE NOT EXISTS (
        SELECT 1 FROM assignment_grades WHERE assignment_id = $1 AND student_id = $2
      )
      `,
      [grade.assignmentId, grade.studentId, grade.score, grade.remarks || null]
    );
  }

  for (const deadline of deadlineSeedData) {
    await pool.query(
      `
      INSERT INTO assignment_deadlines (assignment_id, due_date, status)
      SELECT $1::integer, $2::date, $3::text
      WHERE NOT EXISTS (
        SELECT 1 FROM assignment_deadlines WHERE assignment_id = $1
      )
      `,
      [deadline.assignmentId, deadline.dueDate, deadline.status || "Open"]
    );
  }
};

export default seedAssignments;
