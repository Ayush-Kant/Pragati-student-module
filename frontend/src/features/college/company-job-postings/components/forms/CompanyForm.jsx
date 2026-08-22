import { useEffect, useReducer, useState } from "react";
import { Building2, MapPin, IndianRupee, Plus } from "lucide-react";
import { validateCompany } from "../../validations/companyJobPostingValidation";


const getInitialFormData = (company) => ({
  name: company?.name || "",
  location: company?.location || "",
  package: company?.package || "",
});

const formReducer = (state, action) => {

  switch(action.type){

    case "reset":
      return action.payload;


    case "change":
      return {
        ...state,
        [action.name]: action.value,
      };


    default:
      return state;
  }

};



const CompanyForm = ({
  onSubmit,
  editingCompany,
  companies = [],
  darkMode,
}) => {


  const [formData, dispatch] = useReducer(
    formReducer,
    editingCompany,
    getInitialFormData
  );


  const [errors,setErrors] = useState({
  name:"",
  location:"",
  package:"",
});


  const [isSubmitting,setIsSubmitting] = useState(false);



  useEffect(()=>{


    dispatch({

      type:"reset",

      payload:getInitialFormData(editingCompany)

    });


   setErrors({
  name:"",
  location:"",
  package:"",
});


  },[editingCompany]);





  const handleChange = (e)=>{


    dispatch({

      type:"change",

      name:e.target.name,

      value:e.target.value,

    });



    setErrors((prev)=>({

      ...prev,

      [e.target.name]:"",

    }));

  };






  const handleSubmit = async(e)=>{


    e.preventDefault();


    if(isSubmitting) return;



    console.log("Form Data:",formData);



    const validationErrors = validateCompany(

      formData,

      companies,

      editingCompany?.id

    );



    console.log(
      "Validation Errors:",
      validationErrors
    );



    setErrors(validationErrors);



    if(Object.keys(validationErrors).length > 0){

      return;

    }



    try{


      setIsSubmitting(true);


      await onSubmit(formData);



      dispatch({

        type:"reset",

        payload:getInitialFormData()

      });



    }
    catch(error){

      console.error(error);

    }
    finally{

      setIsSubmitting(false);

    }


  };





return (

<div
className={`rounded-xl shadow-md p-6 ${
darkMode
? "bg-[#2D2D2D] border border-[#3D3D3D]"
: "bg-white"
}`}
>


<h2
className={`text-xl font-bold mb-6 ${
darkMode ? "text-white" : ""
}`}
>

{
editingCompany
?
"Edit Company"
:
"Add Company"
}

</h2>



<form
onSubmit={handleSubmit}
className="space-y-5"
>



{/* Company Name */}

<div>

<div className="relative">

<Building2
size={18}
className="absolute left-3 top-3 text-slate-400"
/>


<input

type="text"

name="name"

placeholder="Company Name"

value={formData.name}

onChange={handleChange}

className="w-full rounded-lg pl-10 py-3 border outline-none"

/>

</div>


{
errors.name &&

<p className="text-red-500 text-sm mt-1">

{errors.name}

</p>

}

</div>


{/* Location */}

<div>

<div className="relative">

<MapPin
size={18}
className="absolute left-3 top-3 text-slate-400"
/>


<input

type="text"

name="location"

placeholder="Location"

value={formData.location}

onChange={handleChange}

className="w-full rounded-lg pl-10 py-3 border outline-none"

/>


</div>


{
errors.location &&

<p className="text-red-500 text-sm mt-1">

{errors.location}

</p>

}

</div>

{/* Package */}

<div>

<div className="relative">

<IndianRupee
size={18}
className="absolute left-3 top-3 text-slate-400"
/>


<input
type="text"
name="package"
placeholder="Package (Example: 8 LPA)"
value={formData.package}
onChange={handleChange}
className="w-full rounded-lg pl-10 py-3 border outline-none"
/>


</div>


{
errors.package &&
<p className="text-red-500 text-sm mt-1">
{errors.package}
</p>
}

</div>




{/* Button */}

<button

type="submit"

disabled={isSubmitting}

className={`w-full bg-[#ff6d34] text-white py-3 rounded-lg flex justify-center items-center gap-2 ${
isSubmitting
?
"opacity-75 cursor-not-allowed"
:
""
}`}

>


{
isSubmitting
?
(editingCompany ? "Updating..." : "Adding...")
:
(
<>
<Plus size={18}/>

{
editingCompany
?
"Update Company"
:
"Add Company"
}

</>
)

}


</button>




</form>


</div>

);


};


export default CompanyForm;