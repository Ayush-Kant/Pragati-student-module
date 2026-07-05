import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";

const CompanyRow = ({
  company,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-b hover:bg-slate-50 transition">

      <td className="px-6 py-4 font-medium">
        {company.company}
      </td>

      <td className="px-6 py-4">

        <div className="flex items-center gap-2">

          <MapPin size={16} className="text-red-500"/>

          {company.location}

        </div>

      </td>

      <td className="px-6 py-4 text-green-600 font-semibold">
        {company.package}
      </td>

      <td className="px-6 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(company)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18}/>
          </button>

          <button
            onClick={() => onEdit(company)}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <Pencil size={18}/>
          </button>

          <button
            onClick={() => onDelete(company.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18}/>
          </button>

        </div>

      </td>

    </tr>
  );
};

export default CompanyRow;