import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize.js";
import Training from "./Training.js";
import Mentor from "./Mentor.js";
import Student from "./Student.js";

class MentorFeedback extends Model {}

MentorFeedback.init(
  {
    feedbackId: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "feedback_id",
    },
    trainingId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "training_id",
      references: {
        model: Training,
        key: "training_id",
      },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "mentor_id",
      references: {
        model: Mentor,
        key: "id",
      },
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "candidate_id",
      references: {
        model: Student,
        key: "id",
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    sequelize,
    modelName: "MentorFeedback",
    tableName: "mentor_feedback",
    underscored: true,
    hooks: {
      beforeCreate: (feedback) => {
        if (!feedback.feedbackId) {
          const timestamp = Date.now();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          feedback.feedbackId = `MF${timestamp}${randomSuffix}`;
        }
      },
    },
  }
);

MentorFeedback.belongsTo(Training, { foreignKey: "trainingId", as: "training" });
MentorFeedback.belongsTo(Mentor, { foreignKey: "mentorId", as: "mentor" });
MentorFeedback.belongsTo(Student, { foreignKey: "candidateId", as: "candidate" });
Training.hasMany(MentorFeedback, { foreignKey: "trainingId", as: "feedbackList" });

export default MentorFeedback;
