import { Router } from 'express';
import multer from 'multer';
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentDownloadUrl,
} from '../controllers/documentsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// All document routes require authentication
router.use(authenticate);

router.get('/', listDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);
router.get('/:id/download', getDocumentDownloadUrl);

export default router;
