import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './../styles/global-search.css';

// ─── Mock Data Aggregator ────────────────────────────────────────────────────

const getSearchableData = () => {
  // Candidates data
  const candidates = [
    { id: 1, name: 'Rahul Patil', college: 'IIT Bombay', role: 'Software Engineer', type: 'Candidate' },
    { id: 2, name: 'Sneha Reddy', college: 'NIT Hyderabad', role: 'Data Analyst', type: 'Candidate' },
    { id: 3, name: 'Amit Kumar', college: 'Delhi University', role: 'Product Manager', type: 'Candidate' },
    { id: 4, name: 'Priya Sharma', college: 'IIT Delhi', role: 'Backend Developer', type: 'Candidate' },
    { id: 5, name: 'Ravi Patel', college: 'NIT Surat', role: 'DevOps Engineer', type: 'Candidate' },
    { id: 6, name: 'Meera Iyer', college: 'IIT Madras', role: 'Frontend Developer', type: 'Candidate' },
    { id: 7, name: 'Vikram Singh', college: 'BITS Pilani', role: 'Full Stack Developer', type: 'Candidate' },
    { id: 8, name: 'Anjali Desai', college: 'VIT Vellore', role: 'QA Engineer', type: 'Candidate' },
  ];

  // Drives data
  const drives = [
    { id: 1, driveName: 'Software Engineer - 2026', role: 'Software Engineer', type: 'Drive' },
    { id: 2, driveName: 'Data Analyst Drive', role: 'Data Analyst', type: 'Drive' },
    { id: 3, driveName: 'Product Manager Hiring', role: 'Product Manager', type: 'Drive' },
    { id: 4, driveName: 'UI/UX Designer - Campus', role: 'UI/UX Designer', type: 'Drive' },
    { id: 5, driveName: 'DevOps Engineer', role: 'DevOps Engineer', type: 'Drive' },
  ];

  // Assessments data
  const assessments = [
    { id: 1, title: 'React Developer Assessment', type: 'Technical', assessmentType: 'Assessment' },
    { id: 2, title: 'Data Structures & Algorithms', type: 'Technical', assessmentType: 'Assessment' },
    { id: 3, title: 'System Design Round', type: 'Technical', assessmentType: 'Assessment' },
    { id: 4, title: 'Product Aptitude Test', type: 'Aptitude', assessmentType: 'Assessment' },
    { id: 5, title: 'UI/UX Design Challenge', type: 'Design', assessmentType: 'Assessment' },
  ];

  // Interviews data
  const interviews = [
    { id: 1, candidate: 'Rahul Patil', interviewer: 'Priya Sharma', round: 'Technical Round 1', type: 'Interview' },
    { id: 2, candidate: 'Sneha Reddy', interviewer: 'Vikram Singh', round: 'Technical Round 2', type: 'Interview' },
    { id: 3, candidate: 'Amit Kumar', interviewer: 'Anjali Desai', round: 'HR Round', type: 'Interview' },
    { id: 4, candidate: 'Priya Sharma', interviewer: 'Meera Iyer', round: 'Technical Round 1', type: 'Interview' },
    { id: 5, candidate: 'Ravi Patel', interviewer: 'Priya Sharma', round: 'Final Round', type: 'Interview' },
  ];

  // Offers data
  const offers = [
    { id: 1, name: 'Rahul Patil', role: 'Senior Software Engineer', type: 'Offer' },
    { id: 2, name: 'Sneha Reddy', role: 'UI/UX Designer', type: 'Offer' },
    { id: 3, name: 'Amit Kumar', role: 'Product Manager', type: 'Offer' },
    { id: 4, name: 'Priya Sharma', role: 'Data Analyst', type: 'Offer' },
    { id: 5, name: 'Ravi Verma', role: 'DevOps Engineer', type: 'Offer' },
  ];

  // Training data
  const training = [
    { id: 1, program: 'Full Stack Development Bootcamp', mentor: 'Priya Sharma', type: 'Training' },
    { id: 2, program: 'Data Science Fundamentals', mentor: 'Vikram Singh', type: 'Training' },
    { id: 3, program: 'Product Management Workshop', mentor: 'Anjali Desai', type: 'Training' },
    { id: 4, program: 'UI/UX Design Sprint', mentor: 'Meera Iyer', type: 'Training' },
    { id: 5, program: 'Cloud & DevOps Training', mentor: 'Ravi Patel', type: 'Training' },
  ];

  return {
    candidates,
    drives,
    assessments,
    interviews,
    offers,
    training,
  };
};

// ─── Search Filter Logic ─────────────────────────────────────────────────────

