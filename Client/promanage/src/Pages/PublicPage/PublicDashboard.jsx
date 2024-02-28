import React, { useState, useEffect } from 'react';
import Style from './Style.module.css';
import Chip from '../../Components/Chip/Chip';
import { useParams } from 'react-router-dom';
import logo from '../../assets/logo.png'

function PublicDashboard() {
   const { taskId } = useParams();
  const [task, setTask] = useState(null);


  useEffect(() => {
   
    // Fetch task details when component mounts
    fetchTaskDetails(taskId); // Function to fetch task details
  }, [ taskId]); // Dependency array with taskId to fetch data when taskId changes

  // Function to fetch task details
  const fetchTaskDetails = async (taskId) => {
    try {
      const response = await fetch(`https://khushisinha011-cuvette-final-project.onrender.com/api/task/gettask/${taskId}`);
      if (response.ok) {
        const taskData = await response.json();
        setTask(taskData);
      } else {
        console.error('Error fetching task details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };
 
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    // Splitting the formatted date to extract day and month
    const [day, month] = formattedDate.split(' ');
    // Returning day and month concatenated
    return `${day} ${month}`;
  }
  

  return (
    <div className={Style.main}>
      <div className={Style.topheading}>
        <div className={Style.logo}> 
        <img src={logo} alt="logo" className={Style.logoImage}/>
        </div>
        
      </div>
      <div className={Style.mainBody}>
        <div className={Style.cardContainer}>
          {task && (
            <div className={Style.card} id={`card-${task._id}`}>
              <div className={Style.cardTop}>
                <div className={Style.cardTopLabels}>
                  <div className={Style.pri}>
                    {task.priority === 'High' && <div className={Style.redCircle}> </div>}
                    {task.priority === 'Medium' && <div className={Style.blueCircle}></div>}
                    {task.priority === 'Low' && <div className={Style.greenCircle}></div>}
                    {task.priority && <div>{task.priority} Priority</div>}
                  </div>
                </div>
              </div>
              <div className={Style.cardTitle}>{task.title}</div>
              <div className={Style.cardBody}>
                <div className={Style.checklist}>
                  Checklist ({task.checklist.filter(item => item.isChecked).length}/{task.checklist.length})
                </div>
                <div className={Style.checklistItems}>
                  {task.checklist.map((item, index) => (
                    <div key={index} className={Style.checklistItem}>
                      <input type="checkbox" checked={item.isChecked} disabled />
                      <label>{item.item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className={Style.cardFooter}>
              {task.dueDate && (
                <div className={Style.cardFooterLabels}>
                    <label>Due Date</label>
                    <Chip text={`${formatDate(task.dueDate)}th`}  color={'red'} />
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;
