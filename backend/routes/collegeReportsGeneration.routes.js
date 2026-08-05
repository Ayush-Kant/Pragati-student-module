import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as reportController from '../controllers/collegeReports.controller.js';
import * as exportController from '../controllers/collegeReportExports.controller.js';
import * as historyController from '../controllers/collegeReportHistory.controller.js';
import * as reportValidator from '../validators/collegeReports.validator.js';
import * as exportValidator from '../validators/collegeReportExports.validator.js';
import * as historyValidator from '../validators/collegeReportHistory.validator.js';


const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin', 'college', 'college_admin'));

router.get('/', reportValidator.validateListReports, reportController.getReports);
router.post('/generate', reportValidator.sanitizeInput, reportValidator.validateRequestBody, reportValidator.validateGenerateReport, reportController.generateReport);

router.get('/history', historyValidator.validateListHistory, historyController.getHistory);
router.get('/history/:id', historyValidator.sanitizeInput, historyValidator.validateHistoryId, historyController.getHistoryById);
router.delete('/history/:id', historyValidator.sanitizeInput, historyValidator.validateHistoryId, historyController.deleteHistoryById);

router.get('/exports', exportValidator.validateListExports, exportController.getExports);
router.post('/exports', exportValidator.sanitizeInput, exportValidator.validateCreateExport, exportController.createExport);
router.get('/exports/:id', exportValidator.sanitizeInput, exportValidator.validateExportId, exportController.getExportById);

router.get('/:id/preview', reportValidator.sanitizeInput, reportValidator.validateReportId, reportController.previewReport);
router.get('/:id/export/pdf', reportValidator.sanitizeInput, reportValidator.validateReportId, exportController.exportReportPdf);
router.get('/:id/export/excel', reportValidator.sanitizeInput, reportValidator.validateReportId, exportController.exportReportExcel);
router.get('/:id/export/csv', reportValidator.sanitizeInput, reportValidator.validateReportId, exportController.exportReportCsv);
router.get('/:id/download', reportValidator.sanitizeInput, reportValidator.validateReportId, reportController.downloadReport);
router.delete('/:id', reportValidator.sanitizeInput, reportValidator.validateReportId, reportController.deleteReport);
router.get('/:id', reportValidator.sanitizeInput, reportValidator.validateReportId, reportController.getReportById);

export default router;
