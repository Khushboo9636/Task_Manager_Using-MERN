import React, { useState, useEffect } from 'react';
import style from './Style.module.css';
import { MoreHorizontal } from 'react-feather';
import Chip from '../Chip/Chip';
import TodoModal from '../TodoModal/TodoModal.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../DeleteModal/DeleteModal.jsx';

function Card({ onMove, currentBoard, moveCard, task, availableCategories, onUpdateTask ,onDeleteTask ,updateCategoryInBackend, handleSaveEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPastDue, setIsPastDue] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    // Check if the task has a due date and if it's past due
    if (task.dueDate) {
      const currentDate = new Date();
      const isPast = new Date(task.dueDate) < currentDate;
      setIsPastDue(isPast);
    }
    // Calculate the initial checked count
    const initialCheckedCount = task.checklist.filter(item => item.isChecked).length;
    setCheckedCount(initialCheckedCount);
  }, [task.dueDate, task.checklist]);

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
  
  // const handleSaveEdit = async (updatedTask) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:4000/api/task/edit/${task._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedTask),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok.');
  //     }
  //      // Update task in the UI after successful API call
  //      onUpdateTask(updatedTask);
  //     console.log('Task updated successfully:', updatedTask);
  //      // Update local storage
  //   const updatedTasks = tasks.map(task =>
  //     task._id === updatedTask._id ? updatedTask : task
  //   );
  //   localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  //   } catch (error) {
  //     console.error('Error updating task:', error);
  //     alert('Failed to update the task.');
  //   }
  // };

  const handleSaveEditLocal = async (updatedTask) => {
    await handleSaveEdit(updatedTask, task);
    // You can perform additional actions after saving edit locally
  };
  const handleChecklistItemChange = async (index) => {
    try {
      const updatedTask = { ...task };
      updatedTask.checklist[index].isChecked = !updatedTask.checklist[index].isChecked;
  
      // Save the updated task
      await handleSaveEdit(updatedTask, task); // Pass the original task as well
  
      // Update the checked count
      const newCheckedCount = updatedTask.checklist.filter(item => item.isChecked).length;
      setCheckedCount(newCheckedCount);
    } catch (error) {
      console.error('Error updating checklist item:', error);
      // Handle error
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
        //setShareableLink(shareData.frontendShareableLink)
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
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
      <div className={style.cardTitle}>{task.title}</div>
      <div className={style.cardBody}>
        {/* Render checklist */}
        <div className={style.checklist} onClick={toggleExpand}>
          {/* Checklist ({task.checklist.filter((item) => item.isChecked).length}/{task.checklist.length}){' '}
          {isExpanded ? '▲' : '▼'} */}
           Checklist ({checkedCount}/{task.checklist.length}) {isExpanded ? '▲' : '▼'}
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
          {task.dueDate && <Chip text={formatDate(task.dueDate)}  color={isPastDue ? 'red' : 'gray'} />}
        </div>
        <div className={style.cardFooterButtons}>
          {/* Render buttons for available categories */}
          {availableCategories.map(
            (category) =>
              currentBoard !== category && (
                <button key={category} onClick={() => handleMove(category)}>
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
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm }
        />
      )}
   
    </div>


  );
}

export default Card;

