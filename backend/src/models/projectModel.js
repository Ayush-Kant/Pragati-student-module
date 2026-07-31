<<<<<<< HEAD
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
=======
import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "IN_PROGRESS",
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    githubRepoUrl: {
      type: DataTypes.STRING,
      field: "github_repo_url",
      allowNull: true,
    },
    createdById: {
      type: DataTypes.INTEGER,
      field: "created_by_id",
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      field: "start_date",
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      field: "end_date",
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    underscored: true,
    timestamps: true,
  }
);

export default Project;
>>>>>>> b58e0407 (feat: projects backend implementation)
