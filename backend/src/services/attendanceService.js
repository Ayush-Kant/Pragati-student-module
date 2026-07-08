import attendanceModel from "../models/attendanceModel.js";
import liveSessionModel from "../models/liveSessionModel.js";


export const getAttendance = async (sessionId, studentId) => {

  return await attendanceModel.getAttendance(
    sessionId,
    studentId
  );

};



export const markAttendance = async (
  sessionId,
  studentId,
  status
) => {

  const session = await liveSessionModel.getSessionById(
    sessionId
  );


  if (!session) {

    const error = new Error("Session not found");
    error.status = 404;
    throw error;

  }


  return await attendanceModel.markAttendance(
    sessionId,
    studentId,
    status
  );

};



export const updateAttendance = async (
  sessionId,
  studentId,
  status
) => {


  const session = await liveSessionModel.getSessionById(
    sessionId
  );


  if (!session) {

    const error = new Error("Session not found");
    error.status = 404;
    throw error;

  }


  const record = await attendanceModel.updateAttendance(
    sessionId,
    studentId,
    status
  );


  if (!record) {

    const error = new Error(
      "Attendance record not found"
    );

    error.status = 404;
    throw error;

  }


  return record;

};



export default {
  getAttendance,
  markAttendance,
  updateAttendance,
};