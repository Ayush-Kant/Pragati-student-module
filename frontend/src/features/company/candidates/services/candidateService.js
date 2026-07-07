// Mock data - replace with actual API calls
const mockCandidates = [
  {
    id: 1,
    name: 'Rahul Patil',
    college: 'IIT Bombay',
    role: 'Software Engineer',
    score: 92,
    status: 'Shortlisted',
    email: 'rahul.patil@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    gpa: '8.9/10.0',
    degree: 'B.Tech CSE',
    graduationYear: '2026',
    skills: ['React', 'Node.js', 'AWS'],
    resume: 'rahul_patil_resume.pdf',
    feedback: 'Strong technical skills with excellent problem-solving abilities. Demonstrated good communication and teamwork during the interview. Highly recommended for the next round.',
    avatar: 'RP'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    college: 'IIT Delhi',
    role: 'Data Analyst',
    score: 88,
    status: 'Assessment',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43211',
    location: 'Delhi, India',
    gpa: '8.5/10.0',
    degree: 'B.Tech CSE',
    graduationYear: '2026',
    skills: ['Python', 'SQL', 'Tableau'],
    resume: 'priya_sharma_resume.pdf',
    feedback: 'Awaiting assessment completion. Initial aptitude scores look promising.',
    avatar: 'PS'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    college: 'BITS Pilani',
    role: 'Product Manager',
    score: 85,
    status: 'Interview',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43212',
    location: 'Bangalore, Karnataka',
    gpa: '8.2/10.0',
    degree: 'B.Tech CSE',
    graduationYear: '2026',
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
    resume: 'amit_kumar_resume.pdf',
    feedback: 'Interview scheduled for next week. Candidate shows good leadership potential.',
    avatar: 'AK'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    college: 'NIT Trichy',
    role: 'UI/UX Designer',
    score: 90,
    status: 'Shortlisted',
    email: 'sneha.reddy@example.com',
    phone: '+91 98765 43213',
    location: 'Chennai, Tamil Nadu',
    gpa: '8.7/10.0',
    degree: 'B.Design',
    graduationYear: '2026',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    resume: 'sneha_reddy_resume.pdf',
    feedback: 'Excellent design portfolio. Shows innovative thinking and attention to detail.',
    avatar: 'SR'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    college: 'VIT Vellore',
    role: 'DevOps Engineer',
    score: 87,
    status: 'Assessment',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43214',
    location: 'Vellore, Tamil Nadu',
    gpa: '8.4/10.0',
    degree: 'B.Tech CSE',
    graduationYear: '2026',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    resume: 'vikram_singh_resume.pdf',
    feedback: 'Strong DevOps fundamentals. Currently evaluating cloud platform expertise.',
    avatar: 'VS'
  }
];

// Candidate Service
export const candidateService = {
  // Get all candidates
  getAllCandidates: async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/candidates');
      // return response.json();
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockCandidates), 300);
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get candidate by ID
  getCandidateById: async (id) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/candidates/${id}`);
      // return response.json();
      return new Promise((resolve) => {
        setTimeout(() => {
          const candidate = mockCandidates.find(c => c.id === id);
          resolve(candidate);
        }, 200);
      });
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  },

  // Search candidates
  searchCandidates: async (query) => {
    try {
      // TODO: Replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockCandidates.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.role.toLowerCase().includes(query.toLowerCase()) ||
            c.college.toLowerCase().includes(query.toLowerCase())
          );
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  },

  // Filter candidates
  filterCandidates: async (filters = {}) => {
    try {
      // TODO: Replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...mockCandidates];

          if (filters.status) {
            filtered = filtered.filter(c => c.status === filters.status);
          }

          if (filters.college) {
            filtered = filtered.filter(c => c.college === filters.college);
          }

          if (filters.role) {
            filtered = filtered.filter(c => c.role === filters.role);
          }

          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      console.error('Error filtering candidates:', error);
      throw error;
    }
  },

  // Update candidate status
  updateCandidateStatus: async (id, status) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/candidates/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      // return response.json();
      return new Promise((resolve) => {
        setTimeout(() => {
          const candidate = mockCandidates.find(c => c.id === id);
          if (candidate) {
            candidate.status = status;
            resolve(candidate);
          }
        }, 300);
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  }
};
