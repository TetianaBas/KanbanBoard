// Board.js

import React, { useState, useEffect } from 'react';
import styles from './Board.module.css';
import Column from '../Column/Column';
import { fetchTasks } from '../../services/taskService'; 

const Board = () => {
    const [tasks, setTasks] = useState([]);

    const organizeTasks = (tasks) => {
        // Create a map of all tasks
        const taskMap = new Map(tasks.map(task => [task.id, {...task, subtasks: []}]));
      
        // Assign subtasks to their parents recursively
        tasks.forEach(task => {
          if (task.parent_id) {
            const parentTask = taskMap.get(task.parent_id);
            if (parentTask) {
              parentTask.subtasks.push(taskMap.get(task.id));
            }
          }
        });
      
        // Filter out top-level tasks
        return tasks.filter(task => task.parent_id === null).map(task => taskMap.get(task.id));
      };
      
      useEffect(() => {
        // Fetch tasks when the component mounts
        const loadTasks = async () => {
          try {
            const fetchedTasks = await fetchTasks();
            const organizedTasks = organizeTasks(fetchedTasks);
            setTasks(organizedTasks);
            console.log('Organized tasks:', organizedTasks);
          } catch (error) {
            console.error("Failed to load tasks:", error);
          }
        };
      
        loadTasks();
      }, []);



    // Helper function to filter tasks by status
    const filterTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };


    // Function to move a task to a new status
    const onMove = async (taskId, newStatus) => {
        try {
            const response = await fetch(`/move_task/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_status: newStatus }),
                credentials: 'include',
            });
            if (response.ok) {
                // If move is successful, update tasks state to reflect the change
                setTasks(prevTasks => {
                    return prevTasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, status: newStatus };
                        }
                        return task;
                    });
                });
            } else {
                console.error('Failed to move task');
            }
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };
        
    return (
        <main className={styles.board}>
            <Column 
                title="To Do" 
                tasks={filterTasksByStatus('To Do')} 
                onMove={onMove}
            />
            <Column 
                title="In Progress" 
                tasks={filterTasksByStatus('In Progress')} 
                onMove={onMove} 
            />
            <Column 
                title="Review" 
                tasks={filterTasksByStatus('Review')} 
                onMove={onMove} 
            />
        </main>
    );
};

export default Board;
