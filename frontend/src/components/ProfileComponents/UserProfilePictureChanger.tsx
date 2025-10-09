import { useAuth } from '../../utils/useAuth';
import { useRef, useState } from 'react';
import IconComponent from '../GeneralComponents/IconComponent';
import { CgProfile } from 'react-icons/cg';
import Button from '../GeneralComponents/Button';
import { BiCamera } from 'react-icons/bi';
import { RiResetLeftLine } from 'react-icons/ri';
import { FaRegSave } from 'react-icons/fa';

const UserProfilePictureChanger = () => {
  const token = useAuth();

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setError(null);
      setSuccess(null);
      setSelectedFile(file);

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const hasChanges = selectedFile !== null;

  const handleReset = () => {
    setPreview(currentImage);
    setSelectedFile(null);
    setError(null);
    setSuccess(null);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    console.log('Saving profile picture...');
  };

  return (
    <div className='flex flex-col sm:w-1/3 items-center justify-center gap-2 sm:gap-4'>
      {preview ? (
        <img
          src={preview as string}
          alt='profilePicture'
          className='rounded-full w-1/2 sm:w-4/5 xl:w-3/5 cursor-pointer object-cover hover:scale-[1.03] transition duration-300'
          onClick={handleImageClick}
        />
      ) : (
        <span onClick={handleImageClick} className='cursor-pointer'>
          <IconComponent
            icon={CgProfile}
            size={96}
            className=' hover:scale-[1.05] transition duration-300'
          />
        </span>
      )}
      <h2>{token.user}</h2>

      {/* Hidden file input*/}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />

      {/* Action buttons */}
      <div className='flex flex-col gap-2'>
        {!hasChanges ? (
          // Show change button when no changes
          <Button
            text='Change profile picture'
            icon={BiCamera}
            onClick={handleButtonClick}
            ClassName=''
          />
        ) : (
          // Show save/reset buttons when there are changes
          <div className='flex gap-2 w-full'>
            <Button
              text='Save'
              icon={FaRegSave}
              iconSize={18}
              onClick={handleSave}
              disabled={isUploading}
              ClassName='flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50'
            />
            <Button
              text='Reset'
              icon={RiResetLeftLine}
              iconSize={18}
              onClick={handleReset}
              disabled={isUploading}
              ClassName='flex-1 !bg-red-300 hover:!bg-red-400 dark:!bg-red-700 dark:hover:!bg-red-600 disabled:opacity-50'
            />
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className='text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md w-full text-center'>
          {error}
        </div>
      )}

      {success && (
        <div className='text-green-600 text-sm bg-green-50 px-3 py-2 rounded-md w-full text-center'>
          {success}
        </div>
      )}

      {isUploading && (
        <div className='text-blue-500 text-sm flex items-center gap-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent'></div>
          Uploading...
        </div>
      )}
    </div>
  );
};

export default UserProfilePictureChanger;
