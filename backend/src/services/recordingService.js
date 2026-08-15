import recordingModel from "../models/recordingModel.js";

export const getRecordings = async () => {
  return await recordingModel.getRecordings();
};

export const getRecording = async (id) => {
  const recording = await recordingModel.getRecordingById(id);
  if (!recording) {
    const error = new Error("Recording not found");
    error.status = 404;
    throw error;
  }
  return recording;
};

export default {
  getRecordings,
  getRecording,
};
