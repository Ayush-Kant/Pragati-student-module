import { response } from "express";
import { getDashboardOverview as getDashboardOverviewservices,
  getDashboardStats as getDashboardStatsservices,
  getDashboardActivities as getDashboardActivitiesservices,
  getPlacementAnalytics as getPlacementAnalyticsservices,
  getRevenueAnalytics as getRevenueAnalyticsservices,
  getAdmissionsAnalytics as getAdmissionsAnalyticsservices
} from "../services/college.dashboard.service.js";
 

export const getDashboardOverview = async (req, res, next) => {
   try {
     const overview = await getDashboardOverviewservices();
 
 
 
     return res.status(200).json({
       success: true,
       data: overview
     });
   } catch (error) {
     next(error);
   }
};

export const getDashboardActivities = async (req, res, next) => {
   try {
     const activities = await getDashboardActivitiesservices();
 
 
     return res.status(200).json({
       success: true,
       data: activities
     });
   } catch (error) {
     next(error);
   }
};
 
export const getDashboardStats = async (req, res, next) => {
     try {
       const stats = await getDashboardStatsservices();
   
 
 
       return res.status(200).json({
         success: true,
         data: stats
       });
     } catch (error) {
       next(error);
     }
};   
 
export const getPlacementAnalytics = async (req, res, next) => {
     try {
       const placementAnalytics = await getPlacementAnalyticsservices();
   
 
 
       return res.status(200).json({
         success: true,
         data: placementAnalytics
       });
     } catch (error) {
       next(error);
     }
};   
 
export const getRevenueAnalytics = async (req, res, next) => {
     try {
       const revenueAnalytics = await getRevenueAnalyticsservices();
   
 
 
       return res.status(200).json({
         success: true,
         data: revenueAnalytics
        });
     } catch (error) {
       next(error);
     }
}; 
 
export const getAdmissionsAnalytics = async (req, res, next) => {
     try {
       const admissionsAnalytics = await getAdmissionsAnalyticsservices();
   
 
 
       return res.status(200).json({
         success: true,
         data: admissionsAnalytics
       });
     } catch (error) {
       next(error);
     }
}; 