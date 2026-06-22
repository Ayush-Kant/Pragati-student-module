import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useActivityContext } from '../context/ActivityContext';
import ActivityTypePicker from '../components/activities/ActivityTypePicker';
import QuizConfigFields from '../components/activities/QuizConfigFields';
import CodingConfigFields from '../components/activities/CodingConfigFields';
import RubricBuilder from '../components/activities/RubricBuilder';
import LoadingOverlay from '../../../components/common/LoadingOverlay';

const CreateActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addActivity } = useActivityContext();
  const [activityType, setActivityType] = useState(location.state?.type || 'assignment');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    assignTo: '',
    assignDate: '',
    dueDate: '',
    instructions: '',
    enableDiscussion: true,
    allowFileSubmissions: true,
    addToCalendar: false,
    maxScore: 100,
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTypeSelect = (type) => {
    setActivityType(type);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e, status = 'pending') => {
    e.preventDefault();
    if (!formData.title || formData.title.length < 3) {
        toast.error('Title must be at least 3 characters.');
        return;
    }
    if (!formData.dueDate) {
        toast.error('Due date is required.');
        return;
    }

    // Validate dates are not in the past
    const now = new Date();
    const due = new Date(formData.dueDate);
    if (due.setHours(0,0,0,0) < new Date(todayStr).setHours(0,0,0,0)) {
      toast.error('Due date cannot be in the past.');
      return;
    }
    if (formData.maxScore < 1 || formData.maxScore > 100) {
        toast.error('Max score must be between 1 and 100.');
        return;
    }
    if (formData.assignDate) {
      const assign = new Date(formData.assignDate);
      if (assign.setHours(0,0,0,0) < new Date(todayStr).setHours(0,0,0,0)) {
        toast.error('Assign date cannot be in the past.');
        return;
      }
    }
    
    setIsSubmitting(true);
    // Add logic here to sum rubric to 100% or enforce quiz time limits depending on `activityType`
    
    await addActivity({
        ...formData,
        type: activityType,
        status: status,
    });
    
    setIsSubmitting(false);
    toast.success(`Activity ${status === 'draft' ? 'saved as draft' : 'created successfully'}!`);
    navigate('/mentor/activities');
  };

  const renderConditionalFields = () => {
    switch (activityType) {
      case 'quiz':
        return <QuizConfigFields />;
      case 'coding':
        return <CodingConfigFields />;
      case 'assignment':
      case 'case_study':
        return <RubricBuilder />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-wrap bg-gray-100 min-h-screen">
      {isSubmitting && <LoadingOverlay message="Creating activity..." />}
      <div className="w-full p-4 sm:p-6 lg:w-2/3">
        <Link to="/mentor/activities" className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900">
          &larr; Back to Activity
        </Link>
        <div className="p-8 bg-white rounded-lg shadow">
          {/* Section 1: Activity Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800">1. Activity Information</h2>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Activity Title*</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" placeholder="Enter activity title" />
              </div>
              <div>
                <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">Activity Type*</label>
                <input type="text" name="activityType" id="activityType" value={activityType} readOnly className="block w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              {/* Rich text editor placeholder */}
              <div className="p-3 mt-1 border border-gray-300 rounded-md h-36">
                <div className="flex space-x-2 border-b pb-2 mb-2">
                  <button type="button" className="text-sm font-medium">B</button>
                  <button type="button" className="text-sm font-medium">I</button>
                  <button type="button" className="text-sm font-medium">U</button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full border-0 resize-none focus:ring-0 focus:outline-none outline-none bg-transparent h-24 p-0"
                  placeholder="Enter a detailed description of the activity..."
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700">Max Score</label>
              <input type="number" name="maxScore" id="maxScore" value={formData.maxScore} onChange={handleInputChange} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" min="1" max="100" />
            </div>
            <div className="mt-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input type="text" name="tags" id="tags" value={formData.tags.join(', ')} onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value.split(',').map(t => t.trim())}))} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" placeholder="Add tags (e.g., SQL, Database, Basics)" />
            </div>
          </section>

          {/* Section 2: Assignment Details */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">2. Assignment Details</h2>
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-3">
              <div>
                  <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700">Assign To*</label>
                  <select id="assignTo" name="assignTo" value={formData.assignTo} onChange={handleInputChange} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm">
                  <option>Select mentees or groups</option>
                  <option value="all">All Mentees</option>
                  <option value="groupA">Group A</option>
                </select>
              </div>
              <div>
                <label htmlFor="assignDate" className="block text-sm font-medium text-gray-700">Assign Date</label>
                  <input type="date" name="assignDate" id="assignDate" value={formData.assignDate} onChange={handleInputChange} min={todayStr} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date*</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  id="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleInputChange} 
                    min={todayStr}
                  className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" 
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions to Mentees</label>
              <textarea id="instructions" name="instructions" rows="3" value={formData.instructions} onChange={handleInputChange} className="block w-full mt-1 border border-gray-300 px-3 py-2 rounded-md shadow-sm" placeholder="Provide clear instructions for completing this activity..."></textarea>
            </div>
          </section>

          {/* Conditional Fields based on Type */}
          <section className="mt-8">
            {renderConditionalFields()}
          </section>

          {/* Section 3: Additional Settings */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">3. Additional Settings</h2>
            <div className="flex flex-wrap items-center gap-8 mt-4">
              <div className="flex items-center">
                <input id="enableDiscussion" name="enableDiscussion" type="checkbox" checked={formData.enableDiscussion} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                <label htmlFor="enableDiscussion" className="ml-2 block text-sm text-gray-900">Enable Discussion</label>
              </div>
              <div className="flex items-center">
                <input id="allowFileSubmissions" name="allowFileSubmissions" type="checkbox" checked={formData.allowFileSubmissions} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                <label htmlFor="allowFileSubmissions" className="ml-2 block text-sm text-gray-900">Allow File Submissions</label>
              </div>
              <div className="flex items-center">
                <input id="addToCalendar" name="addToCalendar" type="checkbox" checked={formData.addToCalendar} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                <label htmlFor="addToCalendar" className="ml-2 block text-sm text-gray-900">Add to Calendar</label>
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <button type="button" onClick={() => navigate('/mentor/activities')} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50" disabled={isSubmitting}>Cancel</button>
            <button type="button" onClick={(e) => handleSubmit(e, 'draft')} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button type="submit" onClick={(e) => handleSubmit(e, 'published')} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full p-4 sm:p-6 lg:w-1/3">
        <div className="sticky top-6">
          <ActivityTypePicker onSelect={handleTypeSelect} selectedType={activityType} />
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-gray-800">Tips</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Be clear and specific in your instructions.</li>
              <li>Set a realistic due date for completion.</li>
              <li>Enable discussion to encourage collaboration.</li>
              <li>Add relevant tags to help organize activities.</li>
            </ul>
          </div>
          <div className="p-6 mt-6 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-gray-800">Preview</h3>
            <div className="flex items-center justify-center h-40 mt-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">Activity preview will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateActivity;
