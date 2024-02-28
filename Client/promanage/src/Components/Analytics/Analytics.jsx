import React, { useState, useEffect } from 'react';
import style from './Style.module.css'
function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('https://khushisinha011-cuvette-final-project.onrender.com/api/task/analytics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          throw new Error('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);


  return (
    <div className={style.main}>
      <div className={style.header}>
        <h3>Analytics</h3>
      </div>
      <div className={style.bodyContainer}>
      {analyticsData && (
          <>
        <div className={style.leftContainer}> 
         <div className={style.mainbody}>
          <div className={style.analyisis}>
              <div className={style.combo}>
                 <div className={style.circle}></div>
                 <div className={style.titleName}>Backlog Tasks</div>
              </div>
              <div className={style.number}>
              {analyticsData.backlogTasks}
              </div>
          </div>

          <div className={style.analyisis}>
              <div className={style.combo}>
                 <div className={style.circle}></div>
                 <div className={style.titleName}>To-Do Tasks</div>
              </div>
              <div className={style.number}>
              {analyticsData.todoTasks}
              </div>
          </div>

          <div className={style.analyisis}>
              <div className={style.combo}>
                 <div className={style.circle}></div>
                 <div className={style.titleName}>In-Progress Tasks</div>
              </div>
              <div className={style.number}>
              {analyticsData.inProgressTasks}
              </div>
          </div>

          <div className={style.analyisis}>
              <div className={style.combo}>
                 <div className={style.circle}></div>
                 <div className={style.titleName}>Completed Tasks</div>
              </div>
              <div className={style.number}>
              {analyticsData.completedTasks}
              </div>
          </div>
          </div>
        </div>
        <div className={style.rightContainer}>
          <div className={style.mainbody}>
             <div className={style.analyisis}>
                <div className={style.combo}>
                   <div className={style.circle}></div>
                   <div className={style.titleName}>Low Priority</div>
                </div>
                <div className={style.number}>
                {analyticsData. lowPriorityTasks}
                </div>
              </div>

             <div className={style.analyisis}>
                 <div className={style.combo}>
                    <div className={style.circle}></div>
                    <div className={style.titleName}>Moderate Priority</div>
                 </div>
                 <div className={style.number}>
                 {analyticsData.moderatePriorityTasks}
                 </div>
             </div>

             <div className={style.analyisis}>
                 <div className={style.combo}>
                    <div className={style.circle}></div>
                    <div className={style.titleName}>High Priority</div>
                 </div>
                  <div className={style.number}>
                  {analyticsData.highPriorityTasks}
                 </div>
             </div>

             <div className={style.analyisis}>
                 <div className={style.combo}>
                    <div className={style.circle}></div>
                    <div className={style.titleName}>Due Date Tasks</div>
                  </div>
                 <div className={style.number}>
                 {analyticsData.dueDateTasks}
                 </div>
             </div>
          </div>
        </div>
        </>
        )}
      </div>
    
    </div>
  )
}

export default Analytics
