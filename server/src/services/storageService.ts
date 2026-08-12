import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

export interface StorageUploadResult {
  url: string;
  originalName: string;
}

export interface IStorageProvider {
  uploadResume(
    file: Express.Multer.File
  ): Promise<StorageUploadResult>;
  deleteResume(fileUrl: string): Promise<void>;
}

/**
 * Local Disk Storage Provider Implementation
 * Stores files in server/uploads/resumes and serves via /uploads/resumes HTTP route.
 */
export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadResume(
    file: Express.Multer.File
  ): Promise<StorageUploadResult> {
    const fileExtension = path.extname(file.originalname);
    const filename = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
    const filePath = path.join(this.uploadDir, filename);

    if (file.buffer) {
      await fs.promises.writeFile(filePath, file.buffer);
    } else if (file.path && file.path !== filePath) {
      await fs.promises.copyFile(file.path, filePath);
    }

    const publicUrl = `/uploads/resumes/${filename}`;
    return {
      url: publicUrl,
      originalName: file.originalname,
    };
  }

  async deleteResume(fileUrl: string): Promise<void> {
    if (!fileUrl) return;
    const filename = path.basename(fileUrl);
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }
  }
}

/**
 * Cloudinary Storage Provider
 * Uploads resume PDFs and documents directly to Cloudinary CDN
 */
export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadResume(
    file: Express.Multer.File
  ): Promise<StorageUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result?.secure_url || '',
            originalName: file.originalname,
          });
        }
      );

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else if (file.path) {
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        reject(new Error('File buffer or path missing for Cloudinary upload'));
      }
    });
  }

  async deleteResume(fileUrl: string): Promise<void> {
    if (!fileUrl || !fileUrl.includes('cloudinary')) return;
    try {
      const parts = fileUrl.split('/');
      const publicIdWithExt = parts.slice(parts.indexOf('resumes')).join('/');
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch {
      // Ignore deletion errors
    }
  }
}

// Storage Service Factory - Dynamically switches between Cloudinary & Local Storage
export class StorageService {
  private static instance: IStorageProvider;

  public static getProvider(): IStorageProvider {
    if (!this.instance) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        this.instance = new CloudinaryStorageProvider();
        console.log('[Storage] Using Cloudinary Cloud Storage Provider');
      } else {
        this.instance = new LocalStorageProvider();
        console.log('[Storage] Using Local Disk Storage Provider');
      }
    }
    return this.instance;
  }
}
