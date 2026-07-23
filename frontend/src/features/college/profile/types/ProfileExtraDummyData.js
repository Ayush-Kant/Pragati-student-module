// icons
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Pencil,
  Share2,
  Download,
  Mail,
  ShieldOff,
  UserCheck,
  ClipboardCheck,
  MapPin,
  Calendar,
  Globe,
} from "lucide-react";

// ProfileStats Data
export const statsData = [
  {
    icon: Users,
    label: "Students",
    value: "15,240",
    trend: 12,
    color: "blue",
  },
  {
    icon: GraduationCap,
    label: "Faculty",
    value: "842",
    trend: 8,
    color: "purple",
  },
  {
    icon: Building2,
    label: "Companies Visited",
    value: "126",
    trend: -5,
    color: "green",
  },
  {
    icon: Briefcase,
    label: "Placement Rate",
    value: "94%",
    trend: 6,
    color: "orange",
  },
];

// ProfileActions Data 
export const actionsData = [
  {
    icon: Pencil,
    title: "Edit Profile",
    primary: true,
  },
  {
    icon: Share2,
    title: "Share Profile",
  },
  {
    icon: Download,
    title: "Download Report",
  },
  {
    icon: Mail,
    title: "Contact",
  },
];

// ProfileActions - DangerZone Data
export const dangerAction = {
  icon: ShieldOff,
  title: "Deactivate Profile",
};

// ProfileOverview Data
export const profileData = {
  name: "ABC Engineering College",
  collegeType: "Engineering College",
  verified: true,

  banner: "https://uptoskills.com/UptoSkills.webp",

  logo:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsXc7kC2I2DErkip_DZ_nCHg_e_c13gaJ-jQ&s",

  description:
    "ABC Engineering College is committed to academic excellence, innovation, and holistic development of students. The institution bridges the gap between education and industry through skill development, placements, internships, and experiential learning opportunities.",

  location: "Ranchi, Jharkhand",
  established: "2001",
  affiliation: "AKTU, Lucknow",
  website: "www.abc.edu.in",

  address: {
    line1: "Ring Road, Morabadi",
    city: "Ranchi",
    state: "Jharkhand",
    pincode: "834008",
    country: "India",
  },

  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/abc-college",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/abc_college",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/abccollege",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@abccollege",
    },
  ],
};

export const overviewCardsData = [
  {
    icon: MapPin,
    label: "Location",
    value: "Ranchi, Jharkhand",
    color: "blue",
  },
  {
    icon: Calendar,
    label: "Established",
    value: "2001",
    color: "green",
  },
  {
    icon: GraduationCap,
    label: "Affiliated To",
    value: "AKTU, Lucknow",
    color: "purple",
  },
  {
    icon: Globe,
    label: "Website",
    value: "uptoskills",
    url: "https://uptoskills.com",
    color: "orange",
  },
];

// ProfileActivity Data 
export const activitiesData = [
  {
    id: 1,
    icon: Briefcase,
    title: "New placement drive by TCS",
    time: "2 hours ago",
    color: "bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Student John Doe placed in Infosys",
    time: "5 hours ago",
    color: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: 3,
    icon: GraduationCap,
    title: "New internship opportunity added",
    time: "1 day ago",
    color: "bg-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 4,
    icon: ClipboardCheck,
    title: "Assessment drive completed",
    time: "2 days ago",
    color: "bg-rose-500",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: 5,
    icon: Building2,
    title: "Campus drive by Wipro",
    time: "3 days ago",
    color: "bg-indigo-500",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];