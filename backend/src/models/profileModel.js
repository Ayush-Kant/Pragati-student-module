import { pool } from '../../config/db.js';

const toProject = (row) => ({
    id: row.id,
    studentId: row.student_id,
    projectTitle: row.project_title,
    projectDescription: row.project_description,
    projectUrl: row.project_url,
    githubUrl: row.github_url,
    technologies: row.technologies,
    startDate: row.start_date,
    endDate: row.end_date,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const toSkill = (row) => ({
    id: row.id,
    studentId: row.student_id,
    skillName: row.skill_name,
    skillLevel: row.skill_level,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const getResume = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            student_id AS "studentId",
            resume_url AS "resumeUrl",
            file_name AS "fileName",
            file_size AS "fileSize",
            mime_type AS "mimeType",
            uploaded_at AS "uploadedAt",
            updated_at AS "updatedAt"
        FROM student_resumes
        WHERE student_id = $1
        `,
        [studentId]
    );

    return result.rows[0] ?? null;
};

const uploadResume = async (studentId, resumeData) => {
    const {
        resumeUrl,
        fileName = null,
        fileSize = null,
        mimeType = null,
    } = resumeData;

    const result = await pool.query(
        `
        INSERT INTO student_resumes
            (student_id, resume_url, file_name, file_size, mime_type, uploaded_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            resume_url = EXCLUDED.resume_url,
            file_name = EXCLUDED.file_name,
            file_size = EXCLUDED.file_size,
            mime_type = EXCLUDED.mime_type,
            updated_at = NOW()
        RETURNING
            id,
            student_id AS "studentId",
            resume_url AS "resumeUrl",
            file_name AS "fileName",
            file_size AS "fileSize",
            mime_type AS "mimeType",
            uploaded_at AS "uploadedAt",
            updated_at AS "updatedAt"
        `,
        [studentId, resumeUrl, fileName, fileSize, mimeType]
    );

    return result.rows[0];
};

const updateResume = async (studentId, resumeData) => {
    const fields = [];
    const values = [];

    if (resumeData.resumeUrl !== undefined) {
        values.push(resumeData.resumeUrl);
        fields.push(`resume_url = $${values.length}`);
    }

    if (resumeData.fileName !== undefined) {
        values.push(resumeData.fileName);
        fields.push(`file_name = $${values.length}`);
    }

    if (resumeData.fileSize !== undefined) {
        values.push(resumeData.fileSize);
        fields.push(`file_size = $${values.length}`);
    }

    if (resumeData.mimeType !== undefined) {
        values.push(resumeData.mimeType);
        fields.push(`mime_type = $${values.length}`);
    }

    if (fields.length === 0) {
        return getResume(studentId);
    }

    values.push(studentId);

    const result = await pool.query(
        `
        UPDATE student_resumes
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE student_id = $${values.length}
        RETURNING
            id,
            student_id AS "studentId",
            resume_url AS "resumeUrl",
            file_name AS "fileName",
            file_size AS "fileSize",
            mime_type AS "mimeType",
            uploaded_at AS "uploadedAt",
            updated_at AS "updatedAt"
        `,
        values
    );

    return result.rows[0] ?? null;
};

const deleteResume = async (studentId) => {
    const result = await pool.query(
        `
        DELETE FROM student_resumes
        WHERE student_id = $1
        RETURNING id
        `,
        [studentId]
    );

    return result.rows[0] ?? null;
};

const getPortfolio = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            student_id AS "studentId",
            headline,
            bio,
            website_url AS "websiteUrl",
            github_url AS "githubUrl",
            linkedin_url AS "linkedinUrl",
            portfolio_url AS "portfolioUrl",
            is_public AS "isPublic",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM student_portfolios
        WHERE student_id = $1
        `,
        [studentId]
    );

    return result.rows[0] ?? null;
};

const updatePortfolio = async (studentId, portfolioData) => {
    const current = await getPortfolio(studentId);
    let headline = current?.headline ?? null;
    let bio = current?.bio ?? null;
    let websiteUrl = current?.websiteUrl ?? null;
    let githubUrl = current?.githubUrl ?? null;
    let linkedinUrl = current?.linkedinUrl ?? null;
    let portfolioUrl = current?.portfolioUrl ?? null;
    let isPublic = current?.isPublic ?? true;

    if (Object.hasOwn(portfolioData, 'headline')) {
        headline = portfolioData.headline;
    }

    if (Object.hasOwn(portfolioData, 'bio')) {
        bio = portfolioData.bio;
    }

    if (Object.hasOwn(portfolioData, 'websiteUrl')) {
        websiteUrl = portfolioData.websiteUrl;
    }

    if (Object.hasOwn(portfolioData, 'githubUrl')) {
        githubUrl = portfolioData.githubUrl;
    }

    if (Object.hasOwn(portfolioData, 'linkedinUrl')) {
        linkedinUrl = portfolioData.linkedinUrl;
    }

    if (Object.hasOwn(portfolioData, 'portfolioUrl')) {
        portfolioUrl = portfolioData.portfolioUrl;
    }

    if (Object.hasOwn(portfolioData, 'isPublic')) {
        isPublic = portfolioData.isPublic;
    }

    const query = current
        ? `
            UPDATE student_portfolios
            SET
                headline = $2,
                bio = $3,
                website_url = $4,
                github_url = $5,
                linkedin_url = $6,
                portfolio_url = $7,
                is_public = $8,
                updated_at = NOW()
            WHERE student_id = $1
            RETURNING
                id,
                student_id AS "studentId",
                headline,
                bio,
                website_url AS "websiteUrl",
                github_url AS "githubUrl",
                linkedin_url AS "linkedinUrl",
                portfolio_url AS "portfolioUrl",
                is_public AS "isPublic",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `
        : `
            INSERT INTO student_portfolios
                (student_id, headline, bio, website_url, github_url, linkedin_url, portfolio_url, is_public, created_at, updated_at)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING
                id,
                student_id AS "studentId",
                headline,
                bio,
                website_url AS "websiteUrl",
                github_url AS "githubUrl",
                linkedin_url AS "linkedinUrl",
                portfolio_url AS "portfolioUrl",
                is_public AS "isPublic",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `;

    const params = [
        studentId,
        headline,
        bio,
        websiteUrl,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        isPublic,
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
};

const addProject = async (studentId, projectData) => {
    const {
        projectTitle,
        projectDescription = null,
        projectUrl = null,
        githubUrl = null,
        technologies = [],
        startDate = null,
        endDate = null,
        isFeatured = false,
    } = projectData;

    const result = await pool.query(
        `
        INSERT INTO student_projects
            (student_id, project_title, project_description, project_url, github_url, technologies, start_date, end_date, is_featured, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING
            id,
            student_id,
            project_title,
            project_description,
            project_url,
            github_url,
            technologies,
            start_date,
            end_date,
            is_featured,
            created_at,
            updated_at
        `,
        [
            studentId,
            projectTitle,
            projectDescription,
            projectUrl,
            githubUrl,
            technologies,
            startDate,
            endDate,
            isFeatured,
        ]
    );

    return toProject(result.rows[0]);
};

const updateProject = async (projectId, projectData) => {
    const fields = [];
    const values = [];

    const mapping = {
        projectTitle: 'project_title',
        projectDescription: 'project_description',
        projectUrl: 'project_url',
        githubUrl: 'github_url',
        technologies: 'technologies',
        startDate: 'start_date',
        endDate: 'end_date',
        isFeatured: 'is_featured',
    };

    for (const [key, column] of Object.entries(mapping)) {
        if (projectData[key] !== undefined) {
            values.push(projectData[key]);
            fields.push(`${column} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        const current = await pool.query(
            `
            SELECT
                id,
                student_id,
                project_title,
                project_description,
                project_url,
                github_url,
                technologies,
                start_date,
                end_date,
                is_featured,
                created_at,
                updated_at
            FROM student_projects
            WHERE id = $1
            `,
            [projectId]
        );

        return current.rows[0] ? toProject(current.rows[0]) : null;
    }

    values.push(projectId);

    const result = await pool.query(
        `
        UPDATE student_projects
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING
            id,
            student_id,
            project_title,
            project_description,
            project_url,
            github_url,
            technologies,
            start_date,
            end_date,
            is_featured,
            created_at,
            updated_at
        `,
        values
    );

    return result.rows[0] ? toProject(result.rows[0]) : null;
};

const deleteProject = async (projectId) => {
    const result = await pool.query(
        `
        DELETE FROM student_projects
        WHERE id = $1
        RETURNING id
        `,
        [projectId]
    );

    return result.rows[0] ?? null;
};

const addSkill = async (studentId, skillData) => {
    const {
        skillName,
        skillLevel = null,
        category = null,
    } = skillData;

    const result = await pool.query(
        `
        INSERT INTO student_skills
            (student_id, skill_name, skill_level, category, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (student_id, skill_name)
        DO UPDATE SET
            skill_level = EXCLUDED.skill_level,
            category = EXCLUDED.category,
            updated_at = NOW()
        RETURNING
            id,
            student_id,
            skill_name,
            skill_level,
            category,
            created_at,
            updated_at
        `,
        [studentId, skillName, skillLevel, category]
    );

    return toSkill(result.rows[0]);
};

const removeSkill = async (skillId) => {
    const result = await pool.query(
        `
        DELETE FROM student_skills
        WHERE id = $1
        RETURNING id
        `,
        [skillId]
    );

    return result.rows[0] ?? null;
};

const updateSocialLinks = async (studentId, socialLinks) => {
    const {
        linkedinUrl = null,
        githubUrl = null,
        portfolioUrl = null,
        twitterUrl = null,
        websiteUrl = null,
    } = socialLinks;

    const result = await pool.query(
        `
        INSERT INTO student_social_links
            (student_id, linkedin_url, github_url, portfolio_url, twitter_url, website_url, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            linkedin_url = EXCLUDED.linkedin_url,
            github_url = EXCLUDED.github_url,
            portfolio_url = EXCLUDED.portfolio_url,
            twitter_url = EXCLUDED.twitter_url,
            website_url = EXCLUDED.website_url,
            updated_at = NOW()
        RETURNING
            id,
            student_id AS "studentId",
            linkedin_url AS "linkedinUrl",
            github_url AS "githubUrl",
            portfolio_url AS "portfolioUrl",
            twitter_url AS "twitterUrl",
            website_url AS "websiteUrl",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [studentId, linkedinUrl, githubUrl, portfolioUrl, twitterUrl, websiteUrl]
    );

    return result.rows[0];
};

export {
    getResume,
    uploadResume,
    updateResume,
    deleteResume,
    getPortfolio,
    updatePortfolio,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    removeSkill,
    updateSocialLinks,
};