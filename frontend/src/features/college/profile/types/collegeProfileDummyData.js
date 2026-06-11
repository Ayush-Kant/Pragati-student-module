/**
 * Mock data representation for the College Institution Profile Module.
 * Models clean field parameters matching the college's public and administrative details.
 */
export const collegeProfileDummyData = {
  collegeId: "COL-PRAGATI-2026",
  collegeName: "Pragati Institute of Technology & Management",
  establishmentYear: 2012,
  acreationStatus: "NAAC A+ Grade Certified",
  email: "admin@pragati.edu.in",
  phoneNumber: "+91 20 5555 0199",
  alternativePhone: "+91 20 5555 0198",
  websiteUrl: "https://www.pragati.edu.in",
  
  address: {
    street: "123 Knowledge Campus, University Road",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pinCode: "411001"
  },
  
  administration: {
    principalName: "Dr. Ramesh Kulkarni",
    registrarEmail: "registrar@pragati.edu.in",
    contactPerson: "Prof. Sunita Deshmukh (Dean of Academics)"
  },
  
  metrics: {
    totalDepartments: 8,
    activeStudents: 3200,
    facultyCount: 185
  }
};