// admin.student.routes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as v from '../validators/admin.student.validator.js';
import * as c from '../controllers/admin.student.controller.js';
const router  = express.Router();


// router.use(authMiddleware, roleMiddleware('admin'));


router.get('/',                        c.listStudents);
router.get('/export',                  c.exportStudents);   // ⚠️ must be before /:id
router.get('/:id',                     c.getStudentById);
router.get('/:id/progress',            c.getStudentProgress);
router.patch('/:id/verify',            c.verifyStudent);
router.patch('/:id/block',             v.validateBlockBody,  c.blockStudent);
router.patch('/:id/unblock',           c.unblockStudent);
router.post('/:id/reset-pw',           c.resetStudentPassword);


export default router;