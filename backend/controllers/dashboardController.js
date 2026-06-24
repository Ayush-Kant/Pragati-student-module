const getDashboard = (req, res) => {
  res.status(200).json({
    message: "Dashboard API Working",
  });
};

const getLeaderboard = (req, res) => {
  const { driveId } = req.params;

  res.status(200).json({
    message: "Leaderboard API Working",
    driveId,
  });
};

const getNotifications = (req, res) => {
  res.status(200).json({
    message: "Notifications API Working",
  });
};

export {
  getDashboard,
  getLeaderboard,
  getNotifications,
};