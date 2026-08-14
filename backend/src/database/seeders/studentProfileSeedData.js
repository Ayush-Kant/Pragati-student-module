// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileSeedData.js
//  Seed data for the Student Profile Management module.
//
//  Usage (run from backend/ directory):
//    node src/database/seeders/studentProfileSeedData.js
//
//  What this seeder does:
//    1. Looks up the first student in the `students` table as the seed target.
//    2. Upserts student_profiles, academic_details, certifications,
//       student_documents, and student_social_links rows for that student.
//    3. Adds sample skills (upsert-safe).
//
//  Safe to re-run — all writes use ON CONFLICT ... DO UPDATE or DO NOTHING.
// ─────────────────────────────────────────────────────────────────────────────

import { pool, connectDB } from '../../../config/db.js';

// ── Seed Data ─────────────────────────────────────────────────────────────────

const studentProfileSeedData = {
    fullName:   'John Doe',
    email:      'john@example.com',
    phone:      '9876543210',
    college:    'Indian Institute of Technology',
    branch:     'Computer Science & Engineering',
    graduationYear: 2025,
};

const extendedProfileSeedData = {
    avatarUrl:    null,
    bio:          'Passionate software developer with a love for building scalable web applications.',
    addressLine1: '42, Tech Street',
    addressLine2: 'Near IT Park',
    city:         'Bangalore',
    state:        'Karnataka',
    country:      'India',
    pincode:      '560001',
    gender:       'male',
    dateOfBirth:  '2002-05-15',
    profileCompleteness: 60,
};

const academicSeedData = {
    institutionName:  'Indian Institute of Technology',
    department:       'Information Technology',
    course:           'B.Tech',
    degree:           'Bachelor of Technology',
    semester:         5,
    graduationYear:   2025,
    cgpa:             8.75,
    enrollmentNumber: 'IIT2022CS042',
    admissionYear:    2021,
    academicEmail:    'john@college.edu',
};

const skillsSeedData = [
    { skillName: 'React.js',   skillLevel: 'intermediate', category: 'Frontend' },
    { skillName: 'Node.js',    skillLevel: 'beginner',     category: 'Backend'  },
    { skillName: 'PostgreSQL', skillLevel: 'intermediate', category: 'Database' },
    { skillName: 'JavaScript', skillLevel: 'advanced',     category: 'Language' },
    { skillName: 'Git',        skillLevel: 'intermediate', category: 'Tools'    },
];

const certificationsSeedData = [
    {
        name:                 'AWS Certified Cloud Practitioner',
        issuingOrganization:  'Amazon Web Services',
        issueDate:            '2023-08-01',
        expiryDate:           '2026-08-01',
        credentialId:         'AWS-CCP-2023-JOHN',
        credentialUrl:        'https://www.credly.com/badges/aws-ccp-john',
    },
    {
        name:                 'Meta Front-End Developer Certificate',
        issuingOrganization:  'Meta (Coursera)',
        issueDate:            '2023-04-15',
        expiryDate:           null,
        credentialId:         'META-FED-2023',
        credentialUrl:        'https://coursera.org/verify/META-FED-2023',
    },
];

const documentsSeedData = [
    {
        documentName: '10th Marksheet',
        documentType: 'marksheet',
        documentUrl:  'https://example.com/documents/10th-marksheet.pdf',
        fileName:     '10th-marksheet.pdf',
        fileSize:     512000,
        mimeType:     'application/pdf',
    },
    {
        documentName: 'Aadhar Card',
        documentType: 'id_proof',
        documentUrl:  'https://example.com/documents/aadhar.pdf',
        fileName:     'aadhar.pdf',
        fileSize:     256000,
        mimeType:     'application/pdf',
    },
];

const socialProfileSeedData = {
    linkedinUrl:  'https://linkedin.com/in/johndoe',
    githubUrl:    'https://github.com/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    twitterUrl:   null,
    websiteUrl:   null,
};

const resumeSeedData = {
    resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
    fileName:  'john-doe-resume.pdf',
    fileSize:  204800,
    mimeType:  'application/pdf',
};

