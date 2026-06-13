import * as service from "../services/interview.service.js";

/**
 * Get all interviews
 */
const getInterviews = async (req, res) => {
    try {
        const interviews = await service.getInterviews();

        res.json({
            success: true,
            interviews,
            total: interviews.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get interview by ID
 */
const getInterviewById = async (req, res) => {
    try {
        const interview = await service.getInterviewById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found",
            });
        }

        res.json(interview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Create interview
 */
const createInterview = async (req, res) => {
    try {
        const interview = await service.createInterview(req.body);

        res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            interview,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
            code: err.code,
            detail: err.detail,
        });
    }
};

/**
 * Submit feedback
 */
const submitFeedback = async (req, res) => {
    try {
        const interview = await service.submitFeedback(
            req.params.id,
            req.body.feedback
        );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found",
            });
        }

        res.json({
            success: true,
            message: "Feedback submitted successfully",
            interview,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update result
 */
const updateResult = async (req, res) => {
    try {
        const interview = await service.updateResult(
            req.params.id,
            req.body.result,
            req.body.attendance
        );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found",
            });
        }

        res.json({
            success: true,
            message: "Interview result updated successfully",
            interview,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export {
    getInterviews,
    getInterviewById,
    createInterview,
    submitFeedback,
    updateResult,
};