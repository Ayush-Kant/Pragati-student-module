import { useNavigate } from 'react-router-dom';
import { Plus, SlidersHorizontal } from 'lucide-react';
import useQuestionBank from '../hooks/useQuestionBank';
import QuestionStatsCards from '../components/questionBank/QuestionStatsCards';
import QuestionTable from '../components/questionBank/QuestionTable';
import QuestionSearch from '../components/questionBank/QuestionSearch';
import QuestionFilters from '../components/questionBank/QuestionFilters';
import QuestionBulkActions from '../components/questionBank/QuestionBulkActions';
import QuestionPagination from '../components/questionBank/QuestionPagination';
import QuestionEmptyState from '../components/questionBank/QuestionEmptyState';

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const {
    questions, stats, loading, tags,
    filters, pagination, selectedIds,
    handleSearch, updateFilter, resetFilters, goToPage,
    toggleSelect, toggleSelectAll, clearSelection,
    deleteQuestion, deleteSelected
  } = useQuestionBank();

  const handleAddQuestion = () => {
    navigate('/mentor/question-bank/create');
  };

  const handleGenerateQuiz = () => {
    navigate('/mentor/question-bank/quiz-builder');
  };

  const handleView = (q) => {
    navigate(`/mentor/question-bank/preview/${q.id}`);
  };

  const handleEdit = (q) => {
    navigate(`/mentor/question-bank/edit/${q.id}`);
  };

  const hasActiveFilters = !!(filters.search || filters.type || filters.difficulty || filters.tags.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Question Bank
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
            Create, organize and reuse questions across assessments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleGenerateQuiz}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '8px',
              border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
              color: '#6B7280', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <SlidersHorizontal size={15} /> Generate Quiz
          </button>
          <button
            onClick={handleAddQuestion}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '8px',
              border: 'none', backgroundColor: '#2563EB',
              color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <Plus size={16} /> Add Question
          </button>
        </div>
      </div>

      <QuestionStatsCards stats={stats} />

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '16px',
        padding: '18px 20px', borderRadius: '12px', border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <QuestionSearch value={filters.search} onChange={handleSearch} />
          <QuestionFilters
            filters={filters}
            onUpdateFilter={updateFilter}
            onReset={resetFilters}
            tags={tags}
          />
        </div>
      </div>

      <QuestionBulkActions
        selectedCount={selectedIds.length}
        onDelete={deleteSelected}
        onClearSelection={clearSelection}
      />

      {!loading && questions.length === 0 ? (
        <div style={{
          background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB',
          padding: '40px',
        }}>
          <QuestionEmptyState onAddQuestion={handleAddQuestion} hasFilters={hasActiveFilters} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <QuestionTable
            questions={questions}
            loading={loading}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteQuestion}
          />
          <QuestionPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={filters.pageSize}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
