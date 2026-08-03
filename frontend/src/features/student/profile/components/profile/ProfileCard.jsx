import ProfileHeader from './ProfileHeader';
import ProfileSummary from './ProfileSummary';

/**
 * A profile card component that provides a glassmorphism container
 * for profile sections, optionally rendering header and summary when
 * a profile object is provided.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {React.ReactNode} [props.children] - Additional content to render inside the card
 * @param {Function} [props.onEdit] - Callback for edit button in header
 * @param {boolean} [props.isEditing] - Whether the profile is currently being edited
 * @returns {JSX.Element} The profile card component
 */
const ProfileCard = ({ profile = {}, children, onEdit, isEditing }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80">
      {profile && Object.keys(profile).length > 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <ProfileHeader
            profile={profile}
            onEdit={onEdit}
            isEditing={isEditing}
          />
          <div className="mt-5">
            <ProfileSummary profile={profile} />
          </div>
        </div>
      )}

      {children && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
