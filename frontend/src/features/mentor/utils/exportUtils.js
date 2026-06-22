/**
 * Export Utilities for Mentor Activity Data
 * Supports Excel, PDF, and CSV export formats
 */

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// CSV Export Function
export const exportToCSV = (data, filename = 'export.csv') => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, filename, 'text/csv');
};

// Excel Export Function (Uses XLSX library for professional .xlsx files)
export const exportToExcel = (data, filename = 'export.xlsx') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to sheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    const columnWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.min(30, Math.max(12, key.length + 2))
    }));
    worksheet['!cols'] = columnWidths;
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Generate the Excel file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    // Fallback to CSV if XLSX fails
    exportToCSV(data, filename.replace('.xlsx', '.csv'));
  }
};

// PDF Export Function (Generates a real PDF file)
export const exportToPDF = async (data, filename = 'export.pdf', title = 'Activity Report') => {
  try {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.background = '#fff';
    container.style.padding = '24px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#111827';
    container.innerHTML = `
      <h1 style="color:#0f172a; border-bottom:2px solid #0284c7; padding-bottom:10px; margin:0 0 8px 0;">${title}</h1>
      <div style="color:#64748b; font-size:12px; margin-bottom:16px;">Generated on: ${new Date().toLocaleString()}</div>
      ${convertToHTML(data)}
      <div style="margin-top:20px; padding:12px; background:#f0f9ff; border-left:4px solid #0284c7; font-weight:600;">Total Records: ${data.length}</div>
    `;

    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 40;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 20;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 40;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF file:', error);
    throw error;
  }
};

// Helper function to convert data to CSV format
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.map(h => `"${h}"`).join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header] || '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];
  
  return csv.join('\n');
};

// Helper function to convert data to HTML table
const convertToHTML = (data) => {
  if (!data || data.length === 0) return '<p>No data available</p>';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
  );
  
  return `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `;
};

// Helper function to download file
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
};

// Helper function to download blob
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Format activity data for export
export const formatActivityDataForExport = (activities) => {
  return activities.map(activity => ({
    'Date': new Date(activity.date).toLocaleDateString(),
    'Type': activity.type,
    'Title': activity.title,
    'Student Name': activity.studentName,
    'Status': activity.status,
    'Score': activity.score !== undefined ? activity.score : 'N/A',
    'Duration': activity.duration ? `${activity.duration} mins` : 'N/A',
    'Description': activity.description || ''
  }));
};

// Format assignments data for export
export const formatAssignmentsForExport = (assignments) => {
  return assignments.map(assignment => ({
    'Title': assignment.title,
    'Description': assignment.description || '',
    'Assigned Date': new Date(assignment.assignedDate).toLocaleDateString(),
    'Due Date': new Date(assignment.dueDate).toLocaleDateString(),
    'Status': assignment.status,
    'Submissions': assignment.submissions || 0,
    'Average Score': assignment.averageScore || 'N/A'
  }));
};

// Format quizzes data for export
export const formatQuizzesForExport = (quizzes) => {
  return quizzes.map(quiz => ({
    'Quiz Name': quiz.name,
    'Total Questions': quiz.totalQuestions || 0,
    'Pass Percentage': quiz.passPercentage || '0%',
    'Attempts': quiz.attempts || 0,
    'Average Score': quiz.averageScore || 'N/A',
    'Status': quiz.status
  }));
};

// Format tasks data for export
export const formatTasksForExport = (tasks) => {
  return tasks.map(task => ({
    'Task Name': task.name,
    'Category': task.category || 'General',
    'Priority': task.priority || 'Normal',
    'Assigned To': task.assignedTo || '',
    'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
    'Status': task.status,
    'Completion': task.completion ? `${task.completion}%` : '0%'
  }));
};