// ── Seeder Functions ──────────────────────────────────────────────────────────

const seedStudentProfile = async (studentId) => {
    await pool.query(
        `
        INSERT INTO student_profiles
            (student_id, avatar_url, bio, address_line1, address_line2, city, state,
             country, pincode, gender, date_of_birth, profile_completeness, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            bio                  = EXCLUDED.bio,
            address_line1        = EXCLUDED.address_line1,
            address_line2        = EXCLUDED.address_line2,
            city                 = EXCLUDED.city,
            state                = EXCLUDED.state,
            country              = EXCLUDED.country,
            pincode              = EXCLUDED.pincode,
            gender               = EXCLUDED.gender,
            date_of_birth        = EXCLUDED.date_of_birth,
            profile_completeness = EXCLUDED.profile_completeness,
            updated_at           = NOW()
        `,
        [
            studentId,
            extendedProfileSeedData.avatarUrl,
            extendedProfileSeedData.bio,
            extendedProfileSeedData.addressLine1,
            extendedProfileSeedData.addressLine2,
            extendedProfileSeedData.city,
            extendedProfileSeedData.state,
            extendedProfileSeedData.country,
            extendedProfileSeedData.pincode,
            extendedProfileSeedData.gender,
            extendedProfileSeedData.dateOfBirth,
            extendedProfileSeedData.profileCompleteness,
        ]
    );
    console.log('  ✅ student_profiles seeded');
};

const seedAcademicDetails = async (studentId) => {
    await pool.query(
        `
        INSERT INTO academic_details
            (student_id, institution_name, department, course, degree, semester,
             graduation_year, cgpa, enrollment_number, admission_year, academic_email,
             created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            institution_name  = EXCLUDED.institution_name,
            department        = EXCLUDED.department,
            course            = EXCLUDED.course,
            degree            = EXCLUDED.degree,
            semester          = EXCLUDED.semester,
            graduation_year   = EXCLUDED.graduation_year,
            cgpa              = EXCLUDED.cgpa,
            enrollment_number = EXCLUDED.enrollment_number,
            admission_year    = EXCLUDED.admission_year,
            academic_email    = EXCLUDED.academic_email,
            updated_at        = NOW()
        `,
        [
            studentId,
            academicSeedData.institutionName,
            academicSeedData.department,
            academicSeedData.course,
            academicSeedData.degree,
            academicSeedData.semester,
            academicSeedData.graduationYear,
            academicSeedData.cgpa,
            academicSeedData.enrollmentNumber,
            academicSeedData.admissionYear,
            academicSeedData.academicEmail,
        ]
    );
    console.log('  ✅ academic_details seeded');
};

const seedSkills = async (studentId) => {
    for (const skill of skillsSeedData) {
        await pool.query(
            `
            INSERT INTO student_skills
                (student_id, skill_name, skill_level, category, created_at, updated_at)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            ON CONFLICT (student_id, skill_name)
            DO UPDATE SET
                skill_level = EXCLUDED.skill_level,
                category    = EXCLUDED.category,
                updated_at  = NOW()
            `,
            [studentId, skill.skillName, skill.skillLevel, skill.category]
        );
    }
    console.log(`  ✅ ${skillsSeedData.length} skills seeded`);
};

const seedCertifications = async (studentId) => {
    for (const cert of certificationsSeedData) {
        await pool.query(
            `
            INSERT INTO certifications
                (student_id, name, issuing_organization, issue_date,
                 expiry_date, credential_id, credential_url, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT (student_id, name, issuing_organization)
            DO UPDATE SET
                issue_date    = EXCLUDED.issue_date,
                expiry_date   = EXCLUDED.expiry_date,
                credential_id = EXCLUDED.credential_id,
                credential_url = EXCLUDED.credential_url,
                updated_at    = NOW()
            `,
            [
                studentId,
                cert.name,
                cert.issuingOrganization,
                cert.issueDate,
                cert.expiryDate,
                cert.credentialId,
                cert.credentialUrl,
            ]
        );
    }
    console.log(`  ✅ ${certificationsSeedData.length} certifications seeded`);
};

