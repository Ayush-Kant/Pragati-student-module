// seedProfileData.js

export const profileSeedData = {
    resume: {
        filename: "resume.pdf",
        url: "uploads/resume.pdf",
    },

    portfolio: {
        headline: "Full Stack Developer",
        bio: "Passionate developer",
        github: "https://github.com/user",
        linkedin: "https://linkedin.com/in/user",
    },

    skills: [
        "Java",
        "React",
        "Node.js",
        "PostgreSQL",
    ],

    projects: [
        {
            title: "Placement Portal",
            description: "Student placement platform.",
        },
    ],
};

export const seedResume = () => {
    return profileSeedData.resume;
};

export const seedPortfolio = () => {
    return profileSeedData.portfolio;
};

export const seedProjects = () => {
    return profileSeedData.projects;
};

export const seedSkills = () => {
    return profileSeedData.skills;
};

export const runSeeder = () => {
    console.log("Resume:", seedResume());
    console.log("Portfolio:", seedPortfolio());
    console.log("Projects:", seedProjects());
    console.log("Skills:", seedSkills());
};

runSeeder();