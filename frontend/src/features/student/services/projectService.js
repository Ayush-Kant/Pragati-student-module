import { projects as initialProjects } from '../types/projectDummyData';

// Maintain in-memory state during the user session
let dbProjects = [...initialProjects];

/**
 * Fetch all projects assigned to the student.
 * Simulates async network request with 800ms latency.
 */
export const getProjects = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: [...dbProjects] });
    }, 800);
  });
};

/**
 * Fetch a single project by its ID.
 * Simulates async network request with 600ms latency.
 */
export const getProjectById = (projectId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = dbProjects.find(p => p.projectId === projectId);
      if (project) {
        resolve({ success: true, data: { ...project } });
      } else {
        reject({ status: 404, message: 'Project not found' });
      }
    }, 600);
  });
};

/**
 * Submit a milestone check-in.
 * Simulates API request with 1200ms latency and supports mock error triggers.
 */
export const submitMilestone = (projectId, milestoneId, payload) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { githubUrl, notes, deployedUrl } = payload;

      // Mock API Error simulations
      if (githubUrl.includes('error-400')) {
        return reject({ status: 400, message: 'Bad Request: Missing required parameters or malformed URLs.' });
      }
      if (githubUrl.includes('error-403')) {
        return reject({ status: 403, message: 'Forbidden: You do not have permission to submit milestones for this project.' });
      }
      if (githubUrl.includes('error-409')) {
        return reject({ status: 409, message: 'Conflict: This milestone has already been submitted and cannot be overwritten.' });
      }

      // Find the project in DB
      const projectIndex = dbProjects.findIndex(p => p.projectId === projectId);
      if (projectIndex === -1) {
        return reject({ status: 404, message: 'Project not found.' });
      }

      const project = dbProjects[projectIndex];
      
      // Find the milestone
      const milestoneIndex = project.milestones.findIndex(m => m.id === milestoneId);
      if (milestoneIndex === -1) {
        return reject({ status: 404, message: 'Milestone not found.' });
      }

      const milestone = project.milestones[milestoneIndex];

      // Enforce deadline check
      const deadline = new Date(milestone.dueAt);
      if (deadline < new Date()) {
        return reject({ status: 400, message: 'Bad Request: Submission deadline for this milestone has passed.' });
      }

      // Mutate state in memory
      const updatedMilestones = [...project.milestones];
      updatedMilestones[milestoneIndex] = {
        ...milestone,
        submitted: true,
        submissionDetails: {
          githubUrl,
          notes: notes || null,
          deployedUrl: deployedUrl || null,
          submittedAt: new Date().toISOString(),
        }
      };

      dbProjects[projectIndex] = {
        ...project,
        milestones: updatedMilestones
      };

      // Return the updated project state
      resolve({ success: true, data: { ...dbProjects[projectIndex] } });
    }, 1200);
  });
};

/**
 * Submit the final project.
 * Simulates multipart/form-data upload API request with 1500ms latency.
 */
export const submitFinalProject = (projectId, formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Read data from FormData or plain object (handling both styles)
      let githubUrl, deployedUrl, reportFile;
      if (formData instanceof FormData) {
        githubUrl = formData.get('githubUrl');
        deployedUrl = formData.get('deployedUrl');
        reportFile = formData.get('reportFile');
      } else {
        githubUrl = formData.githubUrl;
        deployedUrl = formData.deployedUrl;
        reportFile = formData.reportFile;
      }

      // Mock API Error simulations
      if (githubUrl && githubUrl.includes('error-400')) {
        return reject({ status: 400, message: 'Bad Request: Missing required GitHub repository URL.' });
      }
      if (githubUrl && githubUrl.includes('error-403')) {
        return reject({ status: 403, message: 'Forbidden: Project submission is locked. Grading period has started.' });
      }
      if (githubUrl && githubUrl.includes('error-413')) {
        return reject({ status: 413, message: 'Payload Too Large: Uploaded PDF document exceeds 20MB limit.' });
      }

      // Find the project in DB
      const projectIndex = dbProjects.findIndex(p => p.projectId === projectId);
      if (projectIndex === -1) {
        return reject({ status: 404, message: 'Project not found.' });
      }

      const project = dbProjects[projectIndex];

      // Enforce final deadline check
      const deadline = new Date(project.finalDueAt);
      if (deadline < new Date()) {
        return reject({ status: 400, message: 'Bad Request: Final project submission deadline has passed.' });
      }

      // Construct file details
      let fileMeta = null;
      if (reportFile) {
        const sizeInMb = (reportFile.size / (1024 * 1024)).toFixed(1);
        fileMeta = {
          name: reportFile.name,
          size: `${sizeInMb} MB`
        };
      }

      // Mutate state in memory
      dbProjects[projectIndex] = {
        ...project,
        submission: {
          githubUrl,
          deployedUrl: deployedUrl || null,
          reportFileName: fileMeta ? fileMeta.name : null,
          reportFileSize: fileMeta ? fileMeta.size : null,
          submittedAt: new Date().toISOString()
        }
      };

      // Return the updated project state
      resolve({ success: true, data: { ...dbProjects[projectIndex] } });
    }, 1500);
  });
};
