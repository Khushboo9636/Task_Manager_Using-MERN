
import React from 'react';
import style from './Style.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'react-feather';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();

      const { user, token } = responseData;
    
      console.log(user);
      console.log(token);
    
      console.log(responseData);
      window.localStorage.setItem('name', responseData.user.name);
      window.localStorage.setItem('email', responseData.user.email);
      window.localStorage.setItem('token', responseData.token);
      navigate('/dashboard');
    } catch (error) {
      console.log(error.message);
      alert('There was a problem with the request, please try again');
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.heading}>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.formValues}>
          <Mail className={style.icon}/>
          <input
            className={style.input}
            type="email"
            {...register('email', { required: true })}
            placeholder='Email'
          />
          
        </div>
        {errors.email && <div style={{color:"red"}}>Email is required</div>}
        <div className={style.formValues}>
          <Lock className={style.icon}/>
          <input
            className={style.input}
            type="password"
            {...register('password', { required: true })}
            placeholder='Password'
          />
          
        </div>
        {errors.password && <div style={{color:"red"}}>Password is required</div>}
        <button type="submit" className={style.loginbtns}>Login</button>
      </form>
      <p className={style.footerDes}>Don't have an account yet?</p>
      <button className={style.signbutton} onClick={() => navigate('/')}>Register</button>
    </div>
  );
}

export default LoginForm;




