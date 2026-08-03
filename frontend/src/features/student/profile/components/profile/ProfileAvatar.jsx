import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { getInitials } from '../../utils/studentProfileHelpers';

const SIZE_MAP = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-20 h-20 text-lg',
  lg: 'w-32 h-32 text-2xl'
};

/**
 * A profile avatar component that displays a photo or initials,
 * with optional upload functionality when editable.
 * @param {Object} props - The component props
 * @param {string} [props.photoUrl=''] - The URL of the profile photo
 * @param {string} [props.name=''] - The user's full name for initials fallback
 * @param {'sm'|'md'|'lg'} [props.size='md'] - The size variant of the avatar
 * @param {Function} [props.onUpload] - Callback when a new photo is uploaded (receives File)
 * @param {boolean} [props.editable=false] - Whether the avatar is editable with upload overlay
 * @returns {JSX.Element} The profile avatar component
 */
const ProfileAvatar = ({
  photoUrl = '',
  name = '',
  size = 'md',
  onUpload,
  editable = false
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    event.target.value = '';
  };

  const avatarClasses = `${SIZE_MAP[size] || SIZE_MAP.md} rounded-full flex items-center justify-center font-bold text-white overflow-hidden relative group`;

  const initials = getInitials(name);

  return (
    <div className={avatarClasses}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name || 'Profile'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={initials ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gray-300 dark:bg-gray-600'}>
          {initials || '?'}
        </span>
      )}

      {editable && (
        <>
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
