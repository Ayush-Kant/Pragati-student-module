export const dashboardSeedData = {
    activeDrive: {
        driveId: "550e8400-e29b-41d4-a716-446655440000",
        company: "Google",
    },

    quickStats: {
        completedTasks: 6,
        totalTasks: 10,
    },

    progress: {
        completed: 6,
        total: 10,
    },

    upcomingSessions: [
        {
            title: "DSA Session",
            mentorName: "John Doe",
            scheduledAt: "2026-06-15T10:00:00Z",
        },
    ],

    pendingTasks: [
        {
            title: "Complete Assignment",
        },
    ],

    leaderboard: [
        {
            rank: 1,
            percentile: 98,
            isSelf: true,
        },
    ],

    recentNotifications: [
        {
            message: "New drive available",
            timestamp: "2026-06-15T09:00:00Z",
        },
    ],
};

export const dashboardApiResponse = {
    success: true,
    data: dashboardSeedData,
};

export const seedActiveDrive = () => dashboardSeedData.activeDrive;

export const seedQuickStats = () => dashboardSeedData.quickStats;

export const seedProgress = () => dashboardSeedData.progress;

export const seedSessions = () => dashboardSeedData.upcomingSessions;

export const seedTasks = () => dashboardSeedData.pendingTasks;

export const seedLeaderboard = () => dashboardSeedData.leaderboard;

export const seedNotifications = () => dashboardSeedData.recentNotifications;

export const runSeeder = () => {
    console.log(dashboardApiResponse);
};

runSeeder();