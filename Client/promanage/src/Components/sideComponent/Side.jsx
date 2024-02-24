import React from 'react'
import style from './Style.module.css'
import back from '../../assets/Back.png'
import art from '../../assets/Art.png'
function Side() {
  return (
    <div className={style.mainContainer}>
     <img src={back} alt="back" className={style.back}/>
    <div className={style.showContainer}>
   
      <img src={art} alt="art" className={style.art}/>
      <div className={style.heading}>
        Welcome aboard my friend
      </div>
      <div className={style.p}>
        just a couple of click and we start
      </div>
    </div>      
  </div>
  )
}

export default Side
