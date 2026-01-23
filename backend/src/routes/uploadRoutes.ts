import express, { Request, Response, NextFunction } from 'express';
import { upload, uploadImage } from '../controllers/uploadController';
import multer from 'multer';

const router = express.Router();

// Wrapper to handle Multer errors
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ status: 'fail', message: 'File too large (Max 5MB)' });
      }
      return res.status(400).json({ status: 'fail', message: err.message });
    } else if (err) {
      console.error('Upload Error:', err); // Log the full error
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    next();
  });
};

// POST /api/upload
router.post('/', uploadMiddleware, uploadImage);

export default router;
