import * as studentService from '../services/admin.student.service.js';

const listStudents = async (req, res) => {
    try {
        const students = await studentService.listStudents(req.query);

        res.status(200).json({
            students,
            total: students.length,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await studentService.getStudentById(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const getStudentProgress = async (req, res) => {
    try {
        const progress =
            await studentService.getStudentProgress(
                req.params.id
            );

        res.json({
            progress,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const verifyStudent = async (req, res) => {
    try {
        const student =
            await studentService.verifyStudent(
                req.params.id
            );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        res.json({
            message: 'Student verified successfully.',
            student,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const blockStudent = async (req, res) => {
    try {
        const student =
            await studentService.blockStudent(
                req.params.id,
                req.body.reason
            );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        res.json({
            message: 'Student blocked successfully.',
            student,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const unblockStudent = async (req, res) => {
    try {
        const student =
            await studentService.unblockStudent(
                req.params.id
            );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        res.json({
            message: 'Student unblocked successfully.',
            student,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const resetStudentPassword = async (req, res) => {
    try {
        const result =
            await studentService.resetStudentPassword(
                req.params.id
            );

        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const exportStudents = async (req, res) => {
    try {
        const csvData =
            await studentService.exportStudents(
                req.query
            );

        res.setHeader(
            'Content-Type',
            'text/csv'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename="students_export.csv"'
        );

        res.send(csvData);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

export {
    listStudents,
    getStudentById,
    getStudentProgress,
    verifyStudent,
    blockStudent,
    unblockStudent,
    resetStudentPassword,
    exportStudents,
};