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
  darkMode,
}) => {
  return (
    <tr className={`border-b transition ${darkMode ? 'border-[#3D3D3D] hover:bg-[#1A1A1A]' : 'hover:bg-slate-50'}`}>

      <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : ''}`}>
        {company.company}
      </td>

      <td className="px-6 py-4">

        <div className="flex items-center gap-2">

          <MapPin size={16} className="text-red-500"/>

          <span className={darkMode ? 'text-gray-300' : ''}>{company.location}</span>

        </div>

      </td>

      <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-[#00bea3]' : 'text-green-600'}`}>
        {company.package}
      </td>

      <td className="px-6 py-4">

        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(company)}
            className={darkMode ? 'text-[#ff6d34] hover:text-[#ff6d34]/80' : 'text-blue-600 hover:text-blue-800'}
            aria-label="View company details"
          >
            <Eye size={18}/>
          </button>

          <button
            onClick={() => onEdit(company)}
            className="text-yellow-500 hover:text-yellow-700"
            aria-label="Edit company details"
          >
            <Pencil size={18}/>
          </button>

          <button
            onClick={() => onDelete(company.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete company"
          >
            <Trash2 size={18}/>
          </button>

        </div>

      </td>

    </tr>
  );
};

export default CompanyRow;