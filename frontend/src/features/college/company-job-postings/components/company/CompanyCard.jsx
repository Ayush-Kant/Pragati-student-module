import {
  Building2,
  MapPin,
  IndianRupee,
} from "lucide-react";

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">

      <div className="flex items-center gap-3 mb-4">

        <Building2
          className="text-blue-600"
          size={28}
        />

        <h2 className="text-xl font-semibold">
          {company.company}
        </h2>

      </div>

      <div className="space-y-3">

        <div className="flex items-center gap-2">

          <MapPin
            size={18}
            className="text-red-500"
          />

          {company.location}

        </div>

        <div className="flex items-center gap-2">

          <IndianRupee
            size={18}
            className="text-green-600"
          />

          {company.package}

        </div>

      </div>

    </div>
  );
};

export default CompanyCard;