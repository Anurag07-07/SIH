import { Request, Response } from 'express';
import { Readable } from 'stream';
import cloudinary from '../utils/cloudinary.js';
import { create as createExifParser } from 'exif-parser';
import path from 'path';

interface CloudinaryResult {
  public_id?: string;
  secure_url?: string;
  created_at?: string;
  [key: string]: any;
}

export const ImageUpload = async (req: Request, res: Response) => {
  try {
    // Step 1: File aayi hai ya nahi check karo
    if (!req.file) {
      return res.status(400).json({ message: 'No File Uploaded' });
    }

    // Step 2: File extension check karo (sirf JPEG allow karo)
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') {
      return res.status(400).json({
        message: 'Only JPEG images are supported (PNG/Screenshot not allowed)',
      });
    }

    // Step 3: EXIF parser se metadata nikaalo
    let exifData;
    try {
      const parser = createExifParser(req.file.buffer);
      exifData = parser.parse();
    } catch (err) {
      return res.status(400).json({
        message: 'Invalid JPEG file or corrupt EXIF metadata',
      });
    }

    // Step 4: Metadata object banado
    const metadata = {
      clickedAt:
        (exifData.tags.DateTimeOriginal &&
          new Date(exifData.tags.DateTimeOriginal * 1000)) ||
        (exifData.tags.CreateDate &&
          new Date(exifData.tags.CreateDate * 1000)) ||
        (exifData.tags.ModifyDate &&
          new Date(exifData.tags.ModifyDate * 1000)) ||
        null,
      camera: {
        make: exifData.tags.Make || null,
        model: exifData.tags.Model || null,
        lens: exifData.tags.LensModel || null,
        software: exifData.tags.Software || null,
      },
      gps: {
        latitude: exifData.tags.GPSLatitude || null,
        longitude: exifData.tags.GPSLongitude || null,
        altitude: exifData.tags.GPSAltitude || null,
        timestamp: exifData.tags.GPSTimeStamp || null,
        date: exifData.tags.GPSDateStamp || null,
      },
      image: {
        orientation: exifData.tags.Orientation || null,
        width: exifData.imageSize?.width || null,
        height: exifData.imageSize?.height || null,
        iso: exifData.tags.ISO || null,
        exposureTime: exifData.tags.ExposureTime || null,
        aperture: exifData.tags.FNumber || null,
        focalLength: exifData.tags.FocalLength || null,
        flash: exifData.tags.Flash || null,
      },

      isScreenshot: false,
    };

    // Step 5: Agar clickedAt missing hai toh screenshot/WhatsApp image maana jaayega
    if (!metadata.clickedAt) {
      metadata.isScreenshot = true;
      return res.status(400).json({
        message:
          'Invalid image: This looks like a screenshot or WhatsApp image (no EXIF Date found).',
        metadata,
      });
    }

    // Step 6: File ko stream me convert karo aur Cloudinary pe upload karo
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryResult);
        }
      );
      bufferStream.pipe(stream);
    });

    // Step 7: Check karo ki image 24 hrs purani toh nahi
    const now = Date.now();
    const ageInHours =
      (now - metadata.clickedAt.getTime()) / (1000 * 60 * 60);

    if (ageInHours > 24) {
      return res.status(400).json({
        message: `Image is older than 24 hrs (taken at ${metadata.clickedAt.toISOString()})`,
        metadata,
      });
    }

    // Step 8: Success response
    return res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      created_at: result.created_at,
      metadata,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
