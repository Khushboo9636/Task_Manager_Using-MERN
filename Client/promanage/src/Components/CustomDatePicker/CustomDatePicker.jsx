import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css'; // Import your custom CSS for styling

function CustomDatePicker() {
  const [selectedDate, setSelectedDate] = useState(null);

  const clearDate = () => {
    setSelectedDate(null);
  };

  const setToday = () => {
    setSelectedDate(new Date());
  };

  const CustomInput = ({ value, onClick }) => (
    <button className="custom-input" onClick={onClick}>
      {value ? value : 'Select Date'}
    </button>
  );

  return (
    <DatePicker
      selected={selectedDate}
      onChange={date => setSelectedDate(date)}
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput />}
      popperModifiers={{
        offset: {
          enabled: true,
          offset: '-10px, 0px' // Adjust the offset as needed
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'viewport'
        }
      }}
      popperPlacement="bottom"
      popperContainer={CustomPopperContainer}
      renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div className="custom-header">
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {'<'}
          </button>
          <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {'>'}
          </button>
        </div>
      )}
      renderCalendarContainer={({ children }) => (
        <div className="custom-calendar-container">
          {children}
          <div className="custom-button-group">
            <button onClick={clearDate}>Clear</button>
            <button onClick={setToday}>Today</button>
          </div>
        </div>
      )}
    />
  );
}

function CustomPopperContainer({ children }) {
  return <div className="custom-popper-container">{children}</div>;
}

export default CustomDatePicker;