const seedDocuments = async (studentId) => {
    for (const doc of documentsSeedData) {
        await pool.query(
            `
            INSERT INTO student_documents
                (student_id, document_name, document_type, document_url,
                 file_name, file_size, mime_type, uploaded_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT DO NOTHING
            `,
            [
                studentId,
                doc.documentName,
                doc.documentType,
                doc.documentUrl,
                doc.fileName,
                doc.fileSize,
                doc.mimeType,
            ]
        );
    }
    console.log(`  ✅ ${documentsSeedData.length} documents seeded`);
};

const seedResume = async (studentId) => {
    await pool.query(
        `
        INSERT INTO student_resumes
            (student_id, resume_url, file_name, file_size, mime_type, uploaded_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            resume_url = EXCLUDED.resume_url,
            file_name  = EXCLUDED.file_name,
            file_size  = EXCLUDED.file_size,
            mime_type  = EXCLUDED.mime_type,
            updated_at = NOW()
        `,
        [
            studentId,
            resumeSeedData.resumeUrl,
            resumeSeedData.fileName,
            resumeSeedData.fileSize,
            resumeSeedData.mimeType,
        ]
    );
    console.log('  ✅ student_resumes seeded');
};

const seedSocialProfiles = async (studentId) => {
    await pool.query(
        `
        INSERT INTO student_social_links
            (student_id, linkedin_url, github_url, portfolio_url,
             twitter_url, website_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            linkedin_url  = EXCLUDED.linkedin_url,
            github_url    = EXCLUDED.github_url,
            portfolio_url = EXCLUDED.portfolio_url,
            twitter_url   = EXCLUDED.twitter_url,
            website_url   = EXCLUDED.website_url,
            updated_at    = NOW()
        `,
        [
            studentId,
            socialProfileSeedData.linkedinUrl,
            socialProfileSeedData.githubUrl,
            socialProfileSeedData.portfolioUrl,
            socialProfileSeedData.twitterUrl,
            socialProfileSeedData.websiteUrl,
        ]
    );
    console.log('  ✅ student_social_links seeded');
};

// ── Main ─────────────────────────────────────────────────────────────────────

const runSeeder = async () => {
    try {
        await connectDB();
        console.log('\n🌱 Starting Student Profile seed...\n');

        // Find the target student — look up by email or use the first student
        const studentRes = await pool.query(
            `SELECT id, full_name FROM students WHERE email = $1 LIMIT 1`,
            [studentProfileSeedData.email]
        );

        let studentId;

        if (studentRes.rows.length > 0) {
            studentId = studentRes.rows[0].id;
            console.log(`📌 Seeding for existing student: ${studentRes.rows[0].full_name} (id=${studentId})\n`);
        } else {
            // Create a minimal student record for seeding purposes
            const newStudent = await pool.query(
                `
                INSERT INTO students
                    (full_name, email, phone, college, branch, graduation_year, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
                RETURNING id, full_name
                `,
                [
                    studentProfileSeedData.fullName,
                    studentProfileSeedData.email,
                    studentProfileSeedData.phone,
                    studentProfileSeedData.college,
                    studentProfileSeedData.branch,
                    studentProfileSeedData.graduationYear,
                ]
            );
            studentId = newStudent.rows[0].id;
            console.log(`📌 Created seed student: ${newStudent.rows[0].full_name} (id=${studentId})\n`);
        }

        await seedStudentProfile(studentId);
        await seedAcademicDetails(studentId);
        await seedSkills(studentId);
        await seedCertifications(studentId);
        await seedDocuments(studentId);
        await seedResume(studentId);
        await seedSocialProfiles(studentId);

        console.log('\n✅ Student Profile seed completed successfully!\n');
    } catch (err) {
        console.error('\n❌ Seed failed:', err.message);
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

runSeeder();

// ── Exported Seed Constants (for reference / testing) ────────────────────────

export {
    studentProfileSeedData,
    extendedProfileSeedData,
    academicSeedData,
    skillsSeedData,
    certificationsSeedData,
    documentsSeedData,
    socialProfileSeedData,
    resumeSeedData,
};
