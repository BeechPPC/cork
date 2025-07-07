import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { AuthUser } from './auth';

// For now, we'll use a simple in-memory storage since Firestore might not be configured
// This can be replaced with actual Firestore operations later

interface BaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseDocument {
  email: string;
  profileCompleted: boolean;
  subscriptionPlan: 'free' | 'premium';
  dateOfBirth?: string;
  wineExperienceLevel?: string;
  preferredWineTypes?: string[];
  budgetRange?: string;
  location?: string;
}

interface SavedWine extends BaseDocument {
  userId: string;
  wineName: string;
  wineType: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  source: 'recommendation' | 'upload';
}

interface UploadedWine extends BaseDocument {
  userId: string;
  wineName: string;
  wineType: string;
  region: string;
  vintage?: string;
  description: string;
  priceRange: string;
  abv: string;
  rating: string;
  imageUrl: string;
  analysis?: string;
  optimalDrinkingStart?: string;
  optimalDrinkingEnd?: string;
  peakYearsStart?: string;
  peakYearsEnd?: string;
  estimatedValue?: string;
}

// In-memory storage (temporary until Firestore is properly configured)
const users: Map<string, User> = new Map();
const savedWines: Map<string, SavedWine> = new Map();
const uploadedWines: Map<string, UploadedWine> = new Map();

export class DatabaseService {
  // User operations
  static async createUser(
    userId: string,
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const user: User = {
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.set(userId, user);
    return userId;
  }

  static async getUser(userId: string): Promise<User | null> {
    return users.get(userId) || null;
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<void> {
    const user = users.get(userId);
    if (user) {
      users.set(userId, { ...user, ...data, updatedAt: new Date() });
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    users.delete(userId);
  }

  // Saved wine operations
  static async saveWine(
    wineData: Omit<SavedWine, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const id = `wine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const wine: SavedWine = {
      id,
      ...wineData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    savedWines.set(id, wine);
    return id;
  }

  static async getSavedWines(userId: string): Promise<SavedWine[]> {
    return Array.from(savedWines.values()).filter(
      wine => wine.userId === userId
    );
  }

  static async deleteSavedWine(wineId: string): Promise<void> {
    savedWines.delete(wineId);
  }

  // Uploaded wine operations
  static async uploadWine(
    wineData: Omit<UploadedWine, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const id = `upload_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const wine: UploadedWine = {
      id,
      ...wineData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    uploadedWines.set(id, wine);
    return id;
  }

  static async getUploadedWines(userId: string): Promise<UploadedWine[]> {
    return Array.from(uploadedWines.values()).filter(
      wine => wine.userId === userId
    );
  }

  static async updateUploadedWine(
    wineId: string,
    data: Partial<UploadedWine>
  ): Promise<void> {
    const wine = uploadedWines.get(wineId);
    if (wine) {
      uploadedWines.set(wineId, { ...wine, ...data, updatedAt: new Date() });
    }
  }

  static async deleteUploadedWine(wineId: string): Promise<void> {
    uploadedWines.delete(wineId);
  }
}
