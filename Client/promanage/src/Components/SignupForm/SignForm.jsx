


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Style.module.css';
import { Lock, Mail, User } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';

function SignForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (formData) => {
        try {

            const currentDate = new Date();
        // Add the current date to the form data
            formData.createdDate = currentDate.toISOString(); 


          const response = await fetch("http://localhost:4000/api/user/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const responseData = await response.json();
          const { user, token } = responseData;
    
          console.log(user);
          console.log(token);
    
          window.localStorage.setItem("user", JSON.stringify(user));
          window.localStorage.setItem("name", user.name);
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("createdDate", currentDate.toISOString());

          navigate('/login');
          toast.success('Signup Succesfully', {
            position: 'top-center'
          });
    
        } catch (error) {
            console.error("Error during registration:", error);
            console.error("Error during fetching", error);
            alert("There was an error during signup. Please try again later.");
            if (error.message === "Email already exists") {
                setErrorMessage("Email already exists. Please use a different email address.");
                alert("Email exist")
            } else {
                setErrorMessage("Registration failed. Please try again later.");
            }
         
        }
      }

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Sign UP</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formValues}>
                    <User className={styles.icon}/>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Name"
                        {...register('name', { required: true })}
                    />
                    
                </div>
                {errors.name && <div style={{color:"red"}}>Name is required</div>}
                <div className={styles.formValues}>
                    <Mail className={styles.icon}/>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true })}
                    />
                   
                </div>
                {errors.email && <div style={{color:"red"}}>Email is required</div>}
                <div className={styles.formValues}>
                    <Lock className={styles.icon}/>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: true, minLength: 6 })}
                    />
                   
                </div>
                {errors.password && <div style={{color:"red"}}>Password is required (min length: 6)</div>}
                <div className={styles.formValues}>
                    <Lock className={styles.icon}/>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: value => value === watch('password')
                        })}
                    />
                    
                </div>
                {errors.confirmPassword && <div style={{color:"red"}}>Passwords do not match</div>}
                <button type="submit" className={styles.signbutton}>Register</button>
            </form>
             <p className={styles.footerDes}> Have an account ? </p>
                <button className={styles.loginbtns} onClick={() => navigate("/Login")}>Log in</button>
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        </div>
        
    );
    
}

export default SignForm;





