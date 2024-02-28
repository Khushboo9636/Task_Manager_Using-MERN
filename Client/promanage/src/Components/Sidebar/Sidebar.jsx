// Sidebar.js
import React from 'react';
import styles from './style.module.css';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png'

import { Layout} from 'react-feather';
import { Settings } from 'react-feather';
import { Database } from 'react-feather';
import { LogOut } from 'react-feather';
import LogOutModal from '../LogoutModal/LogOutModal';
import { useState } from 'react';

function Sidebar({ activePage, handlePageChange }) {
  const navigate = useNavigate();
  const [showLogOutModal, setShowLogOutModal] = useState(false);
//   const handleLogOut = () => {
       
//     localStorage.removeItem('token');
    
//     navigate('/'); 
// }

const handleLogOutButtonClick = () => {
  setShowLogOutModal(true);
};

const handleLogoutConfirm= () => {
  localStorage.removeItem('token');
  setShowLogOutModal(false);  
  navigate('/login'); 
};

const handleLogoutCancel = () => {
  setShowLogOutModal(false);
};
  return (
    <div className={styles.sidebar}> {/* Use className from CSS module */}
      <div className={styles.logo}> 
        <img src={logo} alt="logo" className={styles.logoImage}/>
       </div>
      <ul>
      <li className={activePage === 'board' ? styles.active : ''} onClick={() => handlePageChange('board')}>
          <div className={styles.navButton}><Layout className={styles.icons}/>Board</div>
        </li>
        <li className={activePage === 'analytics' ? styles.active : ''} onClick={() => handlePageChange('analytics')}>
          <div className={styles.navButton}><Database className={styles.icons}/>Analytics</div>
        </li>
        <li className={activePage === 'settings' ? styles.active : ''} onClick={() => handlePageChange('settings')}>
          <div className={styles.navButton}><Settings className={styles.icons}/>Settings</div>
        </li>
      </ul>
      <div className={styles.footer}> {/* Use className from CSS module */}
        <div className={styles.logout} onClick={handleLogOutButtonClick}><LogOut style={{position:"relative", top:"6px"}} />Log out</div >
      </div>
      {showLogOutModal && (
        <LogOutModal
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm }
        />
      )}
    </div>
  );
}

export default Sidebar;
