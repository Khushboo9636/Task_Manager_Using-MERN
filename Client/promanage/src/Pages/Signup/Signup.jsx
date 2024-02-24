import React from 'react';
import Side from '../../Components/sideComponent/Side';
import style from './Style.module.css';
import SignForm from '../../Components/SignupForm/SignForm';

function Signup() {
  return (
    <div className={style.main}>
      <div className={style.leftContainer}>
        <Side/>
      </div>
      <div className={style.rightContainer}>
        <SignForm/>
      </div>
    </div>
  );
}

export default Signup;
