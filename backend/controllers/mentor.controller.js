import { pool } from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const mentorQuery = `
          SELECT
              mentors.id AS mentor_id,
              users.full_name,
              mentors.bio,
              mentors.avatar_url,
              mentors.expertise_tags,
              mentors.verified,
              mentors.availability_json,
              drives.id AS drive_id,
              drives.title
          FROM mentors

          JOIN users
              ON mentors.user_id = users.id

          JOIN auth_users
              ON users.auth_user_id = auth_users.id

          LEFT JOIN drives
              ON drives.mentor_id = mentors.id

          WHERE auth_users.uuid_id = $1;
        `;

    const mentorResult = await pool.query(mentorQuery, [userId]);

    if (mentorResult.rows.length === 0) {
      return res.status(404).json({
        message: "Mentor not found",
      });
    }

    const mentor = mentorResult.rows[0];

    const assignedDrives = mentorResult.rows
      .filter((row) => row.drive_id)
      .map((row) => ({
        driveId: row.drive_id,
        title: row.drive_title,
      }));

    return res.status(200).json({
      mentorId: mentor.mentor_id,
      fullName: mentor.full_name,
      bio: mentor.bio,
      avatarUrl: mentor.avatar_url,
      expertiseTags: mentor.expertise_tags || [],
      availability_json: mentor.availability_json || {},
      verified: mentor.verified,
      assignedDrives,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bio, expertiseTags, avatarUrl, availability } = req.body || {};

    const updatedFields = {};

    // update mentor profile
    const mentorResult = await pool.query(
      `
      UPDATE mentors
      SET
        bio = COALESCE($1, bio),
        expertise_tags = COALESCE($2, expertise_tags),
        avatar_url = COALESCE($3, avatar_url),
        availability_json = COALESCE($4, availability_json)
      WHERE user_id = (
        SELECT users.id
        FROM users
        JOIN auth_users ON auth_users.id = users.auth_user_id
        WHERE auth_users.uuid_id = $5
      )
      RETURNING *
      `,
      [bio, expertiseTags, avatarUrl, availability, userId],
    );

    if (mentorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // only send updated fields
    if (bio !== undefined) {
      updatedFields.bio = bio;
    }

    if (expertiseTags !== undefined) {
      updatedFields.expertiseTags = expertiseTags;
    }

    if (avatarUrl !== undefined) {
      updatedFields.avatarUrl = avatarUrl;
    }

    if (availability !== undefined) {
      updatedFields.availabilityJson = availability;
    }

    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      profile: updatedFields,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
