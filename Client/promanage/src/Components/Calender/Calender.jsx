// CalendarComponent.js
import React, { Component } from 'react';
import { CalendarComponent } from '@syncfusion/ej2-react-calendars';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.onCreated = this.onCreated.bind(this);
  }

  onCreated() {
    const clearBtn = document.createElement('button');
    clearBtn.setAttribute('class', 'e-btn e-clear e-flat');
    clearBtn.innerHTML = 'Clear';
    
    const todayBtn = document.createElement('button');
    todayBtn.setAttribute('class', 'e-btn e-flat');
    todayBtn.innerHTML = 'Today';

    const footerElement = document.querySelector('.e-footer-container');
    footerElement.insertBefore(todayBtn, footerElement.childNodes[0]);
    footerElement.insertBefore(clearBtn, footerElement.childNodes[0]);

    clearBtn.addEventListener("click", () => {
      this.calendarInstance.value = null;
    });

    todayBtn.addEventListener("click", () => {
      this.calendarInstance.value = new Date();
    });
  }

  render() {
    return (
      <div>
        <h2>Syncfusion Calendar Component</h2>
        <CalendarComponent id="calendar" created={this.onCreated} ref={calendar => this.calendarInstance = calendar}/>
      </div>
    );
  }
}

export default Calendar;
