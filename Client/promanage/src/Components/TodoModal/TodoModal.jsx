
import React, { useState } from 'react';import { useEffect } from 'react';
import style from './Style.module.css';
import { Plus, Trash, XCircle } from 'react-feather';
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
  // Calculate the count of checked checklist items
  const checkedItemCount = checklistItemStates.filter(item => item).length;
  // Total number of checklist items
  const totalItemCount = checklistItems.length;

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
  
      
      onSave(todoData); // Pass the saved task data to the parent component
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
        {/* <div className={style.modalHeader}>
          <h1>Todo</h1>
          <XCircle onClick={onClose} />
        </div> */}
        <div className={style.modalBody}>
          <div className={style.inputGroup1}>
            <label>Title <span style={{color:"red"}}>*</span></label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={style.textTitleInput}
            />
          </div>
          <div className={style.inputGroup}>
            <div style={{float:"left",paddingTop:"8px"}}>Select Priority <span style={{color:"red"}}>*</span></div>
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
            <label>Checklist  ({checkedItemCount}/{totalItemCount}) <span style={{color:"red"}}>*</span></label>
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
                <Trash style={{color:"red"}} onClick={() => handleChecklistItemDelete(index)} />
              </div>
            ))}
            <div className={style.buttonAdd} onClick={handleAddChecklistItem}>
            <Plus/> <span className={style.spanElem}>Add New</span>

            </div>
          </div>
        </div>
        <div className={style.modalFooter}>
        <button onClick={() => setShowDatePicker(true)} className={style.due}>
              {dueDate ? dueDate.toDateString() : 'Select Due Date'}
            </button>
            {showDatePicker && (
              <div className={style.datePickerContainer}>
                <div className={style.calender}>
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


         <div className={style.btns}>
         <button className={style.cancel} onClick={onClose}>Cancel</button>
          <button className={style.confirm} onClick={handleSave}>Save</button>
          
          </div>
          {/* <button>Select Due Date</button> */}
        </div>
      </div>
    </div>
  );
}

export default TodoModal;
