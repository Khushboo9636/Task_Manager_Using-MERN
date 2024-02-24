// Dashboard.js
import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import Board from '../../Components/Board/Board.jsx';
import Analytics from '../../Components/Analytics/Analytics.jsx';
import Settings from '../../Components/Setting/Setting.jsx';
import style from './Style.module.css';


function Dashboard() {
  const [activePage, setActivePage] = useState('board');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className={style.main}>
      <Sidebar activePage={activePage} handlePageChange={handlePageChange} />
      <div className={style.mainContent}>
        {activePage === 'board' && <Board />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default Dashboard;
