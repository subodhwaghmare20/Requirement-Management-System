import fs from 'fs';
import path from 'path';

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
 * Cloudinary Storage Provider Stub Example
 * Ready to be swapped in when Cloudinary credentials are added.
 */
export class CloudinaryStorageProvider implements IStorageProvider {
  async uploadResume(
    file: Express.Multer.File
  ): Promise<StorageUploadResult> {
    // Cloudinary SDK upload implementation goes here
    throw new Error('Cloudinary provider configuration required.');
  }

  async deleteResume(_fileUrl: string): Promise<void> {
    // Cloudinary destroy implementation goes here
  }
}

// Storage Service Factory - Defaults to LocalStorageProvider
export class StorageService {
  private static instance: IStorageProvider;

  public static getProvider(): IStorageProvider {
    if (!this.instance) {
      this.instance = new LocalStorageProvider();
    }
    return this.instance;
  }
}
