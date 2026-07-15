import { pool } from "../config/db.js";

const seedDatabase = async () => {
  try {
    // Categories
    await pool.query(`
      INSERT INTO announcement_categories (name, description)
      VALUES
      ('Placement', 'Placement related announcements'),
      ('Training', 'Training sessions'),
      ('General', 'General college announcements')
      ON CONFLICT DO NOTHING;
    `);

    // Announcements
    await pool.query(`
      INSERT INTO announcements
      (title, description, category_id, status, created_by)
      VALUES
      (
        'Google Placement Drive',
        'Registration starts from 15 October.',
        1,
        'Published',
        1
      ),
      (
        'Resume Building Workshop',
        'Training session by industry experts.',
        2,
        'Draft',
        1
      );
    `);

    // announcement_notifications
    await pool.query(`
      INSERT INTO announcement_notifications
      (
        announcement_id,
        title,
        message,
        audience,
        status
      )
      VALUES
      (
        1,
        'Placement Registration Open',
        'Registration has started.',
        'All Students',
        'Sent'
      );
    `);

    // Recipients
    await pool.query(`
      INSERT INTO notification_recipients
      (
        notification_id,
        recipient_name,
        recipient_email,
        status
      )
      VALUES
      (
        1,
        'Test Student',
        'student@example.com',
        'Delivered'
      );
    `);

    console.log("✅ Seed data inserted successfully.");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();