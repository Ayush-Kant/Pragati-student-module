import recordingService from "../services/recordingService.js";

export const getRecordings = async (req, res, next) => {
  try {
    const recordings = await recordingService.getRecordings();
    res.status(200).json({
      success: true,
      data: recordings,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordingById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams || req.params;
    const recording = await recordingService.getRecording(id);
    res.status(200).json({
      success: true,
      data: recording,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getRecordings,
  getRecordingById,
};
