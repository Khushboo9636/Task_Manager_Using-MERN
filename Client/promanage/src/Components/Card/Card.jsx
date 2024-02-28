import React, { useState, useEffect } from 'react';
import style from './Style.module.css';
import { MoreHorizontal } from 'react-feather';
import { ChevronDown } from 'react-feather';
import { ChevronUp } from 'react-feather';
import Chip from '../Chip/Chip';
import TodoModal from '../TodoModal/TodoModal.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../DeleteModal/DeleteModal.jsx';

function Card({ onMove, currentBoard, moveCard, task, availableCategories, onUpdateTask ,onDeleteTask ,updateCategoryInBackend, handleSaveEdit,isCollapsed }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPastDue, setIsPastDue] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    
    
    if (task.dueDate) {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      
      
      if (currentBoard === 'done') {
        
        setIsPastDue(false);
      } else {
      
        const isPast = new Date(task.dueDate) < yesterday;
        setIsPastDue(isPast);
      }
    } else {
     
      setIsPastDue(false);
    }
  

   
    const initialCheckedCount = task.checklist.filter(item => item.isChecked).length;
    setCheckedCount(initialCheckedCount);
  }, [task.dueDate, task.checklist , currentBoard ]);
  useEffect(() => {
    
    setIsExpanded(false);
  }, [isCollapsed]);

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  const handleMove = (newState) => {
    onMove(task._id, newState);
    moveCard(task._id, newState);
    updateCategoryInBackend(task._id, newState);
  };

  const handleDeleteButtonClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteTask(task._id); 
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  
 
  const handleSaveEditLocal = async (updatedTask) => {
    await handleSaveEdit(updatedTask, task);
    
  };
  const handleChecklistItemChange = async (index) => {
    try {
      const updatedTask = { ...task };
      updatedTask.checklist[index].isChecked = !updatedTask.checklist[index].isChecked;
  
      // Save the updated task
      await handleSaveEdit(updatedTask, task); 
  
      // Update the checked count
      const newCheckedCount = updatedTask.checklist.filter(item => item.isChecked).length;
      setCheckedCount(newCheckedCount);
    } catch (error) {
      console.error('Error updating checklist item:', error);
     
    }
  };
  
  
  const copyShareableLink = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/task/tasks/${taskId}/share`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
      
        navigator.clipboard.writeText(data.frontendShareableLink);
        toast.success('Shareable link copied to clipboard!', {
          position: 'top-center'
        });
      } else {
        console.error('Failed to copy shareable link:', response.statusText);
      }
    } catch (error) {
      console.error('Error copying shareable link:', error.message);
    }
  };
  
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options);
  
    const [day, month] = formattedDate.split(' ');
    
    return `${day} ${month}`;
  }
  


 

  return (
    <div className={style.card} id={`card-${task._id}`}>
      <div className={style.cardTop}>
        <div className={style.cardTopLabels}>
          {/* Render task priority */}
          <div className={style.pri}>
            {task.priority === 'High' && <div className={style.redCircle}> </div>}
            {task.priority === 'Medium' && <div className={style.blueCircle}></div>}
            {task.priority === 'Low' && <div className={style.greenCircle}></div>}
            {task.priority && <div>{task.priority} Priority</div>}
          </div>
          <MoreHorizontal onClick={() => setShowMenu(!showMenu)} />
        </div>
        {showMenu && (
          <div className={style.dropdownMenu}>
            <button onClick={() => setShowEditModal(true)}>Edit</button>
            <button onClick={() => copyShareableLink(task._id)}>Share</button>


            <button onClick={handleDeleteButtonClick}>Delete</button>

          </div>
        )}
      </div>
      <div className={style.cardTitle} title={task.title}>{task.title}</div>
      <div className={style.cardBody}>
        {/* Render checklist */}
        <div className={style.checklist} onClick={toggleExpand}>
        
          <div className={style.chexktext}> Checklist ({checkedCount}/{task.checklist.length}) </div>
          <div className={style.checkarrow}>{isExpanded ? <ChevronUp/> : <ChevronDown/>}</div>
          
        </div>
        {isExpanded && (
          <div className={style.checklistItems}>
            {task.checklist.map((item, index) => (
              <div key={index} className={style.checklistItem}>
                <input type="checkbox" checked={item.isChecked} 
                onChange={() => handleChecklistItemChange(index)}
                 />
                <label>{item.item}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={style.cardFooter}>
        <div className={style.cardFooterLabels}>
          {/* Render due date chip if present */}
          {task.dueDate && <Chip text={`${formatDate(task.dueDate)}th`}  color={isPastDue ? '#CF3636'
          : currentBoard === 'done'
          ? '#63C05B' 
          : 'gray'} />}
        </div>
        <div className={style.cardFooterButtons}>
          {/* Render buttons for available categories */}
          {availableCategories.map(
           (category) =>
              currentBoard !== category && (
                <button key={category} className={style.buttonGroup} onClick={() => handleMove(category)}>
                  {category}
                </button>
              )
          )}
        </div>
      </div>
      {/* Render edit modal if showEditModal is true */}
      {showEditModal && (
        <TodoModal
          onClose={() => setShowEditModal(false)}
          onSave={(updatedTask) => {
            handleSaveEdit(updatedTask, task);
            setShowEditModal(false);
          }}
          task={task}
        />
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
     {/* Delete modal */}
     {showDeleteModal && (
        <DeleteModal
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm }
        />
      )}
   
    </div>


  );
}

export default Card;

