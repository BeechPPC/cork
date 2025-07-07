// Simple in-memory file storage (temporary until Firebase Storage is properly configured)
// This can be replaced with actual Firebase Storage operations later

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded
  uploadedAt: Date;
}

const files: Map<string, StoredFile> = new Map();

export class StorageService {
  static async uploadFile(file: File, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const id = `file_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const storedFile: StoredFile = {
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
          uploadedAt: new Date(),
        };
        files.set(id, storedFile);
        resolve(id);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static async getFileUrl(fileId: string): Promise<string> {
    const file = files.get(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file.data; // Return the base64 data URL
  }

  static async deleteFile(fileId: string): Promise<void> {
    if (!files.has(fileId)) {
      throw new Error('File not found');
    }
    files.delete(fileId);
  }

  static async getFileMetadata(
    fileId: string
  ): Promise<{
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
  } | null> {
    const file = files.get(fileId);
    if (!file) {
      return null;
    }
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: file.uploadedAt,
    };
  }
}
