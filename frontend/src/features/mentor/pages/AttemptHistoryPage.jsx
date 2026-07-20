import { ArrowLeft, Search, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAttempts from '../hooks/useAttempts';
import AttemptHistoryTable from '../components/attemptHistory/AttemptHistoryTable';
import AttemptDetailsDrawer from '../components/attemptHistory/AttemptDetailsDrawer';

export default function AttemptHistoryPage() {
  const navigate = useNavigate();
  const {
    attempts, loading, filters, pagination,
    selectedAttempt, drawerOpen,
    updateFilter, searchAttempts, goToPage,
    openDrawer, closeDrawer,
  } = useAttempts();

  const handleResetFilters = () => {
    updateFilter('status', '');
    searchAttempts('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <button
          onClick={() => navigate('/mentor/question-bank')}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          <ArrowLeft size={18} color="#6B7280" />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Attempt History
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '2px 0 0 0' }}>
            View and analyze student scores and individual responses.
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
        padding: '16px 20px', borderRadius: '12px', border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '360px' }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by student name or quiz..."
            value={filters.search}
            onChange={e => searchAttempts(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 36px', borderRadius: '8px',
              border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
              outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        <select
          value={filters.status}
          onChange={e => updateFilter('status', e.target.value)}
          style={{
            padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB',
            fontSize: '14px', color: '#111827', cursor: 'pointer', outline: 'none',
            backgroundColor: '#FFFFFF', minWidth: '150px',
          }}
        >
          <option value="">All Statuses</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="in-progress">In Progress</option>
        </select>

        {(filters.search || filters.status) && (
          <button
            onClick={handleResetFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '10px 14px', border: 'none', background: 'none',
              color: '#6B7280', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
            }}
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        )}
      </div>

      <AttemptHistoryTable
        attempts={attempts}
        loading={loading}
        onRowClick={openDrawer}
      />

      <AttemptDetailsDrawer
        isOpen={drawerOpen}
        attempt={selectedAttempt}
        onClose={closeDrawer}
      />
    </div>
  );
}
