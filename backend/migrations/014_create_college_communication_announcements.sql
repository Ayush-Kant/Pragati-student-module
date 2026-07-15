-- =====================================================
-- College Communication & Announcements Module
-- Migration: 014_create_college_communication_announcements.sql
-- =====================================================

-- Announcement Categories
CREATE TABLE IF NOT EXISTS announcement_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES announcement_categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Draft'
        CHECK (status IN ('Draft','Published')),
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcement Notifications
CREATE TABLE IF NOT EXISTS announcement_notifications (
    id SERIAL PRIMARY KEY,
    announcement_id INTEGER REFERENCES announcements(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audience VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Sent')),
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Recipients
CREATE TABLE IF NOT EXISTS notification_recipients (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER REFERENCES announcement_notifications(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150),
    recipient_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Delivered','Failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_announcements_status
ON announcements(status);

CREATE INDEX IF NOT EXISTS idx_announcement_notifications_status
ON announcement_notifications(status);

CREATE INDEX IF NOT EXISTS idx_announcement_notifications_audience
ON announcement_notifications(audience);

CREATE INDEX IF NOT EXISTS idx_notification_recipients_email
ON notification_recipients(recipient_email);