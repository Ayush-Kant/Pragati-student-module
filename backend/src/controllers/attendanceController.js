import attendanceService from "../services/attendanceService.js";


export const getAttendance = async (req, res, next) => {
  try {

    const studentId = req.user.id;
    const { sessionId } = req.query;

    const records = await attendanceService.getAttendance(
      sessionId,
      studentId
    );

    res.status(200).json({
      success: true,
      data: records,
    });

  } catch (error) {
    next(error);
  }
};



export const markAttendance = async (req, res, next) => {
  try {

    const { id: sessionId } = req.validatedParams || req.params;

    const body = req.validatedBody || req.body;

    const studentId = body.studentId || req.user.id;

    const { status } = body;


    const record = await attendanceService.markAttendance(
      sessionId,
      studentId,
      status
    );


    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: record,
    });


  } catch (error) {
    next(error);
  }
};



export const updateAttendance = async (req, res, next) => {
  try {

    const { id: sessionId } = req.validatedParams || req.params;

    const body = req.validatedBody || req.body;

    const studentId = body.studentId || req.user.id;

    const { status } = body;


    const existing = await attendanceService.getAttendance(
      sessionId,
      studentId
    );


    if (!existing || existing.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Attendance record not found to update",
      });

    }


    const record = await attendanceService.updateAttendance(
      sessionId,
      studentId,
      status
    );


    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: record,
    });


  } catch (error) {
    next(error);
  }
};



export default {
  getAttendance,
  markAttendance,
  updateAttendance,
};