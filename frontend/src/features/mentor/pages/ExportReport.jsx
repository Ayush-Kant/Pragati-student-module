import React, { useState } from 'react';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  formatActivityDataForExport,
  formatAssignmentsForExport,
  formatQuizzesForExport,
  formatTasksForExport
} from '../utils/exportUtils';
import {
  BarChart3,
  ListTodo,
  FileText,
  HelpCircle,
  Download,
  Lightbulb,
  Zap,
  Lock,
  Smartphone,
  Loader,
  Sheet,
  File,
  Database
} from 'lucide-react';

const ExportReport = () => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedDataType, setSelectedDataType] = useState('activities');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  // Mock data - In production, this would come from API
  const mockActivities = [
    { date: '2026-05-15', type: 'Assignment', title: 'UI Design Task', studentName: 'Riya Sharma', status: 'Completed', score: 95, duration: 120, description: 'Completed UI design assignment' },
    { date: '2026-05-16', type: 'Quiz', title: 'JavaScript Basics', studentName: 'Anjali Verma', status: 'Completed', score: 88, duration: 45, description: 'JavaScript quiz' },
    { date: '2026-05-17', type: 'Practice', title: 'Coding Challenge', studentName: 'Neha Patel', status: 'In Progress', duration: 90, description: 'Coding practice session' },
    { date: '2026-05-18', type: 'Assignment', title: 'Project Submission', studentName: 'Karan Singh', status: 'Pending', description: 'Project submission pending' },
    { date: '2026-05-19', type: 'Session', title: 'Career Guidance', studentName: 'Riya Sharma', status: 'Completed', duration: 60, description: 'Career guidance session' },
  ];

  const mockAssignments = [
    { title: 'Web Development Project', description: 'Build a responsive website', assignedDate: '2026-05-01', dueDate: '2026-05-15', status: 'Completed', submissions: 45, averageScore: 87 },
    { title: 'Mobile App Design', description: 'Design a mobile app UI', assignedDate: '2026-05-05', dueDate: '2026-05-20', status: 'In Progress', submissions: 38, averageScore: 82 },
    { title: 'Database Design', description: 'Design database schema', assignedDate: '2026-05-10', dueDate: '2026-05-25', status: 'In Progress', submissions: 20, averageScore: 85 },
  ];

  const mockQuizzes = [
    { name: 'JavaScript Fundamentals', totalQuestions: 20, passPercentage: '80%', attempts: 150, averageScore: 82, status: 'Active' },
    { name: 'React Basics', totalQuestions: 25, passPercentage: '75%', attempts: 120, averageScore: 78, status: 'Active' },
    { name: 'CSS Advanced', totalQuestions: 15, passPercentage: '85%', attempts: 100, averageScore: 88, status: 'Completed' },
  ];

  const mockTasks = [
    { name: 'Review Student Projects', category: 'Review', priority: 'High', assignedTo: 'Team', dueDate: '2026-05-20', status: 'In Progress', completion: 60 },
    { name: 'Update Course Content', category: 'Content', priority: 'Medium', assignedTo: 'Content Team', dueDate: '2026-05-25', status: 'Pending', completion: 30 },
    { name: 'Prepare Assessment', category: 'Assessment', priority: 'High', assignedTo: 'Team', dueDate: '2026-05-22', status: 'In Progress', completion: 80 },
  ];

  const getFilteredData = () => {
    let data = [];
    let formattedData = [];

    switch (selectedDataType) {
      case 'activities':
        data = mockActivities;
        formattedData = formatActivityDataForExport(data);
        break;
      case 'assignments':
        data = mockAssignments;
        formattedData = formatAssignmentsForExport(data);
        break;
      case 'quizzes':
        data = mockQuizzes;
        formattedData = formatQuizzesForExport(data);
        break;
      case 'tasks':
        data = mockTasks;
        formattedData = formatTasksForExport(data);
        break;
      default:
        formattedData = [];
    }

    return formattedData;
  };

  const handleExport = async () => {
    setIsLoading(true);
    setExportStatus('');

    try {
      const data = getFilteredData();

      if (data.length === 0) {
        setExportStatus('No data to export');
        setIsLoading(false);
        return;
      }

      const timestamp = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
      const filename = `${selectedDataType}_report_${timestamp}`;

      if (selectedFormat === 'csv') {
        exportToCSV(data, `${filename}.csv`);
      } else if (selectedFormat === 'pdf') {
        await exportToPDF(data, `${filename}.pdf`, `${selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1)} Report`);
      } else {
        exportToExcel(data, `${filename}.xlsx`);
      }

      setExportStatus(`✅ Successfully exported ${selectedDataType} as ${selectedFormat.toUpperCase()}`);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus(`❌ Export failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <BarChart3 size={32} color="#0284c7" />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              Export Activity Report
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Export your mentoring activities, assignments, quizzes, and tasks in your preferred format
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Column - Configuration */}
          <div>
            {/* Data Type Selection */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                Select Data Type
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { value: 'activities', label: 'Activities & Sessions', desc: 'All mentoring activities and sessions', icon: BarChart3 },
                  { value: 'assignments', label: 'Assignments', desc: 'Assignment details and submissions', icon: FileText },
                  { value: 'quizzes', label: 'Quizzes', desc: 'Quiz performance data', icon: HelpCircle },
                  { value: 'tasks', label: 'Tasks', desc: 'Task management data', icon: ListTodo }
                ].map(option => {
                  const IconComponent = option.icon;
                  return (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedDataType === option.value ? '#f0f9ff' : '#ffffff',
                      border: selectedDataType === option.value ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      transition: 'all 0.2s',
                      gap: '12px'
                    }}>
                      <input
                        type="radio"
                        name="dataType"
                        value={option.value}
                        checked={selectedDataType === option.value}
                        onChange={(e) => setSelectedDataType(e.target.value)}
                        style={{ marginRight: '0px', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <IconComponent size={20} color={selectedDataType === option.value ? '#0284c7' : '#64748b'} />
                      <div>
                        <div style={{ fontWeight: '500', color: '#0f172a' }}>{option.label}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{option.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Export Format Selection */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                Export Format
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'excel', label: 'Excel', icon: Sheet },
                  { value: 'pdf', label: 'PDF', icon: File },
                  { value: 'csv', label: 'CSV', icon: Database }
                ].map(format => {
                  const IconComponent = format.icon;
                  return (
                    <button
                      key={format.value}
                      onClick={() => setSelectedFormat(format.value)}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: selectedFormat === format.value ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: selectedFormat === format.value ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        fontWeight: selectedFormat === format.value ? '600' : '500',
                        color: selectedFormat === format.value ? '#0284c7' : '#64748b',
                        fontSize: '14px',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <IconComponent size={24} color={selectedFormat === format.value ? '#0284c7' : '#94a3b8'} />
                      {format.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Export */}
          <div>
            {/* Data Preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                Preview
              </h2>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#64748b'
              }}>
                {getFilteredData().length > 0 ? (
                  <div>
                    <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
                      Total Records: {getFilteredData().length}
                    </div>
                    {getFilteredData().slice(0, 3).map((row, idx) => (
                      <div key={idx} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                        {Object.entries(row).map(([key, value]) => (
                          <div key={key} style={{ fontSize: '11px', lineHeight: '1.4' }}>
                            <strong>{key}:</strong> {String(value).substring(0, 40)}
                          </div>
                        ))}
                      </div>
                    ))}
                    {getFilteredData().length > 3 && (
                      <div style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic', marginTop: '8px' }}>
                        ... and {getFilteredData().length - 3} more records
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8' }}>No data available</div>
                )}
              </div>
            </div>

            {/* Export Status & Button */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              {exportStatus && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  backgroundColor: exportStatus.includes('✅') ? '#f0fdf4' : '#fef2f2',
                  color: exportStatus.includes('✅') ? '#166534' : '#991b1b',
                  fontSize: '13px',
                  border: exportStatus.includes('✅') ? '1px solid #86efac' : '1px solid #fca5a5'
                }}>
                  {exportStatus}
                </div>
              )}
              <button
                onClick={handleExport}
                disabled={isLoading || getFilteredData().length === 0}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isLoading || getFilteredData().length === 0 ? '#cbd5e1' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: isLoading || getFilteredData().length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} color="#ffffff" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Export as {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '12px', marginBottom: 0 }}>
                <Lightbulb size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0 }}>
                  The report will be downloaded to your computer in {selectedFormat.toUpperCase()} format
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: Zap, title: 'Instant Export', desc: 'Export large datasets instantly', color: '#f59e0b' },
            { icon: Lock, title: 'Secure', desc: 'Your data is processed locally', color: '#10b981' },
            { icon: Smartphone, title: 'Format Flexible', desc: 'Excel, PDF, or CSV formats', color: '#6366f1' }
          ].map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div key={idx} style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  <IconComponent size={32} color={card.color} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExportReport;
