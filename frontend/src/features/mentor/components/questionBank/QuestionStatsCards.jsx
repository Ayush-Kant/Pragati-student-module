/**
 * QuestionStatsCards — Displays 4 stat cards: Total Questions, MCQs, Recently Added, Avg Difficulty
 */
import { BookOpen, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total Questions', icon: BookOpen, color: '#2563EB', bg: '#EFF6FF' },
  { key: 'mcqs', label: 'MCQs', icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' },
  { key: 'recentlyAdded', label: 'Recently Added', icon: Clock, color: '#F97316', bg: '#FFF7ED' },
  { key: 'avgDifficulty', label: 'Avg. Difficulty', icon: BarChart3, color: '#8B5CF6', bg: '#F5F3FF' },
];

const subtextMap = { recentlyAdded: 'this wk' };

export default function QuestionStatsCards({ stats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'box-shadow 0.2s, transform 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color={color} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                {key === 'avgDifficulty' ? stats[key] : (stats[key] ?? 0).toLocaleString()}
              </span>
              {subtextMap[key] && (
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{subtextMap[key]}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
