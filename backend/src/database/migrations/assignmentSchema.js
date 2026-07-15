import { pool } from "../../../config/db.js";
import assignmentModel from "../../models/assignmentModel.js";
import submissionModel from "../../models/submissionModel.js";
import feedbackModel from "../../models/feedbackModel.js";
import gradeModel from "../../models/gradeModel.js";
import deadlineModel from "../../models/deadlineModel.js";
import { assignmentSeedData, submissionSeedData, feedbackSeedData } from "../seeders/assignmentSeedData.js";

export const initializeAssignmentModule = async () => {
  await assignmentModel.createAssignmentsTable();
  await submissionModel.createSubmissionTable();
  await feedbackModel.createFeedbackTable();
  await gradeModel.createGradeTable();
  await deadlineModel.createDeadlineTable();

  await assignmentModel.seedAssignments();

  const assignmentCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignments");
  if (assignmentCount.rows[0].count === 0) {
    return;
  }

  const submissionCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_submissions");
  if (submissionCount.rows[0].count === 0 && submissionSeedData.length > 0) {
    const firstAssignment = assignmentSeedData[0];
    await pool.query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [1, submissionSeedData[0].studentId, submissionSeedData[0].status]
    );
  }

  const feedbackCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_feedback");
  if (feedbackCount.rows[0].count === 0 && feedbackSeedData.length > 0) {
    await pool.query(
      `INSERT INTO assignment_feedback (assignment_id, remarks, grade) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [1, feedbackSeedData[0].remarks, feedbackSeedData[0].grade]
    );
  }

  const deadlineCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_deadlines");
  if (deadlineCount.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO assignment_deadlines (assignment_id, due_date, reminder_date) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [1, assignmentSeedData[0].dueDate, assignmentSeedData[0].dueDate]
    );
  }

  const gradeCount = await pool.query("SELECT COUNT(*)::int AS count FROM assignment_grades");
  if (gradeCount.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO assignment_grades (assignment_id, student_id, marks, grade) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [1, 101, 90, "A"]
    );
  }
};

export default initializeAssignmentModule;
