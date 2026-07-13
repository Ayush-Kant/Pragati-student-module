export const companies = [
  {
    id:1,
    company:"Google",
    location:"Bangalore",
    package:"32 LPA"
  },
  {
    id:2,
    company:"Microsoft",
    location:"Hyderabad",
    package:"28 LPA"
  }
];

export const jobPostings=[
  {
    id:1,
    role:"Software Engineer",
    company:"Google",
    location:"Bangalore",
    cgpa:8,
    batch:"2027",
    deadline:"2026-10-10",
    status:"Open",
    department:"CSE",
    package:"32 LPA",
    jobDescription:"We are looking for a Software Engineer to join our core search team. You will build and scale high-performance systems.",
    hiringProcess:"1. Online Assessment\n2. Technical Interviews\n3. Leadership & Googlyness Round"
  },
  {
    id:2,
    role:"Hardware Engineer",
    company:"Microsoft",
    location:"Hyderabad, Telangana",
    cgpa:7.5,
    batch:"2026",
    deadline:"2026-12-15",
    status:"Closed",
    department:"ECE",
    package:"28 LPA",
    jobDescription:"Join the Xbox hardware division. Design, develop, and test next-generation console hardware.",
    hiringProcess:"1. Resume Screening\n2. Written Test\n3. Interview Panel"
  }
];

export const companyApiResponse={
 success:true,
 data:{
   companies,
   jobPostings
 }
};