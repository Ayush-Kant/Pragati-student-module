import {
  listDisputes,
  getDisputeById as getDisputeByIdService,
  markInReview,
  resolveDispute as resolveDisputeService,
  escalateDispute as escalateDisputeService,
  addInternalNote,
} from "../services/admin.dispute.service.js";

// GET /api/v1/admin/disputes
export const getDisputes = async (req, res) => {
  try {
    const { type, status, priority, page, limit } = req.query;

    // Temporary dummy data as requested by Tarak
    const dummyDisputes = {
      disputes: [
        {
          id: 1,
          filed_by_id: 3,
          filed_by_role: 'student',
          filed_by_name: 'Rahul Sharma',
          against_id: 10,
          against_role: 'mentor',
          against_name: 'Priya Patel',
          dispute_type: 'mentor',
          description: 'Mentor was not responding to queries for 2 weeks.',
          status: 'open',
          priority: 'high',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          filed_by_id: 4,
          filed_by_role: 'student',
          filed_by_name: 'Sneha Gupta',
          against_id: 15,
          against_role: 'college',
          against_name: 'NIT Trichy',
          dispute_type: 'fraud',
          description: 'College charged extra fee for placement drive.',
          status: 'in_review',
          priority: 'medium',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          filed_by_id: 5,
          filed_by_role: 'admin',
          filed_by_name: 'Super Admin',
          against_id: 12,
          against_role: 'mentor',
          against_name: 'Vikram Singh',
          dispute_type: 'drive',
          description: 'Mentor missed 3 scheduled sessions consecutively.',
          status: 'resolved',
          priority: 'low',
          resolution: 'Mentor warned and suspended for 1 month.',
          created_at: new Date().toISOString()
        }
      ],
      total: 3,
      page: 1,
      limit: 10,
      totalPages: 1
    };

    return res.status(200).json({
      success: true,
      data: dummyDisputes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/v1/admin/disputes/:id
export const getDispute = async (req, res) => {
  try {
    const { id } = req.params;

    const dispute = await getDisputeByIdService(id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PATCH /api/v1/admin/disputes/:id/review
export const reviewDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewerId = req.user.uid;

    const result = await markInReview(id, reviewerId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    if (result.invalidTransition) {
      return res.status(400).json({
        success: false,
        message: `Cannot move dispute to in_review from ${result.currentStatus}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dispute marked as in review",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PATCH /api/v1/admin/disputes/:id/resolve
export const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const resolverId = req.user.uid;

    const result = await resolveDisputeService(id, resolution, resolverId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    if (result.invalidTransition) {
      return res.status(400).json({
        success: false,
        message: `Cannot resolve dispute from ${result.currentStatus}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dispute resolved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PATCH /api/v1/admin/disputes/:id/escalate
export const escalateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const escalatorId = req.user.uid;

    const result = await escalateDisputeService(id, reason, escalatorId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    if (result.invalidTransition) {
      return res.status(400).json({
        success: false,
        message: `Cannot escalate dispute from ${result.currentStatus}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dispute escalated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/v1/admin/disputes/:id/notes
export const addDisputeNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.user.uid;

    const result = await addInternalNote(id, note, adminId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Internal note added successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};