import AssignmentService from '../services/assignmentService.js';
import { normalizeError, normalizeStudentId } from '../utils/assignmentHelpers.js';

const requireNonStudent = (req, message) => {
    if (req.user?.role === 'student') throw normalizeError(message, 403);
};
const requireStudent = (req, message) => {
    if (req.user?.role !== 'student') throw normalizeError(message, 403);
};

export const createAssignment = async (req, res, next) => { try { requireNonStudent(req,'Access forbidden: Students cannot create assignments'); const assignment=await AssignmentService.createAssignment({...req.validatedBody,studentId:req.validatedBody?.studentId??null}); res.status(201).json({success:true,data:assignment}); } catch(error){ next(error); } };
export const listAssignments = async (req,res,next)=>{try{const studentId=await normalizeStudentId(req); const assignments=await AssignmentService.listAssignments({studentId,status:req.query?.status}); res.status(200).json({success:true,data:assignments});}catch(error){next(error);}};
export const getAssignmentById = async (req,res,next)=>{try{const {id}=req.validatedParams; const studentId=await normalizeStudentId(req); const assignment=await AssignmentService.getAssignmentById(id,studentId); if(!assignment) throw normalizeError('Assignment not found',404); res.status(200).json({success:true,data:assignment});}catch(error){next(error);}};
export const updateAssignment = async(req,res,next)=>{try{requireNonStudent(req,'Access forbidden: Students cannot update assignments'); const assignment=await AssignmentService.updateAssignment(req.validatedParams.id,req.validatedBody); res.status(200).json({success:true,data:assignment});}catch(error){next(error);}};
export const deleteAssignment = async(req,res,next)=>{try{requireNonStudent(req,'Access forbidden: Students cannot delete assignments'); const result=await AssignmentService.deleteAssignment(req.validatedParams.id); res.status(200).json({success:true,data:result});}catch(error){next(error);}};
export const submitAssignment = async(req,res,next)=>{try{requireStudent(req,'Access forbidden: Only students can submit assignments'); const {id}=req.validatedParams; const studentId=await normalizeStudentId(req); const assignment=await AssignmentService.getAssignmentById(id,studentId); if(!assignment) throw normalizeError('Assignment not found',404); const submission=await AssignmentService.submitAssignment(id,studentId,{...req.validatedBody,fileName:req.file?.originalname,fileType:req.file?.mimetype}); res.status(200).json({success:true,data:submission});}catch(error){next(error);}};
export const getSubmission = async(req,res,next)=>{try{const studentId=await normalizeStudentId(req); const submission=await AssignmentService.getSubmission(req.validatedParams.id,studentId); res.status(200).json({success:true,data:submission});}catch(error){next(error);}};
export const listSubmissions = async(req,res,next)=>{try{const studentId=await normalizeStudentId(req); const submissions=await AssignmentService.listSubmissions({studentId,assignmentId:req.query?.assignmentId??null,status:req.query?.status??null}); res.status(200).json({success:true,data:submissions});}catch(error){next(error);}};
export const getStatistics = async(req,res,next)=>{try{const studentId=await normalizeStudentId(req); const stats=await AssignmentService.getStatistics({studentId}); res.status(200).json({success:true,data:stats});}catch(error){next(error);}};
export const addFeedback = async(req,res,next)=>{try{requireNonStudent(req,'Access forbidden: Students cannot add feedback'); const feedback=await AssignmentService.addFeedback(req.validatedParams.id,req.validatedParams.studentId,req.validatedBody); res.status(200).json({success:true,data:feedback});}catch(error){next(error);}};
export const addGrade = async(req,res,next)=>{try{requireNonStudent(req,'Access forbidden: Students cannot add grade'); const grade=await AssignmentService.addGrade(req.validatedParams.id,req.validatedParams.studentId,req.validatedBody); res.status(200).json({success:true,data:grade});}catch(error){next(error);}};

export default {createAssignment,listAssignments,getAssignmentById,updateAssignment,deleteAssignment,submitAssignment,getSubmission,listSubmissions,getStatistics,addFeedback,addGrade};
