// Service to handle API calls for the Mentor Dashboard
export const mentorService = {
  getDashboardData: async () => {
    // Simulating an API response delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            totalMentees: 48,
            activeSessions: 16,
            assignmentsDue: 24,
            tasksAssigned: 36,
            placementProgress: 72,
          },
          upcomingSessions: [
            { id: 1, title: "UI/UX Design Review", mentor: "Anjan Sharma", time: "10:00 AM", date: "19 May, 2026" },
            { id: 2, title: "Mock Interview", mentor: "Anjan Sharma", time: "02:30 PM", date: "20 May, 2026" },
            { id: 3, title: "Career Guidance", mentor: "Anjan Sharma", time: "11:15 AM", date: "22 May, 2026" },
          ],
          leaderboard: [
            { id: 1, name: "Riya Sharma", domain: "UI/UX Design", score: 92 },
            { id: 2, name: "Anjali Verma", domain: "Web Development", score: 89 },
            { id: 3, name: "Neha Patel", domain: "Data Science", score: 87 },
          ],
          notifications: [
            { id: 1, text: "Riya Sharma completed assignment 2", time: "5 mins ago" },
            { id: 2, text: "Anjali Verma submitted project proposal", time: "1 hour ago" },
            { id: 3, text: "Karan Singh completed mock review", time: "2 hours ago" },
          ]
        });
      }, 500);
    });
  }
};
