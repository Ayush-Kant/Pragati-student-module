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
    cgpa:8,
    batch:"2027",
    deadline:"2026-10-10",
    status:"Open"
  }
];

export const companyApiResponse={
 success:true,
 data:{
   companies,
   jobPostings
 }
};