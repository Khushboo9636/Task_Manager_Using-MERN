

import React, { useState, useEffect } from 'react';
import style from './Style.module.css';
import KanbanBoard from '../KanbanBoard/KanbanBoard';
import TodoModal from '../TodoModal/TodoModal';
import { ChevronDown } from 'react-feather';

function Board() {
  const [tasks, setTasks] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filterType, setFilterType] = useState(null); // Add this line
  const [inputMonth, setInputMonth] = useState(''); 
  const [createdDate, setCreatedDate] = useState('');
  const [name, setName] = useState('')
 

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user'));
    const storedname = localStorage.getItem('name');

    if (storedUserData && storedname && storedUserData.createdAt) {
      setName(storedname);
      setCreatedDate(new Date(storedUserData.createdAt)); // Parse the date string
    } else {
      setName('');
      setCreatedDate('');
    }
    fetchTasks();
  }, []);
  

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:4000/api/task/getAlltask', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setTasks(data);

      // Save fetched tasks to local storage
      //localStorage.setItem('tasks', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // const handleMove = (taskId, newStatus) => {
  //   updateCategoryInBackend(taskId, newStatus);
    
  //   // Update task status on the frontend
  //   const updatedTasks = tasks.map(task =>
  //     task._id === taskId ? { ...task, state: newStatus } : task
  //   );
  //   setTasks(updatedTasks);

  //   // Save updated tasks to local storage
  // //  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  //    // Update category in backend
   
  // };
  const handleMove = async (taskId, newStatus) => {
    try {
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? { ...task, state: newStatus } : task
      );
      setTasks(updatedTasks); // Update frontend state

      await updateCategoryInBackend(taskId, newStatus); // Update backend
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };
  const updateCategoryInBackend = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/task/move/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newState: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category in backend.');
      }
      await fetchTasks();
      console.log('Category updated in backend successfully:', taskId, newStatus);
    } catch (error) {
      console.error('Error updating category in backend:', error);
      // Handle error
    }
  };

  const handleAddTodo = () => {
    setShowTodoModal(true); // Show TodoModal
  };

  const handleTodoModalClose = () => {
    setShowTodoModal(false); // Close TodoModal
  };

  const handleTodoModalSave = async (todoData) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:4000/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status} ${response.statusText}`);
      }

      const createdTodo = await response.json();
     setTasks([...tasks, createdTodo]); // Add the new todo to the tasks list
       

      setShowTodoModal(false); // Close TodoModal after saving
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  
  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map(t => t._id === updatedTask._id ? updatedTask : t);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete task.');
      }
      // Remove the deleted task from the tasks array
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
      console.log('Task deleted successfully:', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Handle errors, such as displaying error messages to the user
    }
  };
  
  

  const handleFilterDropdownToggle = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setFilterDropdownVisible(false);
    setInputMonth(type); // Close the filter dropdown after selecting a filter type
  };

  // Filter tasks based on the selected filter type
  const filteredTasks = () => {
    switch (filterType) {
      case 'today':
        return tasks.filter(task => isToday(new Date(task.createdDate)));
      case 'week':
        return tasks.filter(task => isWithinWeek(new Date(task.createdDate)));
      case 'month':
        return tasks.filter(task => isWithinMonth(new Date(task.createdDate)));
      default:
        return tasks;
    }
  };

  // Function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Function to check if a date is within the last week
  const isWithinWeek = (date) => {
    const today = new Date();
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    return date >= lastWeek && date <= today;
  };

  // Function to check if a date is within the last month
  const isWithinMonth = (date) => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return date >= lastMonth && date <= today;
  };


  function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }


  // const handleSaveEdit = async (updatedTask, originalTask) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:4000/api/task/edit/${originalTask._id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedTask),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok.');
  //     }
      
  //     // Update task in the UI after successful API call
  //     handleUpdateTask(updatedTask);
  //     await fetchTasks();
  //     console.log('Task updated successfully:', updatedTask);
  
  //     // Update local storage
  //     const updatedTasks = tasks.map(task =>
  //       task._id === updatedTask._id ? updatedTask : task
  //     );
  //     setTasks(updatedTasks);
  //     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  //   } catch (error) {
  //     console.error('Error updating task:', error);
  //     alert('Failed to update the task.');
  //   }
  // };
  
  const handleSaveEdit = async (updatedTask, originalTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/task/edit/${originalTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
       // Fetch the updated task from the backend using its ID
     const updatedTaskResponse = await fetch(`http://localhost:4000/api/task/gettask/${originalTask._id}`, {
         method: 'GET',  
     headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  
      if (!updatedTaskResponse.ok) {
        throw new Error('Failed to fetch updated task.');
      }
  
      const updatedTaskData = await updatedTaskResponse.json();
      handleUpdateTask(updatedTaskData);
      // Update local state with the updated task
      const updatedTasks = tasks.map(task =>
        task._id === updatedTaskData._id ? updatedTaskData : task
      );
      setTasks(updatedTasks);
  
      console.log('Task updated successfully:', updatedTaskData);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update the task.');
    }
  };
  
  return (
    <div className={style.main}>
      <div className={style.topheading}>
        <h1>Welcome! {name}</h1>
        {createdDate && <p>{formatDate(createdDate)}</p>}
      </div>
      <div className={style.heading}>
        <div>Board</div>
        <div className={style.filterDropdown} onClick={handleFilterDropdownToggle}>
           {inputMonth}<ChevronDown  style={{position:"relative"}}/>
          {filterDropdownVisible && (
            <div className={style.dropdownMenu}>
              <button onClick={() => handleFilterTypeChange('today')}>Today</button>
              <button onClick={() => handleFilterTypeChange('week')}>This Week</button>
              <button onClick={() => handleFilterTypeChange('month')}>Month</button>
            </div>
          )}
        </div>

        {/* <div className={style.checklist} onClick={toggleExpand}>
           filter {isExpanded ? '▲' : '▼'}
        </div>
        {isExpanded && (
           <div className={style.dropdownMenu}>
           <button>Today</button>
           <button>Week</button>
           <button>Month</button>
         </div>
        )} */}
      </div>
      <div className={style.boardOuter}>
        <div className={style.appBoard}>
          <KanbanBoard
            title="Backlog"
            collapseIcon={true}
            addIcon={false}
            tasks={tasks.filter((task) => task.state === 'Backlog')}
            onMove={handleMove}
            onUpdateTask={handleUpdateTask}             //Backlog', 'Todo', 'In Progress', 'Done'
            onDeleteTask={handleDeleteTask}
            updateCategoryInBackend={updateCategoryInBackend}
            handleSaveEdit={handleSaveEdit}
            
          />
          <KanbanBoard
            title="Todo"
            collapseIcon={true}
            addIcon={true}
            tasks={tasks.filter((task) => task.state === 'Todo')}
            onMove={handleMove}
            onAdd={handleAddTodo}
            onUpdateTask={handleUpdateTask} 
            onDeleteTask={handleDeleteTask}
           updateCategoryInBackend={updateCategoryInBackend}
            handleSaveEdit={handleSaveEdit}
     
          />
          <KanbanBoard
            title="In Progress"
            collapseIcon={true}
            addIcon={false}
            tasks={tasks.filter((task) => task.state === 'In Progress')}
            onMove={handleMove}                     
            onUpdateTask={handleUpdateTask} 
            onDeleteTask={handleDeleteTask}
            updateCategoryInBackend={updateCategoryInBackend}
            handleSaveEdit={handleSaveEdit}
           
          />
          <KanbanBoard
            title="Done"
            collapseIcon={true}
            addIcon={false}
            tasks={tasks.filter((task) => task.state === 'Done')}
            onMove={handleMove}
            onUpdateTask={handleUpdateTask} 
            onDeleteTask={handleDeleteTask}
            updateCategoryInBackend={updateCategoryInBackend}
            handleSaveEdit={handleSaveEdit}
            
          />
        </div>
      </div>
      {/* Todo modal */}
      {showTodoModal && (
        <TodoModal onClose={handleTodoModalClose} onSave={handleTodoModalSave}  />
      )}
       
    </div>
  );
}

export default Board;


