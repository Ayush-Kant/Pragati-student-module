import { useState, useEffect } from "react";
import { X, Printer, ShieldAlert, Award, TrendingUp, Users, DollarSign } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorState from "../common/ErrorState";
import { previewReport } from "../../services/reportsService";
import ExportPDFButton from "../export/ExportPDFButton";
import ExportExcelButton from "../export/ExportExcelButton";
import ExportCSVButton from "../export/ExportCSVButton";

const barColors = [
  "bg-blue-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-purple-400",
  "bg-cyan-400"
];

export const ReportPreview = ({ 
  reportId, 
  isOpen, 
  onClose,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  exportingId,
  darkMode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && reportId) {
      const loadPreview = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await previewReport(reportId);
          if (response.success) {
            setData(response.data);
          } else {
            setError("Failed to compile preview data.");
          }
        } catch (err) {
          setError(err.message || "Unable to preview report.");
        } finally {
          setLoading(false);
        }
      };
      loadPreview();
    }
  }, [isOpen, reportId]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${darkMode ? 'bg-black/70' : 'bg-slate-900/60 backdrop-blur-sm'}`}>
      <div className={`relative w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border overflow-hidden animate-scale-up ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-slate-50 border-slate-100'}`}>
        
        {/* Header (No-Print) */}
        <div className={`flex items-center justify-between p-5 no-print ${darkMode ? 'border-b border-[#3D3D3D] bg-[#1A1A1A]' : 'border-b border-slate-200/60 bg-white'}`}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-light text-primary px-2 py-0.5 rounded">
                Live Data Preview
              </span>
              {data && (
                <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${darkMode ? 'bg-[#2D2D2D] text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
                  Format: {data.type}
                </span>
              )}
            </div>
            <h3 className={`text-base font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {data ? data.title : "Analyzing Report Schema..."}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition cursor-pointer ${darkMode ? 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 print-container ${darkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
          {loading ? (
            <div className="py-12"><LoadingSpinner message="Querying database and generating analytics stream..." darkMode={darkMode} /></div>
          ) : error ? (
            <div className="py-6"><ErrorState message={error} darkMode={darkMode} /></div>
          ) : data ? (
            <>
              {/* Report Header Block (Print Friendly) */}
              <div className={`flex flex-col sm:flex-row justify-between pb-5 ${darkMode ? 'border-b border-[#3D3D3D]' : 'border-b border-slate-200'}`}>
                <div>
                  <div className={`text-2xl font-extrabold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{data.title}</div>
                  <div className={`text-sm font-semibold mt-1.5 flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                    <span>Generated on {data.generatedOn}</span>
                    <span>•</span>
                    <span>By {data.generatedBy || "System Operator"}</span>
                  </div>
                </div>
                {/* Applied Parameters info */}
                <div className={`mt-4 sm:mt-0 rounded-xl p-3 text-xs font-semibold space-y-1 self-start min-w-[200px] ${darkMode ? 'bg-[#2D2D2D] border border-[#3D3D3D] text-gray-400' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}>
                  <div className="flex justify-between"><span className={darkMode ? 'text-gray-500' : 'text-slate-400'}>Dept:</span> <span className={darkMode ? 'text-gray-300' : 'text-slate-800'}>{data.filtersApplied.department}</span></div>
                  <div className="flex justify-between"><span className={darkMode ? 'text-gray-500' : 'text-slate-400'}>Company:</span> <span className={darkMode ? 'text-gray-300' : 'text-slate-800'}>{data.filtersApplied.company}</span></div>
                  <div className="flex justify-between"><span className={darkMode ? 'text-gray-500' : 'text-slate-400'}>Batch:</span> <span className={darkMode ? 'text-gray-300' : 'text-slate-800'}>{data.filtersApplied.batch}</span></div>
                </div>
              </div>

              {/* 1. Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.summary).map(([key, value]) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  
                  // Pick icon
                  let StatIcon = Award;
                  if (key.toLowerCase().includes("rate") || key.toLowerCase().includes("ratio")) StatIcon = TrendingUp;
                  if (key.toLowerCase().includes("salary") || key.toLowerCase().includes("package") || key.toLowerCase().includes("offer")) StatIcon = DollarSign;
                  if (key.toLowerCase().includes("student") || key.toLowerCase().includes("registered") || key.toLowerCase().includes("seeker")) StatIcon = Users;

                  return (
                    <div key={key} className={`border p-4 rounded-2xl flex flex-col justify-between ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-slate-50/50 border-slate-100'}`}>
                      <div className={`flex items-center justify-between mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider">{formattedKey}</span>
                        <StatIcon className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                      </div>
                      <div className={`text-xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{value}</div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Visual Chart (SVG based) */}
              {data.chartData && (
                <div className={`p-5 rounded-2xl ${darkMode ? 'border border-[#3D3D3D] bg-[#2D2D2D]' : 'border border-slate-100 bg-slate-50/20'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Performance Distribution Chart</h4>
                  
                  {/* Custom Responsive SVG Chart */}
                  <div className={`h-44 w-full flex items-end justify-between px-4 pb-2 border-b border-l ${darkMode ? 'border-[#3D3D3D]' : 'border-slate-200'}`}>
                    {data.chartData.map((item, idx) => {
                      // Normalize heights
                      const maxVal = Math.max(...data.chartData.map(c => c.rate || c.count || c.offers || c.avg || c.selections || 1));
                      const currVal = item.rate || item.count || item.offers || item.avg || item.selections || 0;
                      const pct = Math.max(10, Math.round((currVal / maxVal) * 100));

                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 group">
                          {/* Value tooltip */}
                          <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold px-1.5 py-0.5 rounded -translate-y-1 ${darkMode ? 'bg-gray-700' : 'bg-slate-800'}`}>
                            {currVal}{item.rate ? "%" : ""}
                          </span>
                          
                          {/* Column Bar */}
                          <div 
                            style={{ height: `${pct * 1.2}px` }} 
                            className={`w-12 ${barColors[idx % barColors.length]} rounded-t-xl transition-all duration-200 shadow-md`}></div>
                          
                          {/* Label */}
                          <span className={`text-[10px] font-bold mt-2 text-center truncate w-full max-w-[60px] sm:max-w-none ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Records Table */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Detail Records ({data.records.length} items parsed)</h4>
                
                <div className={`overflow-x-auto rounded-xl ${darkMode ? 'border border-[#3D3D3D]' : 'border border-slate-100'}`}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`font-bold border-b ${darkMode ? 'bg-[#1A1A1A] text-gray-400 border-[#3D3D3D]' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {Object.keys(data.records[0] || {}).map((colName) => (
                          <th key={colName} className="p-3 capitalize">
                            {colName.replace(/([A-Z])/g, " $1")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-[#3D3D3D]' : 'divide-slate-100'}`}>
                      {data.records.map((row, rIdx) => (
                        <tr key={rIdx} className={`font-medium ${darkMode ? 'hover:bg-[#1A1A1A]/50 text-gray-300' : 'hover:bg-slate-50/50 text-slate-700'}`}>
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-3">
                              {typeof val === "string" && val.includes("LPA") ? (
                                <strong className={darkMode ? 'text-white' : 'text-slate-800'}>{val}</strong>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Terms Warning */}
              <div className={`flex items-center space-x-2.5 p-4 rounded-xl text-xs leading-relaxed ${darkMode ? 'bg-orange-900/20 border border-orange-800/30 text-orange-300' : 'bg-orange-50 border border-orange-100 text-orange-800'}`}>
                <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <strong>Audit Protection Active:</strong> This preview matches compilation standards as of the generation date. If parameters are updated, a new report should be generated rather than downloading stale cache.
                </div>
              </div>
            </>
          ) : (
            <div className={`py-12 text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No preview active.</div>
          )}
        </div>

        {/* Footer Actions (No-Print) */}
        {data && (
          <div className={`flex flex-col sm:flex-row justify-between items-center p-5 no-print gap-3 ${darkMode ? 'border-t border-[#3D3D3D] bg-[#1A1A1A]' : 'border-t border-slate-200 bg-white'}`}>
            <button
              onClick={() => window.print()}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4.5 py-2 text-xs font-semibold rounded-xl transition duration-150 active:scale-97 cursor-pointer ${darkMode ? 'border border-[#3D3D3D] text-gray-300 hover:text-white hover:bg-[#2D2D2D]' : 'border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview Document</span>
            </button>
            
            <div className="flex w-full sm:w-auto justify-end gap-2">
              <ExportPDFButton 
                onClick={() => onExportPDF(data)} 
                isExporting={exportingId === data.id}
                darkMode={darkMode}
              />
              <ExportExcelButton 
                onClick={() => onExportExcel(data)} 
                isExporting={exportingId === data.id}
                darkMode={darkMode}
              />
              <ExportCSVButton 
                onClick={() => onExportCSV(data)} 
                isExporting={exportingId === data.id}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportPreview;
