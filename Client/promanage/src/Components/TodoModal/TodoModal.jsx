
import React, { useState } from 'react';import { useEffect } from 'react';
import style from './Style.module.css';
import { Plus, XCircle } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TodoModal({ onClose, onSave ,task }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [checklistItems, setChecklistItems] = useState([]);
  const [checklistItemStates, setChecklistItemStates] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setChecklistItems(task.checklist.map(item => item.item));
      setChecklistItemStates(task.checklist.map(item => item.isChecked));
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  const handleAddChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
    setChecklistItemStates([...checklistItemStates, false]); // Initialize the state as unchecked
  };

  const handleChecklistItemChange = (index, value) => {
    const updatedChecklistItems = [...checklistItems];
    updatedChecklistItems[index] = value;
    setChecklistItems(updatedChecklistItems);
  };
  const handleChecklistItemCheck = (index, isChecked) => {
    const updatedChecklistItemStates = [...checklistItemStates];
    updatedChecklistItemStates[index] = isChecked;
    setChecklistItemStates(updatedChecklistItemStates);
  };
  
  const handleChecklistItemDelete = index => {
    const updatedChecklistItems = [...checklistItems];
    updatedChecklistItems.splice(index, 1);
    setChecklistItems(updatedChecklistItems);

    const updatedChecklistItemStates = [...checklistItemStates];
    updatedChecklistItemStates.splice(index, 1);
    setChecklistItemStates(updatedChecklistItemStates);
  };
  // const handleChecklistItemDelete = (index) => {
  //   const updatedChecklistItems = [...checklistItems];
  //   updatedChecklistItems.splice(index, 1);
  //   setChecklistItems(updatedChecklistItems);
  // };
  const handleSave = async () => {
    try {
      // Validate input fields before saving
      if (title.trim() === '' || priority === '') {
        alert('Please fill in all required fields.');
        return;
      }
  
      // Prepare data to send to backend
      const todoData = {
        title,
        priority,
        checklist: checklistItems.map((item, index) => ({ item, isChecked: checklistItemStates[index] })),
        dueDate,
      };
  
      const token = localStorage.getItem('token');
      let url = 'http://localhost:4000/api/task/create';
      let method = 'POST';
  
      // If task prop is present, it means we are updating an existing task
      if (task) {
        url = `http://localhost:4000/api/task/edit/${task._id}`;
        method = 'PUT';
      }
  
      // Make POST or PUT request to backend based on whether it's a new task or editing an existing one
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todoData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
  
      console.log('Success:', data);
      onSave(data); // Pass the saved task data to the parent component
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save the task.');
    }
  };
  
  const handleSetToday = () => {

    // Set the due date to today's date
    setDueDate(new Date());
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.todoModal}>
        <div className={style.modalHeader}>
          <h1>Todo</h1>
          <XCircle onClick={onClose} />
        </div>
        <div className={style.modalBody}>
          <div className={style.inputGroup}>
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className={style.inputGroup}>
            <label>Select Priority *</label>
            <div className={style.priorityOptions}>
            <div
                className={`${style.priorityOption} ${
                  priority === 'High' && style.selected
                }`}
                onClick={() => setPriority('High')}
              >
                <div className={style.redCircle}></div> High Priority
              </div>
              <div
                className={`${style.priorityOption} ${
                  priority === 'Medium' && style.selected
                }`}
                onClick={() => setPriority('Medium')}
              >
                <div className={style.blueCircle }></div> Medium Priority
              </div>
              <div
                className={`${style.priorityOption} ${
                  priority === 'Low' && style.selected
                }`}
                onClick={() => setPriority('Low')}
              >
                <div className={style.greenCircle}></div> Low Priority
              </div>
            </div>
          </div>
          <div className={style.inputGroup}>
            <label>Checklist *</label>
            {checklistItems.map((item, index) => (
              <div key={index} className={style.checklistItem}>
                 <input
                   type="checkbox"
                   checked={checklistItemStates[index]}
                   onChange={e => handleChecklistItemCheck(index, e.target.checked)}
                  />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                />
                <XCircle onClick={() => handleChecklistItemDelete(index)} />
              </div>
            ))}
            <Plus onClick={handleAddChecklistItem} />
          </div>
        </div>
        <div className={style.modalFooter}>
        <button onClick={() => setShowDatePicker(true)}>
              {dueDate ? dueDate.toDateString() : 'Select Due Date'}
            </button>
            {showDatePicker && (
              <div className={style.datePickerContainer}>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="dd/MM/yyyy"
                />
                <div className={style.buttonGroup}>
                  <button onClick={() => setDueDate(null)}>Clear</button>
                  <button onClick={handleSetToday}>Today</button>
                </div>
              </div>
            )}

{/* <button onClick={() => setShowDatePicker(true)}>
              {dueDate ? dueDate.toLocaleDateString() : 'Select Due Date'}
            </button>
            {showDatePicker && (
              <div className={style.datePicker}>

                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  inline
                />
                <button onClick={() => setDueDate(null)}>Clear</button>
                <button onClick={() => setShowDatePicker(false)}>Cancel</button>
                <button onClick={handleSave}>Save</button>
              </div>
            )} */}



          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
          {/* <button>Select Due Date</button> */}
        </div>
      </div>
    </div>
  );
}

export default TodoModal;
