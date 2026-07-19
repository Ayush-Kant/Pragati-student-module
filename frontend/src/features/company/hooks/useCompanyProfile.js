import { useEffect, useState } from "react";
export const useCompanyProfile = () => {

    
     const [profile, setProfile] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

 
     // UPDATE PROFILE
     const saveProfile = async (updatedData) => {
         try {
             // simulate API delay
             await new Promise((resolve) =>
                 setTimeout(resolve, 1000)
             );
             // update local frontend state
             setProfile(updatedData);
             return {
                 success: true,
             };
         } catch (err) {
             return {
                 success: false,
                 error: "Failed to update profile",
             };
         }
     };
     useEffect(() => {
          const fetchProfile = async () => {
         try {
             setLoading(true);
             //   const data = await getAdminProfile();
             const data = {
                 fullName: "IIT Delhi",
                 email: "iitdelhi@pragati.dev",
                 avatarUrl: "https://via.placeholder.com/150",
                 role: "company",
                 verified: true,
                 bio: "",
                 contactInfo: {
                     phone: "+91-9876543210",
                     timezone: "Asia/Kolkata",
                 },
             };
             setProfile(data);
             setError("");
         } catch (err) {
             console.log(err);
             setError("Failed to load profile");
         } finally {
             setLoading(false);
         }
     };
         fetchProfile();
     }, []);
     return {
         profile,
         loading,
         error,
         saveProfile,
     };
 };  