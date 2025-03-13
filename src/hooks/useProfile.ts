// src/hooks/useProfile.ts
import { useCallback } from 'react';
import useProfileStore from '@/store/profile.store';
import useAuthStore from '@/store/auth.store';
import { UpdateProfileRequest } from '@/types/auth.types';

export function useProfile() {
  const { user } = useAuthStore();
  const { 
    profile, 
    isLoading, 
    error,
    fetchProfile,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    clearError
  } = useProfileStore();

  const loadProfile = useCallback(async () => {
    if (user?._id) {
      await fetchProfile(user._id);
    }
  }, [user, fetchProfile]);

  const updateUserProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    if (!profile?._id) {
      return false;
    }
    
    clearError();
    return await updateProfile(profile._id, data);
  }, [profile, updateProfile, clearError]);

  const uploadUserProfileImage = useCallback(async (file: File): Promise<boolean> => {
    if (!profile?._id) {
      return false;
    }
    
    clearError();
    return await uploadProfileImage(profile._id, file);
  }, [profile, uploadProfileImage, clearError]);

  const deleteUserProfileImage = useCallback(async (): Promise<boolean> => {
    if (!profile?._id) {
      return false;
    }
    
    clearError();
    return await deleteProfileImage(profile._id);
  }, [profile, deleteProfileImage, clearError]);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateUserProfile,
    uploadUserProfileImage,
    deleteUserProfileImage,
    clearError
  };
}

export default useProfile;