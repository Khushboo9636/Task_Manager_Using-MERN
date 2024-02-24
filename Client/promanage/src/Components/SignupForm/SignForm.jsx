

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Style.module.css';

function SignForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

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
         
    
        } catch (error) {
          console.error("Error during fetching", error);
          alert("There was an error during signup. Please try again later.");
        }
      }

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Sign UP</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formValues}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Name"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <span>Name is required</span>}
                </div>
                <div className={styles.formValues}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true })}
                    />
                    {errors.email && <span>Email is required</span>}
                </div>
                <div className={styles.formValues}>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: true, minLength: 6 })}
                    />
                    {errors.password && <span>Password is required (min length: 6)</span>}
                </div>
                <div className={styles.formValues}>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: value => value === watch('password')
                        })}
                    />
                    {errors.confirmPassword && <span>Passwords do not match</span>}
                </div>
                <button type="submit" className={styles.button}>Sign UP</button>
            </form>
             <p> Have an account ? </p>
                <button className={styles.underline} onClick={() => navigate("/Login")}>Sign in</button>
        </div>
    );
}

export default SignForm;





