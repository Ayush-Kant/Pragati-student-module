import {
    getStats,
    getFunnel,
    getCompanyStats,
    getCollegePerformance,
    getActivityFeed
} from '../services/admin.dashboard.service.js';

const getDashboardStats = async(req,res)=>{
    try{
        res.status(200).json(await getStats());
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({error:`Failed to fetch Dashboard Stats`});
    }
};

const getDashboardFunnel = async(req,res)=>{
    try{
        res.status(200).json({funnel: await getFunnel()});
    }
    catch(err){
        res.status(500).json({error:`Failed to fetch Dashboard Funnel`});
    }
};

const getDashboardCompanyStats = async(req,res)=>{
    try{
        res.status(200).json({companies: await getCompanyStats()});
    }
    catch(err){
        res.status(500).json({error:`Failed to fetch Dashboard Company Stats`});
    }
};

const getDashboardCollegePerformance = async(req,res)=>{
    try{
        res.status(200).json({colleges: await getCollegePerformance()});
    }
    catch(err){
        res.status(500).json({error:`Failed to fetch Dashboard College Performance`});
    }
};

const getDashboardActivityFeed = async(req,res)=>{
    try{
        res.status(200).json({activities: await getActivityFeed()});
    }
    catch(err){
        res.status(500).json({error:`Failed to fetch Dashboard Activity Feed `})
    }
};

export {
  getDashboardStats,
  getDashboardFunnel,
  getDashboardCompanyStats,
  getDashboardCollegePerformance,
  getDashboardActivityFeed
};