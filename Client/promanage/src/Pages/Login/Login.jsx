import React from 'react'
import style from './Style.module.css'
import Side from '../../Components/sideComponent/Side'
import LoginForm from '../../Components/LoginForm/LoginForm'
function Login() {
  return (
    <div className={style.main}>
        <div className={style.leftContainer}>
            <Side/>

        </div>
        <div className={style.rightContainer}>
           <LoginForm/>
        </div>


    </div>
  )
}

export default Login
