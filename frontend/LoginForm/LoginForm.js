//LoginForm.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css'; // Make sure the path is correct

import { AuthContext } from '../../context/AuthContext';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { logIn } = useContext(AuthContext); // Context for handling login
    let navigate = useNavigate();
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Handle login success (e.g., storing auth tokens, redirecting)
                console.log(data.message);
                logIn(); // Update login state context or manage session
                navigate('/board'); // Redirect to the board or dashboard
            } else {
                // Handle login failure (show error message)
                console.error(data.error);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    

    return (
        <div className={styles.loginForm}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.loginInput}
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
                        className={styles.loginInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <button type="submit" className={styles.loginButton}>
                        Log In
                    </button>
                </div>
                <div className={styles.formGroup}>
                    <button type="button" className={styles.signupButton} onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
