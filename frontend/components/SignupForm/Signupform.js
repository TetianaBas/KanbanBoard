// SignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupForm.module.css'; 

const SignupForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    let navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: password }),
            });
            const data = await response.json(); // Parse JSON response
            if (response.ok) {
                navigate('/login'); // Redirect to the login page on successful signup
            } else if (data.redirectToLogin) {
                alert(data.error); // Alert the user about the issue
                navigate('/login'); // Redirect to login if the email is already used
            } else {
                throw new Error(data.error || 'Failed to sign up');
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    return (
        <div className={styles.signupForm}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.signupInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.signupInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.signupButton}>
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;
