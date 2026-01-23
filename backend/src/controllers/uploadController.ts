import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Navigate from src/controllers to public/uploads
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter (Optional: specific types)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
  }

  // Construct URL. Modify generic 'localhost' if deployed, but good for dev
  // If behind proxy or specialized domain, might need config.
  // For now, returning relative path or full URL based on request host.
  const protocol = req.protocol;
  const host = req.get('host');
  const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.status(200).json({
    status: 'success',
    data: {
      filename: req.file.filename,
      path: req.file.path,
      url: fileUrl
    }
  });
};
