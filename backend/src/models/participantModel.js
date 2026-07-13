import { pool } from "../../config/db.js";
import { resolveStudentUserId } from "../utils/studentReferenceResolver.js";


export const getParticipants = async (sessionId) => {
  const result = await pool.query(
    `
    SELECT 
        sp.id,
        sp.session_id AS "sessionId",
        sp.student_id AS "studentId",
        sp.joined_at AS "joinedAt",
        u.full_name AS "fullName",
        u.email
    FROM session_participants sp
    JOIN users u 
    ON sp.student_id = u.id
    WHERE sp.session_id = $1
    ORDER BY sp.joined_at DESC
    `,
    [sessionId]
  );

  return result.rows;
};



export const addParticipant = async (sessionId, studentId) => {

  const resolvedStudentId = await resolveStudentUserId(
    pool,
    studentId
  );

  if (!resolvedStudentId) {
    const error = new Error("Student not found");
    throw error;
  }


  const result = await pool.query(
    `
    INSERT INTO session_participants
    (
        session_id,
        student_id,
        joined_at
    )
    VALUES
    (
        $1,
        $2,
        NOW()
    )
    ON CONFLICT(session_id, student_id)
    DO UPDATE SET
        joined_at = NOW()
    RETURNING
        id,
        session_id AS "sessionId",
        student_id AS "studentId",
        joined_at AS "joinedAt"
    `,
    [
      sessionId,
      resolvedStudentId
    ]
  );


  return result.rows[0];
};




export const removeParticipant = async (
  sessionId,
  studentId
) => {
  const result = await pool.query(
    `
    DELETE FROM session_participants
    WHERE session_id = $1 AND (student_id = $2 OR id = $2)
    RETURNING
        id,
        session_id AS "sessionId",
        student_id AS "studentId"
    `,
    [
      sessionId,
      Number(studentId)
    ]
  );

  return result.rows[0] || null;
};



export default {
  getParticipants,
  addParticipant,
  removeParticipant
};