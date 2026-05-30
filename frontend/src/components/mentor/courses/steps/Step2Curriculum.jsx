import React, { useState } from 'react';
import CurriculumOverview from '../curriculum/CurriculumOverview';
import SectionBlock from '../curriculum/SectionBlock';
import AddSectionButton from '../curriculum/AddSectionButton';
import ReorderSectionsModal from '../curriculum/ReorderSectionsModal';

export default function Step2Curriculum({ courseData, onUpdate, onNext, onBack }) {
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Initialize modular curriculum structure state if empty
  const modules = courseData.modules || [
    {
      id: 'sec-1',
      title: 'Section 1: Introduction',
      status: 'Published',
      duration: '25m',
      lectures: [
        { id: 'lec-1', title: '1.1 Welcome to the Course', type: 'Video', duration: '08:15', status: 'Published' },
        { id: 'lec-2', title: '1.2 Course Overview', type: 'Article', duration: '05:20', status: 'Published' },
        { id: 'lec-3', title: '1.3 What You Will Learn', type: 'Quiz', duration: '12:00', status: 'Published' }
      ]
    }
  ];

  const handleUpdateModules = (updatedModules) => {
    onUpdate({ modules: updatedModules });
  };

  const handleAddSection = () => {
    const newSectionNum = modules.length + 1;
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `Section ${newSectionNum}: New Section Title`,
      status: 'Draft',
      duration: '00m',
      lectures: []
    };
    handleUpdateModules([...modules, newSection]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Overview Panel Component */}
      <div className="space-y-4">
        <CurriculumOverview modules={modules} />
      </div>

      {/* Right Canvas Main Builder Panel Container */}
      <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-md font-bold text-gray-800">Course Curriculum</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add sections and lectures to build your course structure.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsReorderModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              Reorder Sections
            </button>
            <AddSectionButton onClick={handleAddSection} />
          </div>
        </div>

        {/* Dynamic Section Mapping Blocks */}
        <div className="space-y-4">
          {modules.map((section, index) => (
            <SectionBlock 
              key={section.id} 
              section={section} 
              index={index}
              modules={modules}
              onUpdateModules={handleUpdateModules}
            />
          ))}
        </div>
      </div>

      {/* Persistent Steps Multi-Navigation Control Footer Bar */}
      <div className="col-span-1 lg:col-span-4 bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center mt-6">
        <button 
          onClick={onBack} 
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors"
        >
          ← Back: Basic Information
        </button>
        <button 
          onClick={onNext} 
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Next: Pricing →
        </button>
      </div>

      {/* Modals Injections Portal */}
      {isReorderModalOpen && (
        <ReorderSectionsModal 
          modules={modules} 
          onClose={() => setIsReorderModalOpen(false)} 
          onSave={handleUpdateModules}
        />
      )}
    </div>
  );
}