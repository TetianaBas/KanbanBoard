import React, { useState } from 'react';
import styles from './Task.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router'

// Functional component for individual tasks
const Task = ({ id, title, subtasks, onMove, status, parent_id }) => {
    const navigate = useNavigate() // Hook for navigation within React Router

    // State variables for managing collapse, edit mode, and new title
    const [collapsed, setCollapsed] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

    // Function to toggle collapse of subtasks
    const toggleCollapse = () => {
        if (subtasks && subtasks.length > 0) {
            setCollapsed(!collapsed);
        }
    };

    // Function to toggle edit mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Function to handle changes in title input
    const handleChangeTitle = (e) => {
        setNewTitle(e.target.value);
    };

    // Function to update task title
    const handleUpdateTitle = async () => {
        try {
            const response = await fetch(`/update_task/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
                credentials: 'include',
            });
            if (response.ok) {
                setIsEditing(false); // Exit edit mode
                navigate(0); // Refresh the page or update the state to reflect the change
            } else {
                console.error('Failed to update task title');
            }
        } catch (error) {
            console.error('Error updating task title:', error);
        }
    };

    // Function to recursively delete a task and its subtasks by ID
    const handleDelete = async (e, taskId) => {
        e.preventDefault()
        try {
            const response = await fetch(`/complete_task/${taskId}`, {
                method: 'POST',
                credentials: 'include', 
            });
            if (!response.ok) throw new Error('Failed to delete the task');

            // Refresh page after deletion
            navigate(0)
        } catch (error) {
            console.error(error);
        }
    };

    // Function to handle moving task to different status
    const handleMove = async (newStatus) => {
        try {
            const response = await fetch(`/move_task/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_status: newStatus }),
                credentials: 'include',
            });
            if (response.ok) {
                onMove(id, newStatus);
            } else {
                console.error('Failed to move task');
            }
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    // Function to render move options based on current status
    const renderMoveOptions = (currentStatus) => {
        const statuses = ["To Do", "In Progress", "Review"];
        return statuses.filter(status => status !== currentStatus).map(status => (
            <option key={status} value={status}>{status}</option>
        ));
    };

    return (
        <div className={styles.task}>
            <div className={styles.taskHeader} onClick={toggleCollapse}>
                <div className={styles.taskDescription}>
                    {subtasks && subtasks.length > 0 && (
                        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} className={styles.collapseIcon} />
                    )}
                    {isEditing ? (
                        <input
                            type="text"
                            value={newTitle}
                            onChange={handleChangeTitle}
                            onBlur={handleUpdateTitle} 
                            autoFocus
                        />
                    ) : (
                        <span>{title}</span>
                    )}
                </div>
                <div className={styles.taskButtons}>
                    <button className={styles.editButton} onClick={toggleEdit}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className={styles.deleteButton} onClick={(e) => handleDelete(e, id)}>
                        <FontAwesomeIcon icon={faTrashAlt } />
                    </button>
                </div> 
            </div>
            {/* Render subtasks if not collapsed */}
            {!collapsed && subtasks && subtasks.length > 0 && (
                <div className={`${styles.subtasks} ${collapsed ? styles.collapsed : styles.expanded}`}>
                    {subtasks.map((subtask) => (
                        <Task
                            key={subtask.id}
                            id={subtask.id}
                            title={subtask.title}
                            subtasks={subtask.subtasks}
                            onMove={handleMove}
                            status={status}
                            parent_id={subtask.parent_id} // pass this down to subtasks
                        />
                    ))}
                </div>
            )}
            {/* Render move dropdown only for top-level tasks */}
            {parent_id == null ? (
                <div className={styles.moveTask}>
                    <select className={styles.moveDropdown} onChange={(e) => handleMove(e.target.value)}>
                        <option value="">Move To...</option>
                        {renderMoveOptions(status)}
                    </select>
                </div>
            ) : null}
        </div>
    );
};

export default Task;
