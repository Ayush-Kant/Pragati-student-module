// ─────────────────────────────────────────────────────────────────────────────
//  src/models/projectModel.js
//  Model aggregator establishing associations for Projects Module (@sequelize/core v7)
// ─────────────────────────────────────────────────────────────────────────────

import StudentProject from "./studentProject.js";
import ProjectMilestone from "./projectMilestone.js";
import ActivitySubmission from "./activitySubmission.js";
import Activity from "./activity.js";

// Establish Associations (@sequelize/core v7 syntax)
StudentProject.hasMany(ProjectMilestone, {
  foreignKey: {
    name: "projectId",
    onDelete: "CASCADE",
  },
  as: "milestones",
});

ProjectMilestone.belongsTo(StudentProject, {
  foreignKey: "projectId",
  as: "project",
});

StudentProject.hasMany(ActivitySubmission, {
  foreignKey: {
    name: "projectId",
    onDelete: "CASCADE",
  },
  as: "submissions",
});

ActivitySubmission.belongsTo(StudentProject, {
  foreignKey: "projectId",
  as: "project",
});

ProjectMilestone.hasMany(ActivitySubmission, {
  foreignKey: {
    name: "milestoneId",
    onDelete: "SET NULL",
  },
  as: "submissions",
});

ActivitySubmission.belongsTo(ProjectMilestone, {
  foreignKey: "milestoneId",
  as: "milestone",
});

export {
  StudentProject,
  ProjectMilestone,
  ActivitySubmission,
  Activity,
};

export default {
  StudentProject,
  ProjectMilestone,
  ActivitySubmission,
  Activity,
};
