import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminDashboardFile = path.join(__dirname, 'migrations', '003_create_admin_dashboard.sql');
const companyManagementFile = path.join(__dirname, 'migrations', '005_create_company_management.sql');
const companyTablesFile = path.join(__dirname, 'migrations', '005_create_company_tables.sql');

const robustCompaniesTable = `
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    default_work_mode VARCHAR(50) DEFAULT 'Hybrid',
    probation_period INTEGER DEFAULT 3,
    notice_period INTEGER DEFAULT 30,
    currency VARCHAR(10) DEFAULT 'INR',
    notifications JSONB DEFAULT '{"emailNotifications": true, "interviewReminders": true, "weeklyAnalyticsReport": false, "offerNotifications": true}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
    verification_status VARCHAR(50) DEFAULT 'pending',
    rejection_reason TEXT,
    suspension_reason TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;

// 1. Update 003_create_admin_dashboard.sql
let adminContent = fs.readFileSync(adminDashboardFile, 'utf8');
adminContent = adminContent.replace(/CREATE TABLE IF NOT EXISTS companies \([\s\S]*?\);/m, robustCompaniesTable);
fs.writeFileSync(adminDashboardFile, adminContent, 'utf8');

// 2. Update 005_create_company_management.sql
let companyMgmtContent = fs.readFileSync(companyManagementFile, 'utf8');
// Replace the CREATE TABLE companies block with empty string or comment
companyMgmtContent = companyMgmtContent.replace(/CREATE TABLE IF NOT EXISTS companies \([\s\S]*?\);/m, '-- companies table moved to 003_create_admin_dashboard.sql');
fs.writeFileSync(companyManagementFile, companyMgmtContent, 'utf8');

// 3. Update 005_create_company_tables.sql
let companyTablesContent = fs.readFileSync(companyTablesFile, 'utf8');
companyTablesContent = companyTablesContent.replace(/CREATE TABLE IF NOT EXISTS companies \([\s\S]*?\);/m, '-- companies table moved to 003_create_admin_dashboard.sql');
fs.writeFileSync(companyTablesFile, companyTablesContent, 'utf8');

console.log('Successfully patched companies table collision.');
