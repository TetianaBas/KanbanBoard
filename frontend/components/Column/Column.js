// Column.js
import React from 'react';
import styles from './Column.module.css';
import Task from '../Task/Task';

const Column = ({ title, tasks, onMove }) => (
    <section className={styles.column}>
        <h2 className={styles.columnHeader}>{title}</h2>
        {tasks.map((task) => (
            <Task
                key={task.id}
                id={task.id}
                title={task.title} 
                subtasks={task.subtasks} 
                // onDelete={onDelete}
                onMove={onMove}
                status={task.status}
                
            />
        ))}
    </section>
);

export default Column;
