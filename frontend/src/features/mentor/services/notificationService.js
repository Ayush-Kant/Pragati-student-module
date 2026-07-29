import api from "../../../services/api";



export const mockNotificationData = [

  {
    id:"mock_001",
    type:"success",
    title:"New Mentee Added",
    message:"Sonal Gupta has been assigned to you."
  },


  {
    id:"mock_002",
    type:"info",
    title:"Session Reminder",
    message:"Your mentoring session starts in 30 minutes."
  },


  {
    id:"mock_003",
    type:"warning",
    title:"Profile Incomplete",
    message:"Please complete your mentor profile."
  },


  {
    id:"mock_004",
    type:"error",
    title:"Submission Failed",
    message:"Unable to upload your report."
  }

];




export async function getRecentNotifications(){


  // Mock until backend is ready

  return new Promise((resolve)=>{

    setTimeout(()=>{

      resolve(mockNotificationData);

    },500);


  });



  /*
  
  Real API:

  const response =
      await api.get("/v1/notifications/recent");

  return response.data;

  */

}





export async function dismissNotification(id){


  return new Promise((resolve)=>{


    setTimeout(()=>{


      resolve({
        success:true
      });


    },200);



  });



  /*
  
  Real API:

  return api.put(
    `/v1/notifications/${id}/dismiss`
  );

  */


}