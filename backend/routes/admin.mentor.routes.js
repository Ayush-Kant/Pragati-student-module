import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as v from '../validators/admin.mentor.validator.js';
import * as c from '../controllers/admin.mentor.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/',                c.listMentors);
router.post('/',               v.validateRegisterBody,  c.registerMentor);
router.get('/:id',             c.getMentorById);
router.get('/:id/performance', c.getMentorPerformance);
router.patch('/:id/assign',    v.validateAssignBody,    c.assignMentor);
router.patch('/:id/replace',   v.validateReplaceBody,   c.replaceMentor);
router.delete('/:id',          c.removeMentor);

export default router;