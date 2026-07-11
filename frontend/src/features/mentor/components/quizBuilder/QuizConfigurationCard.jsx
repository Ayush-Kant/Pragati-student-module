/**
 * QuizConfigurationCard — General quiz settings (name, description)
 */
export default function QuizConfigurationCard({ config, onUpdate }) {
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #E5E7EB', fontSize: '14px', color: '#111827',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{
      padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>
        Quiz Parameters
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Target Assessment
          </label>
          <select
            value={config.name}
            onChange={e => onUpdate('name', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
          >
            <option value="">Select an assessment...</option>
            <option value="Midterm Evaluation - Fall 2024">Midterm Evaluation - Fall 2024</option>
            <option value="Final Exam - Fall 2024">Final Exam - Fall 2024</option>
            <option value="Weekly Quiz 1">Weekly Quiz 1</option>
            <option value="Practice Test">Practice Test</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Description
          </label>
          <textarea
            value={config.description}
            onChange={e => onUpdate('description', e.target.value)}
            placeholder="Describe this quiz..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>
    </div>
  );
}
