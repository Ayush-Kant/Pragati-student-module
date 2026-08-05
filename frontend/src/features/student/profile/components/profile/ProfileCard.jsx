import { Mail, Phone, MapPin } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { formatContactValue } from '../../utils/studentProfileHelpers';

/**
 * Left sidebar profile card for the Uptoskills two-column layout.
 * Displays avatar, key stats, contact info, and completion progress.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {Function} [props.onEdit] - Callback for edit button
 * @param {boolean} [props.isEditing] - Whether the profile is currently being edited
 * @param {number} [props.completionPercentage=0] - Profile completion percentage
 * @returns {JSX.Element} The profile sidebar card component
 */
/**
 * Left sidebar profile card for the Uptoskills two-column layout.
 * Displays avatar, key stats, contact info, and completion progress.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {Function} [props.onEdit] - Callback for edit button
 * @param {boolean} [props.isEditing] - Whether the profile is currently being edited
 * @param {Function} [props.onUploadPhoto] - Callback when profile photo is uploaded
 * @returns {JSX.Element} The profile sidebar card component
 */
const ProfileCard = ({ profile = {}, onUploadPhoto }) => {
  if (!profile || Object.keys(profile).length === 0) {
    return null;
  }

  const fullName = profile.fullName || 'Student Name';
  const department = profile.department || 'Department';
  const course = profile.course || 'Course';
  const semester = profile.semester || '';
  const cgpa = profile.cgpa;
  const email = profile.email || '';
  const phone = profile.phone || '';
  const address = profile.address || {};

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm hover:shadow-orange-500/10 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <ProfileAvatar
          photoUrl={profile.profilePhoto}
          name={fullName}
          size="lg"
          editable={!!onUploadPhoto}
          onUpload={onUploadPhoto}
        />

        <h2 className="mt-4 text-xl font-semibold text-white">{fullName}</h2>
        <p className="text-sm text-gray-400 mt-1">{course} • {department}</p>

        <div className="w-full mt-6 space-y-3">
          {cgpa !== undefined && cgpa !== null && (
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors duration-200">
              <span className="text-sm text-gray-400">CGPA</span>
              <span className="text-sm font-semibold text-white">{cgpa.toFixed(2)}</span>
            </div>
          )}

          {semester && (
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors duration-200">
              <span className="text-sm text-gray-400">Semester</span>
              <span className="text-sm font-semibold text-white">Sem {semester}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors duration-200">
            <span className="text-sm text-gray-400">Course</span>
            <span className="text-sm font-semibold text-white">{course}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors duration-200">
            <span className="text-sm text-gray-400">Department</span>
            <span className="text-sm font-semibold text-white text-right max-w-[60%] truncate">{department}</span>
          </div>
        </div>

        {(email || phone) && (
          <div className="w-full mt-4 space-y-2">
            {email && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="truncate">{formatContactValue('email', email)}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="truncate">{formatContactValue('phone', phone)}</span>
              </div>
            )}
            {address.city && address.state && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                <span className="truncate">{address.city}, {address.state}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
