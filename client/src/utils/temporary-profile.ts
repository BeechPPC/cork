// Temporary client-side profile storage until server issues are resolved
export interface ProfileData {
  dateOfBirth?: string;
  wineExperienceLevel?: string;
  preferredWineTypes?: string[];
  budgetRange?: string;
  location?: string;
  profileCompleted: boolean;
  timestamp: number;
}

const PROFILE_STORAGE_KEY = 'cork_temporary_profile';

export function saveTemporaryProfile(profileData: Omit<ProfileData, 'profileCompleted' | 'timestamp'>): void {
  try {
    const data: ProfileData = {
      ...profileData,
      profileCompleted: true,
      timestamp: Date.now()
    };
    
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
    console.log('Profile saved temporarily to local storage');
  } catch (error) {
    console.error('Failed to save temporary profile:', error);
  }
}

export function getTemporaryProfile(): ProfileData | null {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return null;
    
    const profile = JSON.parse(data) as ProfileData;
    
    // Check if profile is less than 7 days old
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - profile.timestamp > maxAge) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Failed to get temporary profile:', error);
    return null;
  }
}

export function validateAge(dateOfBirth: string): boolean {
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  } catch {
    return false;
  }
}