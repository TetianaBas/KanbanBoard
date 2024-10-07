//home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'; // Ensure you have created a corresponding CSS module

const Home = () => {
    let navigate = useNavigate();
    

    return (
        <div className={styles.homeContainer}>
            <h1>Welcome to the Kanban Board</h1>
            <p className={styles.homeDescription}>
                Organize your work, streamline your processes, and boost productivity in a fun and flexible way. 
            </p>
            <button 
                className={styles.homeButton} 
                onClick={() => navigate('/login')}>
                Log In to Get Started
            </button>
            <button 
                className={styles.homeButton} 
                onClick={() => navigate('/signup')}>
                Sign Up
            </button>
        </div>
    );
};

export default Home;
