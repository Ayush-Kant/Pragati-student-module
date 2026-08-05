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
import { useOutletContext } from 'react-router-dom';
import ProfileCard from './ProfileCard';

export default function ProfileDetails({ profile }) {
  const { darkMode } = useOutletContext() || {};

  if (!profile) return null;

  const {
    address = "N/A",
    website = "",
    email = "",
    phone = "",
    contact_lead = "N/A",
    collegeType = "N/A",
    accreditation = "N/A",
    learners_guided = "N/A",
    aboutCollege = "",
    contact_person = "N/A",
    socialLinks = {}
  } = profile;

  const labelClass = "text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5";
  const textClass = `text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`;
  const iconClass = "w-4 h-4 text-gray-400 shrink-0";
  const linkClass = "text-sm font-semibold text-[#ff6d34] hover:underline transition-colors";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* LEFT COLUMN: Organization Details */}
      <div className="lg:col-span-8 lg:order-2 flex flex-col gap-6">
        <ProfileCard title="Organization Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Left Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Address</label>
                <div className="flex items-start gap-2.5">
                  <MapPin className={iconClass} />
                  <span className={textClass + " leading-relaxed"}>{address}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Website</label>
                <div className="flex items-center gap-2.5">
                  <Globe className={iconClass} />
                  {website ? (
                    <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-center gap-1.5`}>
                      {website} <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ) : (
                    <span className={textClass}>N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <div className="flex items-center gap-2.5">
                  <Mail className={iconClass} />
                  {email ? (
                    <a href={`mailto:${email}`} className={linkClass}>{email}</a>
                  ) : (
                    <span className={textClass}>N/A</span>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <div className="flex items-center gap-2.5">
                  <Phone className={iconClass} />
                  {phone ? (
                    <a href={`tel:${phone}`} className={`${textClass} hover:text-[#ff6d34] transition-colors`}>{phone}</a>
                  ) : (
                    <span className={textClass}>N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Detail Sub-column */}
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Contact Lead</label>
                <div className="flex items-center gap-2.5">
                  <User className={iconClass} />
                  <span className={textClass}>{contact_lead}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Organization Type</label>
                <div className="flex items-center gap-2.5">
                  <Building2 className={iconClass} />
                  <span className={textClass}>{collegeType}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Recognition</label>
                <div className="flex items-center gap-2.5">
                  <Award className={iconClass} />
                  <span className={textClass}>{accreditation}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Learners Guided</label>
                <div className="flex items-center gap-2.5">
                  <Users className={iconClass} />
                  <span className={textClass}>{learners_guided}</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>About</label>
                <div className="flex items-start gap-2.5">
                  <Info className={iconClass + " mt-0.5"} />
                  <span className={textClass + " leading-relaxed"}>{aboutCollege}</span>
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

            <div className="w-16 h-16 rounded-full bg-[#00bea3]/10 text-[#00bea3] flex items-center justify-center font-bold text-xl border-2 border-[#00bea3]/20 shadow-sm mb-3 shrink-0 select-none">
              {contact_person ? contact_person.split(' ').map(n => n[0]).join('') : 'CP'}
            </div>

            <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {contact_person || "N/A"}
            </h4>

            <p className="text-xs font-semibold text-gray-400 mt-0.5 mb-5 block">{"N/A"}</p>

            <div className={`w-full h-px mb-5 ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-100"}`}></div>

            <div className="w-full text-left space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                {email ? (
                  <a href={`mailto:${email}`} className={linkClass + " break-all"}>{email}</a>
                ) : (
                  <span className={textClass}>N/A</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                {phone ? (
                  <a href={`tel:${phone}`} className={`${textClass} hover:text-[#ff6d34] transition-colors`}>{phone}</a>
                ) : (
                  <span className={textClass}>N/A</span>
                )}
              </div>
            </div>

          </div>
        </ProfileCard>

        {/* Social Links Card */}
        <ProfileCard title="Social Links">
          <div className="space-y-4">
            {[
              { icon: FaFacebook, color: "#1877F2", name: "Facebook", key: "facebook" },
              { icon: FaLinkedin, color: "#0A66C2", name: "LinkedIn", key: "linkedin" },
              { icon: FaTwitter, color: "#1DA1F2", name: "Twitter", key: "twitter" },
              { icon: FaInstagram, color: "#E1306C", name: "Instagram", key: "instagram" },
            ].map(({ icon: Icon, color, name, key }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                  <span className={`text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{name}</span>
                </div>
                {socialLinks[key] ? (
                  <a href={`https://${socialLinks[key]}`} target="_blank" rel="noopener noreferrer" className={linkClass}>{socialLinks[key]}</a>
                ) : (
                  <span className={textClass}>N/A</span>
                )}
              </div>
            ))}
          </div>
        </ProfileCard>

      </div>

    </div>
  );
}
