import attendanceModel from "../models/attendanceModel.js";
import liveSessionModel from "../models/liveSessionModel.js";


export const getAttendance = async (sessionId, studentId) => {

  try {
    return await attendanceModel.getAttendance(
      sessionId,
      studentId
    );
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }

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


  try {
    return await attendanceModel.markAttendance(
      sessionId,
      studentId,
      status
    );
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }

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


  try {
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
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }

};



export default {
  getAttendance,
  markAttendance,
  updateAttendance,
};