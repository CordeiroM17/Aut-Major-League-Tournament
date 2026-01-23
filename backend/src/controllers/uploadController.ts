import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Multer Storage Configuration
// Cloudinary Configuration
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tournament-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any, // Type assertion needed for some multer-storage-cloudinary versions
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
  }

  // Cloudinary returns the URL in `path` or `secure_url` depending on the version/types
  // casting 'any' to avoid strict type issues with basic Express.Multer.File which doesn't know about Cloudinary fields
  const fileData = req.file as any;

  res.status(200).json({
    status: 'success',
    data: {
      filename: fileData.filename,
      path: fileData.path, // Cloudinary URL
      url: fileData.path   // Cloudinary URL
    }
  });
};
