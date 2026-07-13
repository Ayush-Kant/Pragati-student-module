import {
  Building2,
  MapPin,
  IndianRupee,
} from "lucide-react";

const CompanyDetails = ({ company }) => {
  if (!company) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-8">

      <div className="flex items-center gap-3 mb-6">

        <Building2
          className="text-blue-600"
          size={32}
        />

        <h1 className="text-3xl font-bold">

          {company.company}

        </h1>

      </div>

      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <MapPin
            className="text-red-500"
            size={20}
          />

          {company.location}

        </div>

        <div className="flex items-center gap-3">

          <IndianRupee
            className="text-green-600"
            size={20}
          />

          {company.package}

        </div>

      </div>

    </div>
  );
};

export default CompanyDetails;