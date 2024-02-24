import React from 'react'
import style from './Style.module.css'
function Chip(props) {
  return (
    <div className={style.chip} style={{backgroundColor: props.color }}>
        {props.text}

      
    </div>
  )
}

export default Chip
