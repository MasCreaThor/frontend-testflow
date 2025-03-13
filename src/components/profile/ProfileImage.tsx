// src/components/profile/ProfileImage.tsx
import React, { useState, useRef } from 'react';
import useProfile from '@/hooks/useProfile';
import '@/styles/profile.css';

interface ProfileImageProps {
  readOnly?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ readOnly = false }) => {
  const { profile, isLoading, uploadUserProfileImage, deleteUserProfileImage } = useProfile();
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMouseEnter = () => {
    if (!readOnly) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      await uploadUserProfileImage(file);
      // Limpiar el input para permitir recargar el mismo archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    await deleteUserProfileImage();
  };

  return (
    <div 
      className="profile-image-container" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {profile?.profileImage ? (
        <div className="profile-image-wrapper">
          <img 
            src={profile.profileImage} 
            alt="Foto de perfil" 
            className="profile-image" 
          />
          {isHovering && !readOnly && (
            <div className="profile-image-overlay">
              <button 
                type="button" 
                className="image-action-button upload"
                onClick={handleFileInputClick}
                title="Cambiar imagen"
              >
                <i className="fas fa-camera"></i>
              </button>
              <button 
                type="button" 
                className="image-action-button remove"
                onClick={handleRemoveImage}
                title="Eliminar imagen"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="profile-image-placeholder" onClick={!readOnly ? handleFileInputClick : undefined}>
          <i className="fas fa-user"></i>
          {isHovering && !readOnly && (
            <div className="profile-placeholder-text">
              <i className="fas fa-camera"></i>
              <span>Añadir foto</span>
            </div>
          )}
        </div>
      )}

      {!readOnly && (
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif" 
          className="file-input-hidden"
        />
      )}

      {isLoading && (
        <div className="profile-image-loading">
          <div className="spinner-small"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;