// Header.js
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { isLoggedIn, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logOut(); // Sets the user as logged out
        navigate('/'); // Redirects to the home page
    };

    const handleAddTask = () => {
        navigate('/add-task'); 
    };

    // Check if the current route is '/add-task'
    const isAddTaskPage = location.pathname === '/add-task';

    return (
        <header className={styles.header}>
            <h1>Kanban Board</h1>
            {isLoggedIn && !isAddTaskPage && (
                <button onClick={handleAddTask} className={styles.addTaskButton}>
                    Add Task
                </button>
            )}
            {isLoggedIn && (
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Log Out
                </button>
            )}
        </header>
    );
};

export default Header;
