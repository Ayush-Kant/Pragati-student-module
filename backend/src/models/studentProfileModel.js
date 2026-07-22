// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileModel.js
//  Data access layer for student core profile + extended profile data.
//
//  Tables:  students  (core)  +  student_profiles  (extended)
//
//  Functions:
//    • getStudentProfile()        — full merged profile view
//    • updateStudentProfile()     — update both tables in one transaction
//    • updatePersonalInformation() — name, phone, gender, dob, avatar
//    • updateContactInformation()  — address, alternate contact
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Row Mappers ───────────────────────────────────────────────────────────────

const toProfile = (row) => ({
    studentId:           row.student_id,
    fullName:            row.full_name,
    email:               row.email,
    phone:               row.phone,
    college:             row.college,
    branch:              row.branch,
    graduationYear:      row.graduation_year,
    profileImage:        row.profile_image,
    // Extended (student_profiles)
    avatarUrl:           row.avatar_url,
    bio:                 row.bio,
    addressLine1:        row.address_line1,
    addressLine2:        row.address_line2,
    city:                row.city,
    state:               row.state,
    country:             row.country,
    pincode:             row.pincode,
    alternatePhone:      row.alternate_phone,
    alternateEmail:      row.alternate_email,
    dateOfBirth:         row.date_of_birth,
    gender:              row.gender,
    profileCompleteness: row.profile_completeness,
    createdAt:           row.created_at,
    updatedAt:           row.updated_at,
});

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * getStudentProfile
 * ──────────────────
 * Returns merged core + extended profile for the given studentId.
 *
 * @param {number} studentId
 * @returns {Promise<object|null>}
 */
export const getStudentProfile = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            s.id                AS student_id,
            s.full_name,
            s.email,
            s.phone,
            s.college,
            s.branch,
            s.graduation_year,
            s.profile_image,
            sp.avatar_url,
            sp.bio,
            sp.address_line1,
            sp.address_line2,
            sp.city,
            sp.state,
            sp.country,
            sp.pincode,
            sp.alternate_phone,
            sp.alternate_email,
            sp.date_of_birth,
            sp.gender,
            COALESCE(sp.profile_completeness, 0) AS profile_completeness,
            s.created_at,
            GREATEST(s.updated_at, sp.updated_at) AS updated_at
        FROM students s
        LEFT JOIN student_profiles sp ON sp.student_id = s.id
        WHERE s.id = $1
        `,
        [studentId]
    );

    return result.rows[0] ? toProfile(result.rows[0]) : null;
};

/**
 * updateStudentProfile
 * ─────────────────────
 * Updates both `students` and `student_profiles` in a single transaction.
 * Only the fields present in profileData are updated (partial update).
 *
 * @param {number} studentId
 * @param {object} profileData  - May contain fields from either table.
 * @returns {Promise<object|null>} Updated merged profile.
 */
export const updateStudentProfile = async (studentId, profileData) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // --- students table fields ---
        const studentFields = [];
        const studentValues = [];
        const studentMapping = {
            fullName:       'full_name',
            phone:          'phone',
            college:        'college',
            branch:         'branch',
            graduationYear: 'graduation_year',
            profileImage:   'profile_image',
        };
        for (const [key, col] of Object.entries(studentMapping)) {
            if (profileData[key] !== undefined) {
                studentValues.push(profileData[key]);
                studentFields.push(`${col} = $${studentValues.length}`);
            }
        }
        if (studentFields.length > 0) {
            studentValues.push(studentId);
            await client.query(
                `UPDATE students SET ${studentFields.join(', ')}, updated_at = NOW()
                 WHERE id = $${studentValues.length}`,
                studentValues
            );
        }

        // --- student_profiles table fields ---
        const profileFields = [];
        const profileValues = [];
        const profileMapping = {
            avatarUrl:      'avatar_url',
            bio:            'bio',
            addressLine1:   'address_line1',
            addressLine2:   'address_line2',
            city:           'city',
            state:          'state',
            country:        'country',
            pincode:        'pincode',
            alternatePhone: 'alternate_phone',
            alternateEmail: 'alternate_email',
            dateOfBirth:    'date_of_birth',
            gender:         'gender',
            profileCompleteness: 'profile_completeness',
        };
        for (const [key, col] of Object.entries(profileMapping)) {
            if (profileData[key] !== undefined) {
                profileValues.push(profileData[key]);
                profileFields.push(`${col} = $${profileValues.length}`);
            }
        }
        if (profileFields.length > 0) {
            profileValues.push(studentId);
            // Upsert the extended profile row
            await client.query(
                `
                INSERT INTO student_profiles (student_id, ${profileFields.map((f) => f.split(' = ')[0]).join(', ')}, created_at, updated_at)
                VALUES ($${profileValues.length}, ${profileValues.slice(0, -1).map((_, i) => `$${i + 1}`).join(', ')}, NOW(), NOW())
                ON CONFLICT (student_id)
                DO UPDATE SET ${profileFields.join(', ')}, updated_at = NOW()
                `,
                profileValues
            );
        } else {
            // Ensure an extended profile row exists (no-op upsert)
            await client.query(
                `
                INSERT INTO student_profiles (student_id, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
                ON CONFLICT (student_id) DO NOTHING
                `,
                [studentId]
            );
        }

        await client.query('COMMIT');
        return getStudentProfile(studentId);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * updatePersonalInformation
 * ──────────────────────────
 * Targeted update for personal info fields: name, phone, gender, dob, avatar.
 *
 * @param {number} studentId
 * @param {object} personalData
 * @returns {Promise<object|null>}
 */
export const updatePersonalInformation = async (studentId, personalData) => {
    return updateStudentProfile(studentId, {
        fullName:    personalData.fullName,
        phone:       personalData.phone,
        gender:      personalData.gender,
        dateOfBirth: personalData.dateOfBirth,
        avatarUrl:   personalData.avatarUrl,
        profileImage: personalData.profileImage,
        bio:         personalData.bio,
    });
};

/**
 * updateContactInformation
 * ─────────────────────────
 * Targeted update for contact fields: address, alternate phone/email.
 *
 * @param {number} studentId
 * @param {object} contactData
 * @returns {Promise<object|null>}
 */
export const updateContactInformation = async (studentId, contactData) => {
    return updateStudentProfile(studentId, {
        addressLine1:   contactData.addressLine1,
        addressLine2:   contactData.addressLine2,
        city:           contactData.city,
        state:          contactData.state,
        country:        contactData.country,
        pincode:        contactData.pincode,
        alternatePhone: contactData.alternatePhone,
        alternateEmail: contactData.alternateEmail,
    });
};
