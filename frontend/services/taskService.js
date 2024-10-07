// src/services/taskService.js

// Function to add a new task
export const addTask = async (taskData) => {
    try {
        const response = await fetch(`/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
            credentials: 'include', // Include credentials for session cookie handling
        });
        if (!response.ok) {
            throw new Error('Error creating task');
        }
        return await response.json(); // Return the JSON response from the server
    } catch (error) {
        console.error('Failed to add task:', error); // Log error if adding task fails
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Function to fetch all tasks
export const fetchTasks = async () => {
    try {
        const response = await fetch(`/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials for session cookie handling
        });
        if (!response.ok) {
            throw new Error('Error fetching tasks');
        }
        const taskData = await response.json(); // Parse the JSON response
        console.log('task data from fetch function in services ', taskData); // Log the fetched task data
        return taskData; // Return the fetched task data
    } catch (error) {
        console.error('Failed to fetch tasks:', error); // Log error if fetching tasks fails
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Function to move a task to a new status
export const moveTask = async (taskId, newStatus) => {
    const response = await fetch(`/tasks/move/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include authorization headers if necessary
        },
        body: JSON.stringify({ status: newStatus }), // Send JSON data with new status
    });
    if (!response.ok) {
        throw new Error('Failed to move task');
    }
    return response.json(); // Return the JSON response from the server
};
