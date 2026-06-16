export const dashboardSeedData = {
    activeDrive: {
        driveId: "1",
        company: "Google",
    },

    progress: {
        completed: 6,
        total: 10,
    },

    sessions: [
        {
            title: "DSA Session",
            date: "2026-06-15",
        },
    ],

    tasks: [
        {
            title: "Complete Assignment",
        },
    ],

    leaderboard: [
        {
            rank: 1,
            percentile: 98,
        },
    ],

    notifications: [
        {
            message: "New drive available",
        },
    ],
};

export const seedActiveDrive = () => dashboardSeedData.activeDrive;

export const seedProgress = () => dashboardSeedData.progress;

export const seedSessions = () => dashboardSeedData.sessions;

export const seedTasks = () => dashboardSeedData.tasks;

export const seedLeaderboard = () => dashboardSeedData.leaderboard;

export const seedNotifications = () => dashboardSeedData.notifications;

export const runSeeder = () => {
    console.log(dashboardSeedData);
};

runSeeder();