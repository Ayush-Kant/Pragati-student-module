// admin.college.controller.js

import * as service from '../services/admin.college.service.js';
import { sendApprovalEmail }   from '../services/college.email.service.js';
import { sendRejectionEmail }  from '../services/college.email.service.js';
import { sendSuspensionEmail } from '../services/college.email.service.js';

const listColleges = async (req, res) => {
    try {
        const data= await service.listColleges(req.query);
        res.status(200).json({
            colleges: data,
            total:data.length,
            page:  parseInt(req.query.page)  || 1,
            limit: parseInt(req.query.limit) || 20,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCollegeById = async (req, res) => {
    try {
        const college = await service.getCollegeById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(college);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCollegeStats = async (req, res) => {
    try {
        const stats = await service.getCollegeStats(req.params.id);
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const approveCollege = async (req, res) => {
    try {
        const college = await service.approveCollege(req.params.id);

        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        if (college.alreadyApproved) {
            return res.status(400).json({ error: 'College is already approved.' });
        }

        try {
            await sendApprovalEmail(college.email, college.name);
        } catch (emailErr) {
            console.error('Approval email failed:', emailErr.message);
        }

        res.json({
            success: true,
            message: 'College approved and notification email sent.',
            college: {
                collegeId:  college.collegeId,
                status:     college.status,
                verifiedAt: college.verifiedAt,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const rejectCollege = async (req, res) => {
    try {
        const { reason } = req.body;
        const college = await service.rejectCollege(req.params.id, reason);

        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        try {
            await sendRejectionEmail(college.email, college.name, reason);
        } catch (emailErr) {
            console.error('Rejection email failed:', emailErr.message);
        }

        res.json({
            success: true,
            message: 'College rejected and notification email sent.',
            college: {
                collegeId:       college.collegeId,
                status:          college.status,
                rejectionReason: college.rejectionReason,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const suspendCollege = async (req, res) => {
    try {
        const { reason } = req.body;
        const college = await service.suspendCollege(req.params.id, reason);

        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        try {
            await sendSuspensionEmail(college.email, college.name, reason);
        } catch (emailErr) {
            console.error('Suspension email failed:', emailErr.message);
        }

        res.json({
            success: true,
            message: 'College suspended and notification email sent.',
            college: {
                collegeId:        college.collegeId,
                status:           college.status,
                suspensionReason: college.suspensionReason,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCollegeRankings = async (req, res) => {
    try {
        const data = await service.getCollegeRankings();
        res.json({ rankings: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCollegesNeedingDrives = async (req, res) => {
    try {
        const data = await service.getCollegesNeedingDrives();
        res.json({ colleges: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {
    listColleges,
    getCollegeById,
    getCollegeStats,
    approveCollege,
    rejectCollege,
    suspendCollege,
    getCollegeRankings,
    getCollegesNeedingDrives,
};