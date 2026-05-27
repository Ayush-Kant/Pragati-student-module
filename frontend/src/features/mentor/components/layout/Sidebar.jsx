import React from 'react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', active: true, icon: '📊' },
    { name: 'My Mentees', active: false, icon: '👥' },
    { name: 'Sessions', active: false, icon: '📅' },
    { name: 'Assessments', active: false, icon: '📝' },
    { name: 'Tasks & Assignments', active: false, icon: '📋' },
    { name: 'Reports & Analytics', active: false, icon: '📉' },
    { name: 'Resources', active: false, icon: '📂' },
    { name: 'Settings', active: false, icon: '⚙️' }
  ];

  return (
    <div style={{ 
      width: '260px', 
      height: '100vh', 
      backgroundColor: '#ffffff', 
      borderRight: '1px solid #e2e8f0', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '24px 16px', 
      boxSizing: 'border-box',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* Brand Heading UPTOSKILLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '12px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#0ea5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: '800' }}>U</div>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>UPTOSKILLS</span>
      </div>

      {/* Menu Options Link Wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {menuItems.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: item.active ? '#f0f9ff' : 'transparent',
            color: item.active ? '#0284c7' : '#64748b',
            fontWeight: item.active ? '600' : '500',
            fontSize: '14px'
          }}>
            <span>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </div>

      {/* Help Owl Vector Container box */}
      <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
        <span style={{ fontSize: '22px' }}>🦉</span>
        <h4 style={{ margin: '4px 0 2px 0', fontSize: '13px', color: '#0f172a' }}>Need Help?</h4>
        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>Our Support Team is here!</p>
        <button style={{ width: '100%', padding: '8px', backgroundColor: '#0ea5e9', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Get Support</button>
      </div>
    </div>
  );
}