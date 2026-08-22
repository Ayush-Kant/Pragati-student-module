import { pool } from "../config/db.js";

/**
 * backend/models/college.department.models.js
 */

const BASE_SELECT = `
SELECT
    d.id,
    d.name,
    d.code,
    d.hod,
    d.description,
    d.is_active,
    d.created_at,
    d.updated_at,

    COALESCE(ds.total_students, 0) AS total_students,
    COUNT(c.id)::int AS total_courses

FROM departments d

LEFT JOIN department_statistics ds
ON ds.department_id = d.id

LEFT JOIN college_courses c
ON c.department_id = d.id

GROUP BY
    d.id,
    d.name,
    d.code,
    d.hod,
    d.description,
    d.is_active,
    d.created_at,
    d.updated_at,
    ds.total_students
`;

export const getAllDepartments = async ({
    limit = 50,
    offset = 0,
    activeOnly = false,
} = {}) => {

    const where = activeOnly ? "WHERE d.is_active = TRUE" : "";

    const { rows } = await pool.query(
        `${BASE_SELECT}
        ${where}
        ORDER BY d.name
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    return rows;
};

export const countDepartments = async ({
    activeOnly = false,
} = {}) => {

    const where = activeOnly ? "WHERE is_active = TRUE" : "";

    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM departments
         ${where}`
    );

    return rows[0].total;
};

export const getDepartmentById = async (id) => {

    const { rows } = await pool.query(
        `${BASE_SELECT}
         HAVING d.id = $1`,
        [id]
    );

    return rows[0] || null;
};

export const getDepartmentByCode = async (code) => {

    const { rows } = await pool.query(
        `SELECT *
         FROM departments
         WHERE code = $1`,
        [code]
    );

    return rows[0] || null;
};

export const getDepartmentByName = async (name) => {

    const { rows } = await pool.query(
        `SELECT *
         FROM departments
         WHERE LOWER(name)=LOWER($1)`,
        [name]
    );

    return rows[0] || null;
};

export const createDepartment = async ({
    name,
    code,
    hod,
    description,
}) => {

    const { rows } = await pool.query(
        `
        INSERT INTO departments
        (
            name,
            code,
            hod,
            description
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING
        id,
        name,
        code,
        hod,
        description,
        is_active,
        created_at,
        updated_at
        `,
        [
            name,
            code,
            hod || null,
            description || null,
        ]
    );

    return rows[0];
};

export const updateDepartment = async (id, fields) => {

    const allowed = [
        "name",
        "code",
        "hod",
        "description",
        "is_active",
    ];

    const setClauses = [];
    const params = [];

    let index = 1;

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            setClauses.push(`${key}=$${index}`);
            params.push(fields[key]);
            index++;
        }
    }

    if (!setClauses.length) {
        return getDepartmentById(id);
    }

    params.push(id);

    const { rows } = await pool.query(
        `
        UPDATE departments
        SET ${setClauses.join(",")}
        WHERE id=$${index}
        RETURNING
        id,
        name,
        code,
        hod,
        description,
        is_active,
        created_at,
        updated_at
        `,
        params
    );

    return rows[0] || null;
};

export const deleteDepartment = async (id) => {

    const { rows } = await pool.query(
        `
        DELETE FROM departments
        WHERE id=$1
        RETURNING id
        `,
        [id]
    );

    return rows[0] || null;
};

export const searchDepartments = async (
    searchTerm,
    {
        limit = 50,
        offset = 0,
    } = {}
) => {

    const { rows } = await pool.query(
        `
        SELECT
            d.id,
            d.name,
            d.code,
            d.hod,
            d.description,
            d.is_active,
            d.created_at,
            d.updated_at,

            COALESCE(ds.total_students,0) AS total_students,
            COUNT(c.id)::int AS total_courses

        FROM departments d

        LEFT JOIN department_statistics ds
        ON ds.department_id = d.id

        LEFT JOIN college_courses c
        ON c.department_id = d.id

        WHERE
            d.name ILIKE $1
            OR d.code ILIKE $1
            OR d.hod ILIKE $1

        GROUP BY
            d.id,
            d.name,
            d.code,
            d.hod,
            d.description,
            d.is_active,
            d.created_at,
            d.updated_at,
            ds.total_students

        ORDER BY d.name

        LIMIT $2 OFFSET $3
        `,
        [
            `%${searchTerm}%`,
            limit,
            offset,
        ]
    );

    return rows;
};

export const getDepartmentStatistics = async (id) => {

    const { rows } = await pool.query(
        `
        SELECT
            d.id AS department_id,
            d.name,
            d.code,

            COALESCE(ds.total_courses,0) AS total_courses,
            COALESCE(ds.total_students,0) AS total_students,
            COALESCE(ds.total_faculty,0) AS total_faculty,
            COALESCE(ds.average_credits,0) AS average_credits,
            ds.updated_at

        FROM departments d

        LEFT JOIN department_statistics ds
        ON ds.department_id = d.id

        WHERE d.id = $1
        `,
        [id]
    );

    return rows[0] || null;
};

export default {
    getAllDepartments,
    countDepartments,
    getDepartmentById,
    getDepartmentByCode,
    getDepartmentByName,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartments,
    getDepartmentStatistics,
};