/**
 * RandomQuestionSelector — Configure random question selection with topic coverage & difficulty
 */
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AVAILABLE_TOPICS = ['React.js', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python', 'SQL', 'Data Structures', 'Algorithms'];

export default function RandomQuestionSelector({ config, onUpdate }) {
  const [newTopic, setNewTopic] = useState('');

  const topics = config.categoryDistribution ? Object.keys(config.categoryDistribution) : [];

  const addTopic = (topic) => {
    if (!topic || topics.includes(topic)) return;
    onUpdate('categoryDistribution', { ...config.categoryDistribution, [topic]: true });
    setNewTopic('');
  };

  const removeTopic = (topic) => {
    const updated = { ...config.categoryDistribution };
    delete updated[topic];
    onUpdate('categoryDistribution', updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Topics Coverage */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
          Topics Coverage (Skills)
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {topics.map(topic => (
            <span key={topic} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '8px',
              backgroundColor: '#EFF6FF', color: '#2563EB',
              fontSize: '13px', fontWeight: 500,
            }}>
              {topic}
              <button
                onClick={() => removeTopic(topic)}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
              >
                <X size={12} color="#2563EB" />
              </button>
            </span>
          ))}
          <div style={{ position: 'relative' }}>
            <select
              value=""
              onChange={e => { if (e.target.value) addTopic(e.target.value); }}
              style={{
                padding: '5px 12px', borderRadius: '8px',
                border: '1px dashed #E5E7EB', backgroundColor: '#FFFFFF',
                color: '#6B7280', fontSize: '13px', cursor: 'pointer',
              }}
            >
              <option value="">+ Add Topic</option>
              {AVAILABLE_TOPICS.filter(t => !topics.includes(t)).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Difficulty
        </label>
        <select
          value={
            config.difficultyDistribution?.Easy > 50 ? 'Easy' :
            config.difficultyDistribution?.Hard > 50 ? 'Hard' : 'Mixed (Adaptive)'
          }
          onChange={e => {
            const val = e.target.value;
            if (val === 'Easy') onUpdate('difficultyDistribution', { Easy: 70, Medium: 20, Hard: 10 });
            else if (val === 'Hard') onUpdate('difficultyDistribution', { Easy: 10, Medium: 20, Hard: 70 });
            else onUpdate('difficultyDistribution', { Easy: 30, Medium: 50, Hard: 20 });
          }}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
            outline: 'none', cursor: 'pointer', backgroundColor: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <option value="Mixed (Adaptive)">Mixed (Adaptive)</option>
          <option value="Easy">Easy</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Question Count */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Question Count
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min={1}
            max={100}
            value={config.totalQuestions}
            onChange={e => onUpdate('totalQuestions', parseInt(e.target.value))}
            style={{ flex: 1, accentColor: '#2563EB' }}
          />
          <span style={{
            minWidth: '36px', textAlign: 'center',
            padding: '4px 10px', borderRadius: '6px',
            backgroundColor: '#EFF6FF', color: '#2563EB',
            fontSize: '14px', fontWeight: 600,
          }}>
            {config.totalQuestions}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
          <span>1</span><span>50</span><span>100</span>
        </div>
      </div>

      {/* Randomization Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { key: 'shuffleQuestions', label: 'Randomize Questions' },
          { key: 'shuffleOptions', label: 'Randomize Options' },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>{label}</span>
            <button
              onClick={() => onUpdate(key, !config[key])}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                border: 'none', cursor: 'pointer',
                backgroundColor: config[key] ? '#2563EB' : '#D1D5DB',
                position: 'relative', transition: 'background-color 0.2s',
              }}
            >
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: '#FFFFFF', position: 'absolute',
                top: '3px', left: config[key] ? '23px' : '3px',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
