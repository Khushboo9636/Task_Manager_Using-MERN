// Sidebar.js
import React from 'react';
import styles from './style.module.css'; // Import CSS module

function Sidebar({ activePage, handlePageChange }) {
  return (
    <div className={styles.sidebar}> {/* Use className from CSS module */}
      <h2>Pro Manage</h2>
      <ul>
      <li className={activePage === 'board' ? styles.active : ''} onClick={() => handlePageChange('board')}>
          <button className={styles.navButton}>Board</button>
        </li>
        <li className={activePage === 'analytics' ? styles.active : ''} onClick={() => handlePageChange('analytics')}>
          <button className={styles.navButton}>Analytics</button>
        </li>
        <li className={activePage === 'settings' ? styles.active : ''} onClick={() => handlePageChange('settings')}>
          <button className={styles.navButton}>Settings</button>
        </li>
      </ul>
      <div className={styles.footer}> {/* Use className from CSS module */}
        <button>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;
