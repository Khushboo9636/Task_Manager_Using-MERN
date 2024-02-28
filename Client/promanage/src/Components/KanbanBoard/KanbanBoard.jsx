

import React from 'react';
import style from './Style.module.css';
import Card from '../Card/Card.jsx';
import { MoreHorizontal, Plus } from 'react-feather';
import { useState } from 'react';
import collab from '../../assets/collapse.png'


function KanbanBoard({ title, collapseIcon, addIcon, tasks, onMove,onAdd ,onUpdateTask ,onDeleteTask,updateCategoryInBackend, handleSaveEdit }) {
  const [isAllCollapsed, setIsAllCollapsed] = useState(false);
  
  const moveCard = (taskId, newStatus) => {
    onMove(taskId, newStatus); 
  
    console.log(`Moving card ${taskId} to ${newStatus}`);
    
  };
  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    }
  };
 
   // Determine available categories for each task
   const determineAvailableCategories = (currentCategory) => {
    switch (currentCategory) {
      case 'Backlog':
        return ['Todo', 'In Progress', 'Done'];
      case 'Todo':
        return ['Backlog', 'In Progress', 'Done'];
      case 'In Progress':
        return ['Backlog', 'Todo', 'Done'];
      case 'Done':
        return ['Backlog', 'Todo', 'In Progress'];
      default:
        return [];               
    }
  };

  const toggleCollapseAll = () => {
    setIsAllCollapsed(prevState => !prevState);
  };


  return (
    <div className={style.board}>
      <div className={style.board_top}>
        <h2>{title}</h2>
        <div className={style.icons}>
        {addIcon && <Plus onClick={handleAddClick} />}
          {collapseIcon && <img src={collab} alt='collapse' onClick={toggleCollapseAll}  />}
          
        </div>
      </div>
      <div className={style.board_cards}>
        {tasks.map((task , index) => (
          <Card
          key={`${task.id}-${index}`} 
            onMove={onMove}
            currentBoard={title.toLowerCase()}
            moveCard={moveCard} // Pass the moveCard function to Card component
            task={task}
            availableCategories={determineAvailableCategories(title)} 
            onUpdateTask={ onUpdateTask} 
            onDeleteTask={onDeleteTask}
            updateCategoryInBackend={updateCategoryInBackend}
            handleSaveEdit={handleSaveEdit}
            isCollapsed={isAllCollapsed} 
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;