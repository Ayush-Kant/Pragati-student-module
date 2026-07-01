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

    const result = await listDisputes({
      type,
      status,
      priority,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
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