import {
  Building2,
  MapPin,
  IndianRupee,
} from "lucide-react";

const CompanyDetails = ({ company, darkMode }) => {
  if (!company) return null;

  return (
    <div className={`rounded-xl shadow-md p-8 ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-white'}`}>

      <div className="flex items-center gap-3 mb-6">

        <Building2
          className={darkMode ? 'text-[#ff6d34]' : 'text-blue-600'}
          size={32}
        />

        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>

          {company.company}

        </h1>

      </div>

      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <MapPin
            className="text-red-500"
            size={20}
          />

          <span className={darkMode ? 'text-gray-300' : ''}>{company.location}</span>

        </div>

        <div className="flex items-center gap-3">

          <IndianRupee
            className={darkMode ? 'text-[#00bea3]' : 'text-green-600'}
            size={20}
          />

          <span className={darkMode ? 'text-[#00bea3] font-semibold' : ''}>{company.package}</span>

        </div>

      </div>

    </div>
  );
};

export default CompanyDetails;