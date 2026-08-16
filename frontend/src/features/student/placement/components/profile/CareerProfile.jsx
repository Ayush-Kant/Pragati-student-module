// src/features/student/placement/components/profile/CareerProfile.jsx
// Complete presentational component for student career profile sections.

import React from 'react';
import {
  User,
  GraduationCap,
  Code2,
  Award,
  FolderGit2,
  Briefcase,
  Sliders,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { PROFILE_SECTION } from '../../constants/placementConstants';
import ProfileSection from './ProfileSection';
import ResumeStatus from './ResumeStatus';
import ProfileCompletion from './ProfileCompletion';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';

// Inline SVGs for brand icons to avoid version discrepancies
function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.59 1.59 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.59 1.59 0 0 0-1.6-1.6Z" />
    </svg>
  );
}

function GitHubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function CareerProfile({
  profile,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader variant="card" count={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load career profile"
        message={error || 'Could not retrieve your profile records.'}
        onRetry={onRetry}
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="Profile not found"
        description="Your placement profile has not been initialized."
        icon="file"
      />
    );
  }

  const {
    name = 'Student',
    email,
    phone,
    rollNumber,
    department,
    batch,
    cgpa,
    college,
    city,
    state,
    linkedIn,
    github,
    portfolio,
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    internships = [],
    preferences = {},
    resume,
    completionPercentage = 78,
    incompleteSections = [],
  } = profile;

  // Student Initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="card bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white border-0 shadow-card-lg relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-inner shrink-0">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {name}
                </h1>
                <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs">
                  Active Candidate
                </span>
              </div>

              <p className="text-xs sm:text-sm text-primary-200">
                {department} • Roll No: <span className="text-white font-mono">{rollNumber}</span>
              </p>

              <p className="text-xs text-primary-300">
                {college} • Batch {batch}
              </p>

              {/* Contact Icons */}
              <div className="flex items-center gap-3 pt-2 text-xs text-primary-200 flex-wrap">
                {email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary-400" />
                    {email}
                  </span>
                )}
                {phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary-400" />
                    {phone}
                  </span>
                )}
                {(city || state) && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary-400" />
                    {[city, state].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links & Key Metrics */}
          <div className="flex flex-col sm:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
            <div className="flex items-center gap-2">
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="GitHub"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
              )}
              {portfolio && (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-xs">
              <span className="text-primary-200">Current CGPA:</span>
              <span className="font-extrabold text-white text-sm">{cgpa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Completion Progress */}
      <ProfileCompletion
        completionPercentage={completionPercentage}
        incompleteSections={incompleteSections}
      />

      {/* 3. Verified Resume Status */}
      <ResumeStatus resume={resume} />

      {/* 4. Education Records */}
      <ProfileSection
        id={PROFILE_SECTION.EDUCATION}
        title="Education History"
        subtitle="Verified academic scores from college records"
        icon={GraduationCap}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary-700">
                    {edu.startYear} – {edu.current ? 'Present' : edu.endYear}
                  </span>
                  {edu.current && (
                    <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs">
                      Current
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-surface-900">{edu.degree}</h4>
                <p className="text-xs text-surface-500 mt-0.5">{edu.institution}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-xs">
                <span className="text-surface-500">Score</span>
                <span className="font-bold text-surface-900">
                  {edu.cgpa ? `CGPA ${edu.cgpa}/10.0` : `${edu.percentage}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 5. Technical Skills */}
      <ProfileSection
        id={PROFILE_SECTION.SKILLS}
        title="Technical Skills"
        subtitle="Programming languages, frameworks, and tools"
        icon={Code2}
      >
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="px-3 py-1.5 rounded-xl border border-surface-200 bg-white shadow-2xs flex items-center gap-2 text-xs"
            >
              <span className="font-semibold text-surface-800">{skill.name}</span>
              <span className="text-2xs text-surface-400 font-medium px-1.5 py-0.5 bg-surface-100 rounded-md">
                {skill.level}
              </span>
              {skill.endorsed && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Assessment Verified" />
              )}
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 6. Projects */}
      <ProfileSection
        id={PROFILE_SECTION.PROJECTS}
        title="Technical Projects"
        subtitle="Notable software and research implementations"
        icon={FolderGit2}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-surface-900">{proj.title}</h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-surface-400 hover:text-surface-700"
                        title="GitHub Repository"
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-surface-400 hover:text-primary-600"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-surface-600 mt-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-100">
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-surface-200/80 text-surface-700 text-2xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 7. Internships & Work Experience */}
      <ProfileSection
        id={PROFILE_SECTION.INTERNSHIPS}
        title="Internships & Experience"
        subtitle="Practical industry exposure and engineering contributions"
        icon={Briefcase}
      >
        <div className="space-y-3">
          {internships.map((intern) => (
            <div
              key={intern.id}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-surface-900">{intern.role}</h4>
                  <p className="text-xs text-primary-700 font-medium">{intern.company} • {intern.location}</p>
                </div>
                <span className="text-2xs font-semibold text-surface-500">
                  {intern.startDate} – {intern.current ? 'Present' : intern.endDate}
                </span>
              </div>
              <p className="text-xs text-surface-600 leading-relaxed mt-1">
                {intern.description}
              </p>
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 8. Certifications */}
      <ProfileSection
        id={PROFILE_SECTION.CERTIFICATIONS}
        title="Certifications & Accreditations"
        subtitle="Industry credentials from verified issuing bodies"
        icon={Award}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-3.5 rounded-xl border border-surface-100 bg-surface-50/60 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="text-xs font-semibold text-surface-900">{cert.title}</h4>
                <p className="text-2xs text-surface-500 mt-0.5">{cert.issuer}</p>
                <span className="inline-block text-2xs text-surface-400 mt-1.5">
                  Issued: {new Date(cert.issuedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Verify Credential"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </ProfileSection>

      {/* 9. Career Preferences */}
      <ProfileSection
        id={PROFILE_SECTION.PREFERENCES}
        title="Career Preferences"
        subtitle="Target job parameters and relocation preferences"
        icon={Sliders}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100">
            <span className="text-surface-500 font-medium">Preferred Roles</span>
            <p className="font-semibold text-surface-800 mt-1">
              {preferences.roles?.join(', ') || 'Software Engineer, Frontend'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100">
            <span className="text-surface-500 font-medium">Target Locations</span>
            <p className="font-semibold text-surface-800 mt-1">
              {preferences.locations?.join(', ') || 'Bangalore, Remote'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100">
            <span className="text-surface-500 font-medium">Expected CTC Range</span>
            <p className="font-semibold text-surface-800 mt-1">
              {preferences.expectedCTC || '8–12 LPA'}
            </p>
          </div>
        </div>
      </ProfileSection>
    </div>
  );
}
