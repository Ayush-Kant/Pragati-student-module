import React from 'react';
import { 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  Award, 
  Users, 
  Info,
  ExternalLink
} from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import ProfileCard from './ProfileCard';

export default function ProfileDetails({ profile }) {
  if (!profile) return null;

  const {
    address = "N/A",
    website = "",
    email = "",
    phone = "",
    principalName = "N/A",
    collegeType = "N/A",
    accreditation = "N/A",
    totalStudents = "N/A",
    aboutCollege = "",
    contactPerson = {},
    socialLinks = {}
  } = profile;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Organization Details */}
      <div className="lg:col-span-8 lg:order-2 flex flex-col gap-6">
        <ProfileCard title="Organization Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Left Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Address
                </label>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Website
                </label>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {website ? (
                    <a 
                      href={`https://${website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-semibold text-[#f26a1b] hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      {website}
                      <ExternalLink className="w-3 h-3 text-[#f26a1b]/70" />
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {email ? (
                    <a 
                      href={`mailto:${email}`} 
                      className="text-sm font-semibold text-[#f26a1b] hover:underline transition-colors"
                    >
                      {email}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Phone
                </label>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {phone ? (
                    <a 
                      href={`tel:${phone}`} 
                      className="text-sm font-semibold text-gray-700 hover:text-[#f26a1b] transition-colors"
                    >
                      {phone}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Contact Lead
                </label>
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {principalName}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Organization Type
                </label>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {collegeType}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Recognition
                </label>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {accreditation}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Learners Guided
                </label>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {totalStudents}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  About Uptoskills
                </label>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {aboutCollege}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </ProfileCard>
      </div>

      {/* RIGHT COLUMN: Contact Person & Social Links */}
      <div className="lg:col-span-4 lg:order-1 flex flex-col gap-6">
        
        {/* Contact Person Card */}
        <ProfileCard title="Contact Person">
          <div className="flex flex-col items-center text-center p-2">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border-2 border-emerald-100 shadow-sm mb-3 flex-shrink-0 select-none">
              {contactPerson.name ? contactPerson.name.split(' ').map(n => n[0]).join('') : 'CP'}
            </div>

            <h4 className="text-base font-bold text-gray-800">
              {contactPerson.name || "N/A"}
            </h4>
            
            <p className="text-xs font-semibold text-gray-400 mt-0.5 mb-5 block">
              {contactPerson.title || "N/A"}
            </p>

            <div className="w-full h-px bg-gray-100 mb-5"></div>

            <div className="w-full text-left space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {contactPerson.email ? (
                  <a 
                    href={`mailto:${contactPerson.email}`} 
                    className="text-sm font-semibold text-[#f26a1b] hover:underline break-all transition-colors"
                  >
                    {contactPerson.email}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">N/A</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {contactPerson.phone ? (
                  <a 
                    href={`tel:${contactPerson.phone}`} 
                    className="text-sm font-semibold text-gray-700 hover:text-[#f26a1b] transition-colors"
                  >
                    {contactPerson.phone}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">N/A</span>
                )}
              </div>
            </div>

          </div>
        </ProfileCard>

        {/* Social Links Card */}
        <ProfileCard title="Social Links">
          <div className="space-y-4">
            
            {/* Facebook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFacebook className="w-4.5 h-4.5 text-[#1877F2]" />
                <span className="text-sm font-bold text-gray-500">Facebook</span>
              </div>
              {socialLinks.facebook ? (
                <a 
                  href={`https://${socialLinks.facebook}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.facebook}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaLinkedin className="w-4.5 h-4.5 text-[#0A66C2]" />
                <span className="text-sm font-bold text-gray-500">LinkedIn</span>
              </div>
              {socialLinks.linkedin ? (
                <a 
                  href={`https://${socialLinks.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.linkedin}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* Twitter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTwitter className="w-4.5 h-4.5 text-[#1DA1F2]" />
                <span className="text-sm font-bold text-gray-500">Twitter</span>
              </div>
              {socialLinks.twitter ? (
                <a 
                  href={`https://${socialLinks.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.twitter}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaInstagram className="w-4.5 h-4.5 text-[#E1306C]" />
                <span className="text-sm font-bold text-gray-500">Instagram</span>
              </div>
              {socialLinks.instagram ? (
                <a 
                  href={`https://${socialLinks.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-semibold text-[#f26a1b] hover:underline"
                >
                  {socialLinks.instagram}
                </a>
              ) : (
                <span className="text-sm font-semibold text-gray-700">N/A</span>
              )}
            </div>

          </div>
        </ProfileCard>

      </div>
      
    </div>
  );
}
