

import React from 'react';
import style from './Style.module.css';
import Card from '../Card/Card.jsx';
import { MoreHorizontal, Plus } from 'react-feather';


function KanbanBoard({ title, collapseIcon, addIcon, tasks, onMove,onAdd ,onUpdateTask ,onDeleteTask,updateCategoryInBackend, handleSaveEdit }) {
  const moveCard = (taskId, newStatus) => {
    onMove(taskId, newStatus); 
    // Implement the moveCard functionality here
    console.log(`Moving card ${taskId} to ${newStatus}`);
    
    // You can update the tasks array in this function
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
  return (
    <div className={style.board}>
      <div className={style.board_top}>
        <h2>{title}</h2>
        <div className={style.icons}>
          {collapseIcon && <MoreHorizontal />}
          {addIcon && <Plus onClick={handleAddClick} />}
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
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;