const performSearch = (query) => {
  if (!query.trim()) return {};

  const data = getSearchableData();
  const lowerQuery = query.toLowerCase();
  const results = {};

  // Search Candidates
  const matchedCandidates = data.candidates.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.college.toLowerCase().includes(lowerQuery) ||
    c.role.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedCandidates.length > 0) {
    results.Candidates = matchedCandidates.map(c => ({
      ...c,
      displayName: c.name,
      displaySubtitle: `${c.college} • ${c.role}`,
      page: 'candidates',
    }));
  }

  // Search Drives
  const matchedDrives = data.drives.filter(d =>
    d.driveName.toLowerCase().includes(lowerQuery) ||
    d.role.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedDrives.length > 0) {
    results.Drives = matchedDrives.map(d => ({
      ...d,
      displayName: d.driveName,
      displaySubtitle: d.role,
      page: 'drives',
    }));
  }

  // Search Assessments
  const matchedAssessments = data.assessments.filter(a =>
    a.title.toLowerCase().includes(lowerQuery) ||
    a.type.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedAssessments.length > 0) {
    results.Assessments = matchedAssessments.map(a => ({
      ...a,
      displayName: a.title,
      displaySubtitle: a.type,
      page: 'assessments',
    }));
  }

  // Search Interviews
  const matchedInterviews = data.interviews.filter(i =>
    i.candidate.toLowerCase().includes(lowerQuery) ||
    i.interviewer.toLowerCase().includes(lowerQuery) ||
    i.round.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedInterviews.length > 0) {
    results.Interviews = matchedInterviews.map(i => ({
      ...i,
      displayName: i.candidate,
      displaySubtitle: `${i.round} • with ${i.interviewer}`,
      page: 'interviews',
    }));
  }

  // Search Offers
  const matchedOffers = data.offers.filter(o =>
    o.name.toLowerCase().includes(lowerQuery) ||
    o.role.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedOffers.length > 0) {
    results.Offers = matchedOffers.map(o => ({
      ...o,
      displayName: o.name,
      displaySubtitle: o.role,
      page: 'offers',
    }));
  }

  // Search Training
  const matchedTraining = data.training.filter(t =>
    t.program.toLowerCase().includes(lowerQuery) ||
    t.mentor.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  if (matchedTraining.length > 0) {
    results.Training = matchedTraining.map(t => ({
      ...t,
      displayName: t.program,
      displaySubtitle: `Mentor: ${t.mentor}`,
      page: 'training',
    }));
  }

  return results;
};

// ─── Global Search Component ─────────────────────────────────────────────────

export const GlobalSearch = ({ isOpen, onClose, onKeyDown }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults({});
      setSelectedSection(null);
      return;
    }

    const searchResults = performSearch(query);
    setResults(searchResults);
    setSelectedSection(null);
    setSelectedIndex(0);
  }, [query]);

  // Build flat list of all results for keyboard navigation
  const getAllResults = () => {
    const flat = [];
    Object.entries(results).forEach(([section, items]) => {
      items.forEach((item, idx) => {
        flat.push({ section, item, index: idx });
      });
    });
    return flat;
  };

  const allResults = getAllResults();

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const sections = Object.keys(results);

    if (!query) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (allResults.length === 0) return;

        if (selectedSection === null) {
          setSelectedSection(sections[0]);
          setSelectedIndex(0);
        } else {
          const currentIdx = allResults.findIndex(
            r => r.section === selectedSection && r.index === selectedIndex
          );
          if (currentIdx < allResults.length - 1) {
            const next = allResults[currentIdx + 1];
            setSelectedSection(next.section);
            setSelectedIndex(next.index);
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (allResults.length === 0) return;

        if (selectedSection === null) {
          const last = allResults[allResults.length - 1];
          setSelectedSection(last.section);
          setSelectedIndex(last.index);
        } else {
          const currentIdx = allResults.findIndex(
            r => r.section === selectedSection && r.index === selectedIndex
          );
          if (currentIdx > 0) {
            const prev = allResults[currentIdx - 1];
            setSelectedSection(prev.section);
            setSelectedIndex(prev.index);
          }
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedSection && selectedIndex !== null) {
          handleResultClick(results[selectedSection][selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        onClose();
        break;

      default:
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result) => {
    const pageRoutes = {
      Candidates: '/candidates',
      Drives: '/drives',
      Assessments: '/assessments',
      Interviews: '/interviews',
      Offers: '/offers',
      Training: '/training',
    };

    const sections = Object.keys(results);
    const section = sections.find(s => results[s].includes(result));

    if (section && pageRoutes[section]) {
      navigate(pageRoutes[section]);
      setQuery('');
      onClose();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (inputRef.current && !inputRef.current.contains(e.target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults = Object.keys(results).length > 0;

  return (
    <>
      {/* Overlay */}
      <div className="global-search-overlay" onClick={onClose} />

      {/* Dropdown */}
      <div className="global-search-dropdown" ref={dropdownRef}>
        {!hasResults && query.trim() && (
          <div className="search-no-results">
            <FiSearch size={20} className="search-no-results-icon" />
            <p>No results found for "{query}"</p>
          </div>
        )}

        {hasResults && (
          <div className="search-results-container">
            {Object.entries(results).map(([section, items]) => (
              <div key={section} className="search-section">
                <div className="search-section-header">{section}</div>
                <div className="search-section-items">
                  {items.map((item, idx) => (
                    <button
                      key={`${section}-${idx}`}
                      className={`search-result-item ${
                        selectedSection === section && selectedIndex === idx
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => handleResultClick(item)}
                      onMouseEnter={() => {
                        setSelectedSection(section);
                        setSelectedIndex(idx);
                      }}
                    >
                      <div className="search-result-content">
                        <div className="search-result-name">{item.displayName}</div>
                        <div className="search-result-subtitle">{item.displaySubtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {query === '' && (
          <div className="search-empty-state">
            <FiSearch size={24} className="search-empty-icon" />
            <p className="search-empty-text">Start typing to search across all modules</p>
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalSearch;
