import React, { useState } from 'react';

const NotificationDropdown = ({ notifications, isLoading, error, onMarkAsRead }) => {
  const [showAll, setShowAll] = useState(false);

  const renderIcon = (type) => {
    switch (type) {
      case 'request':
        return (
          <div style={{ ...styles.iconBase, backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
        );
      case 'success':
        return (
          <div style={{ ...styles.iconBase, backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 15 11 17 15 13"></polyline>
            </svg>
          </div>
        );
      case 'alert':
        return (
          <div style={{ ...styles.iconBase, backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        );
      default:
        return <div style={{ ...styles.iconBase, backgroundColor: '#f1f5f9' }}></div>;
    }
  };

  const displayedNotifications = showAll ? notifications : notifications?.slice(0, 3);
  const hasMoreNotifications = notifications?.length > 3;

  return (
    <div style={styles.dropdownWrapper}>
      <div style={styles.caretArrow}></div>

      <div style={styles.dropdownPanel}>
        <div style={styles.header}>Notifications</div>
        
        <div style={styles.listContainer}>
          {isLoading && (
            <div style={styles.padding}>
              <div style={styles.skeletonRow}></div>
              <div style={styles.skeletonRow}></div>
              <div style={styles.skeletonRow}></div>
            </div>
          )}

          {error && !isLoading && (
            <div style={styles.errorBanner}>{error}</div>
          )}

          {!isLoading && !error && (!notifications || notifications.length === 0) && (
            <div style={styles.emptyState}>No new notifications</div>
          )}

          {!isLoading && displayedNotifications?.map((notif, index) => (
            <div 
              key={notif.id} 
              style={{
                ...styles.listItem,
                backgroundColor: index === 0 && !showAll ? '#f8fafc' : '#ffffff' 
              }}
              onClick={() => onMarkAsRead(notif.id)}
            >
              <div style={styles.itemLeft}>
                {renderIcon(notif.type)}
                <span style={styles.messageText}>{notif.message}</span>
              </div>
              <span style={styles.timeText}>{notif.timeAgo}</span>
            </div>
          ))}
        </div>

        {!isLoading && !error && notifications?.length > 0 && (
          <div style={styles.footer}>
            <button 
              type="button"
              style={styles.viewAllButton}
              onClick={(e) => {
                e.stopPropagation(); 
                if (hasMoreNotifications) {
                  setShowAll(!showAll);
                }
              }}
            >
              {showAll ? 'Show less' : 'View all'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  dropdownWrapper: {
    position: 'absolute',
    top: 'calc(100% + 14px)',
    right: '-10px', 
    width: '90vw',           // ACCEPTANCE CRITERIA: Responsive layout
    maxWidth: '400px',       // Prevents it from getting too large on desktop
    zIndex: 1000,
    filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))',
  },
  dropdownPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 2, 
    overflow: 'hidden'
  },
  caretArrow: {
    position: 'absolute',
    top: '-6px',
    right: '24px', 
    width: '14px',
    height: '14px',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #e5e7eb',
    borderTop: '1px solid #e5e7eb',
    transform: 'rotate(45deg)',
    zIndex: 1 
  },
  header: {
    padding: '16px 20px',
    fontWeight: '700',
    fontSize: '15px',
    color: '#0f172a',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    position: 'relative',
    zIndex: 3 
  },
  listContainer: {
    maxHeight: '350px',
    overflowY: 'auto' 
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  itemLeft: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: '12px'
  },
  iconBase: {
    width: '36px',
    height: '36px',
    borderRadius: '8px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  messageText: {
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.5',
    marginTop: '2px'
  },
  timeText: {
    fontSize: '12px',
    color: '#64748b',
    whiteSpace: 'nowrap',
    marginTop: '4px'
  },
  footer: {
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    position: 'sticky', 
    bottom: 0,
    borderTop: '1px solid #f1f5f9',
    zIndex: 3
  },
  viewAllButton: {
    width: '100%',
    backgroundColor: '#0284c7', 
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  skeletonRow: {
    height: '40px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    marginBottom: '12px',
    animation: 'pulse 1.5s infinite'
  },
  padding: {
    padding: '16px 20px'
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '16px 20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  emptyState: {
    padding: '32px 20px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px'
  }
};

export default NotificationDropdown;